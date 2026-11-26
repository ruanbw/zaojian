<script setup lang="ts">
import { promptChips } from '@/constants/content'
import type { HistoryRecord } from '@/utils/history'
import { clearHistory, formatTime, loadHistory, MAX_RECORDS, saveHistory } from '@/utils/history'
import {
  chooseReferenceFile,
  compressImage,
  MAX_REFERENCE_SIZE,
} from '@/utils/image'

defineOptions({ name: 'GeneratePage' })

useHead({ title: '造间 · 生成设计图' })

const INITIAL_HINT = '写下至少几个词，让空间有据可依。'

const prompt = ref('')
const hint = ref(INITIAL_HINT)
// 打开历史记录时暂存的描述，只在用户点「继续生成」时才写回输入框
const historyPrompt = ref('')
const referenceData = ref('')
const sceneImage = ref('')
const resultReference = ref('')
const echoText = ref('')
const resultMeta = ref('')
// 存储告警与时间戳分开存放，互不覆盖
const resultNotice = ref('')
const editLabel = ref('修改描述')
const records = ref<HistoryRecord[]>([])
const composerVisible = ref(true)
const resultVisible = ref(false)
const loadingVisible = ref(false)
const proofVisible = ref(false)
const editVisible = ref(false)
const loading = ref(false)
const previewVisible = ref(false)
const zoom = ref(1)
const resultImageFailed = ref(false)

const route = useRoute()
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const previewCloseRef = ref<HTMLButtonElement | null>(null)
// 记录加载失败的缩略图，避免整表重渲染
const failedThumbnails = reactive(new Set<string>())
// 系统「减弱动态效果」可以随时切换，这里跟着变
const reduceMotion = ref(false)

let controller: AbortController | undefined
let motionQuery: MediaQueryList | undefined
let previewTrigger: HTMLElement | null = null

const count = computed(() => prompt.value.length)
const canSubmit = computed(() => prompt.value.trim().length > 0)
const hasReference = computed(() => referenceData.value.length > 0)

function scrollTo(selector: string) {
  nextTick(() => {
    document
      .querySelector(selector)
      ?.scrollIntoView({ behavior: reduceMotion.value ? 'auto' : 'smooth', block: 'start' })
  })
}

function goHome() {
  if (window.history.state?.back)
    window.history.back()
  else
    navigateTo('/')
}

function showProof(record: HistoryRecord, fromHistory = false) {
  echoText.value = record.prompt
  sceneImage.value = record.image
  // 历史记录不再保存参考图本体，只有本次生成还持有
  resultReference.value = fromHistory ? '' : referenceData.value
  resultMeta.value = `生成于 ${formatTime(record.createdAt)}`
  resultNotice.value = ''
  resultImageFailed.value = false
  editLabel.value = fromHistory ? '继续生成' : '修改描述'
  // 只暂存历史描述，点开记录不会覆盖正在写的草稿
  historyPrompt.value = fromHistory ? record.prompt : ''
  hint.value = ''
  composerVisible.value = false
  resultVisible.value = true
  loadingVisible.value = false
  proofVisible.value = true
  editVisible.value = true
  scrollTo('.result')
}

function openPreview() {
  if (!sceneImage.value)
    return
  // 记住触发元素，关闭时把焦点还回去
  previewTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
  zoom.value = 1
  previewVisible.value = true
  nextTick(() => previewCloseRef.value?.focus())
}

function closePreview() {
  if (!previewVisible.value)
    return
  previewVisible.value = false
  const trigger = previewTrigger
  previewTrigger = null
  nextTick(() => trigger?.focus())
}

function changeZoom(delta: number) {
  // 图片已自适应容器，缩小没有意义，只放大到 3 倍
  zoom.value = Math.min(3, Math.max(1, Number((zoom.value + delta).toFixed(2))))
}

function onPreviewKeydown(event: KeyboardEvent) {
  if (!previewVisible.value)
    return
  if (event.key === 'Escape')
    closePreview()
  else if (event.key === '+' || event.key === '=')
    changeZoom(0.25)
  else if (event.key === '-')
    changeZoom(-0.25)
}

watch(previewVisible, (visible) => {
  document.body.style.overflow = visible ? 'hidden' : ''
})

function applyChip(value: string) {
  // 灵感是追加而不是覆盖，避免抹掉已经写好的描述
  const current = prompt.value.trim()
  const merged = current ? `${current}，${value}` : value
  prompt.value = merged.slice(0, 120)
  nextTick(() => textareaRef.value?.focus())
}

async function addReference() {
  const file = await chooseReferenceFile()
  if (!file)
    return

  if (file.size > MAX_REFERENCE_SIZE) {
    hint.value = '图片过大，请选择 12MB 以内的图片。'
    return
  }

  try {
    referenceData.value = await compressImage(file)
    hint.value = '参考图已添加。当前模型只支持人物主体参考，空间照片仅作风格参考。'
  }
  catch {
    hint.value = '读取图片失败，请换一张再试。'
  }
}

function removeReference() {
  referenceData.value = ''
  hint.value = '参考图已移除。'
}

async function submit() {
  const text = prompt.value.trim()
  if (!text || loading.value)
    return

  const ctrl = new AbortController()
  controller = ctrl
  let timedOut = false
  // 客户端比服务端总预算（100 秒）多留 20 秒余量
  const timeout = setTimeout(() => {
    timedOut = true
    ctrl.abort()
  }, 120_000)
  echoText.value = text
  composerVisible.value = false
  resultVisible.value = true
  loadingVisible.value = true
  proofVisible.value = false
  editVisible.value = false
  loading.value = true
  hint.value = '正在生成，通常需要十几秒…'

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text, reference: referenceData.value }),
      signal: ctrl.signal,
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok)
      throw new Error(errorMessageOf(data, response.status))

    const image = resolveImageUrl(data)
    if (!image)
      throw new Error('生成结果缺少图片地址')

    const record: HistoryRecord = {
      id: String(Date.now()),
      prompt: text,
      hasReference: hasReference.value,
      image,
      createdAt: new Date().toISOString(),
    }
    loading.value = false
    showProof(record)

    const items = loadHistory()
    items.unshift(record)
    if (saveHistory(items))
      records.value = items.slice(0, MAX_RECORDS)
    else
      resultNotice.value = '本机存储空间不足，本次记录未保存。'
  }
  catch (error) {
    loading.value = false
    composerVisible.value = true
    resultVisible.value = false
    loadingVisible.value = false
    const name = errorName(error)
    if (timedOut)
      hint.value = '生成超时，请重试。'
    else if (name === 'AbortError')
      hint.value = '已取消本次生成。'
    else
      hint.value = `生成失败：${error instanceof Error ? error.message : '未知错误'}`
  }
  finally {
    clearTimeout(timeout)
    if (controller === ctrl)
      controller = undefined
  }
}

/** 后端返回相对路径时同源可直接使用 */
function resolveImageUrl(data: { image?: string, path?: string }): string {
  if (data.path)
    return data.path
  return data.image || ''
}

/**
 * Nitro 的错误体形如 { error: true, statusMessage, message }，
 * 其中 error 是布尔值，真正的说明在 message / statusMessage 里。
 */
function errorMessageOf(data: unknown, status: number): string {
  if (data && typeof data === 'object') {
    const body = data as { message?: unknown, statusMessage?: unknown }
    if (typeof body.message === 'string' && body.message)
      return body.message
    if (typeof body.statusMessage === 'string' && body.statusMessage)
      return body.statusMessage
  }
  return `HTTP ${status}`
}

/** DOMException 在部分环境下不是 Error 实例，这里只取 name */
function errorName(error: unknown): string {
  return typeof error === 'object' && error !== null && 'name' in error
    ? String((error as { name: unknown }).name)
    : ''
}

function editPrompt() {
  const generating = Boolean(controller)
  controller?.abort()
  loading.value = false
  resultVisible.value = false
  composerVisible.value = true
  editVisible.value = false
  editLabel.value = '修改描述'
  // 用户点「继续生成」才用这条历史描述，否则保留正在写的草稿
  if (historyPrompt.value) {
    prompt.value = historyPrompt.value
    historyPrompt.value = ''
  }
  // 生成中被中断时，错误文案由 submit 的 catch 覆盖
  if (!generating)
    hint.value = INITIAL_HINT
  scrollTo('.composer')
  nextTick(() => textareaRef.value?.focus())
}

function cancelGenerate() {
  if (!controller)
    return
  controller.abort()
}

function clearAllHistory() {
  if (!window.confirm('清空全部历史生成记录？'))
    return

  clearHistory()
  records.value = []
  failedThumbnails.clear()
  hint.value = '历史记录已清空。'
}

function syncReduceMotion() {
  reduceMotion.value = motionQuery?.matches ?? false
}

onMounted(() => {
  window.addEventListener('keydown', onPreviewKeydown)
  records.value = loadHistory()

  // 跟随系统「减弱动态效果」的实时变化
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  syncReduceMotion()
  motionQuery.addEventListener('change', syncReduceMotion)

  // 首页案例点进来时带上 ?p= 描述
  const preset = route.query.p
  if (typeof preset === 'string' && preset.trim() && preset.length <= 120) {
    prompt.value = preset
    nextTick(() => textareaRef.value?.focus())
  }
})
onUnmounted(() => {
  window.removeEventListener('keydown', onPreviewKeydown)
  motionQuery?.removeEventListener('change', syncReduceMotion)
  document.body.style.overflow = ''
  controller?.abort()
})
</script>

<template>
  <div class="plaster" aria-hidden="true" />

  <main class="mx-auto w-full max-w-[440px] px-6 pt-[calc(28px+env(safe-area-inset-top))] pb-[calc(40px+env(safe-area-inset-bottom))]">
    <header class="flex items-baseline justify-between gap-4 border-b border-line pb-3.5">
      <button
        class="flex items-baseline gap-1.5 font-serif text-[22px] font-semibold tracking-[0.14em] text-inherit"
        aria-label="返回首页"
        @click="goHome"
      >
        <span class="font-sans text-[17px]" aria-hidden="true">←</span>
        造间
      </button>
      <span class="text-xs tracking-[0.08em] text-muted">空间灵感生成</span>
    </header>

    <section class="relative pt-12 pb-[38px]">
      <span class="pointer-events-none absolute top-0.5 -right-1.5 select-none font-serif text-[188px] leading-none text-clay/[0.075]" aria-hidden="true">间</span>
      <h1 class="relative m-0 font-serif text-[clamp(30px,9vw,38px)] font-semibold leading-[1.42] tracking-[0.02em]">
        把想象中的家<br>描述出来
      </h1>
      <p class="relative mt-[18px] max-w-[19em] text-sm text-muted">
        写下空间、风格与光线，生成一张属于你的室内效果图。
      </p>
    </section>

    <section v-if="composerVisible" id="composer" class="composer">
      <label for="prompt" class="mb-2.5 block text-[13px] tracking-[0.06em]">你的空间描述</label>
      <div class="field relative rounded-2xl border border-line bg-paper/62 transition-[border-color,box-shadow,background] duration-200 focus-within:border-clay focus-within:bg-plaster-light focus-within:shadow-[0_0_0_4px_var(--color-clay-halo)]">
        <textarea
          id="prompt"
          ref="textareaRef"
          v-model="prompt"
          rows="3"
          :maxlength="120"
          placeholder="例如：朝南的客厅，原木家具，米白墙面，午后的光落在地板上"
          class="block min-h-[108px] w-full resize-y rounded-[inherit] border-0 bg-transparent px-[18px] pt-[18px] pb-[34px] text-[15px] leading-[1.7] text-ink outline-0 placeholder:text-placeholder"
        />
        <span class="absolute right-4 bottom-[11px] text-xs text-muted tabular-nums">{{ count }}/120</span>
      </div>

      <div class="my-3.5 flex flex-wrap gap-2">
        <button
          v-for="chip in promptChips"
          :key="chip.label"
          class="rounded-full border border-line px-3 py-[7px] text-xs text-muted transition-[border-color,color,background] duration-200 hover:border-clay hover:text-clay-deep active:bg-clay-wash"
          @click="applyChip(chip.prompt)"
        >
          {{ chip.label }}
        </button>
      </div>

      <div>
        <button class="border-b border-dashed border-clay bg-transparent py-[7px] text-left text-[13px] text-clay-deep" @click="addReference">
          ＋ 添加参考图
        </button>

        <span v-if="hasReference" class="relative mt-2.5 inline-flex">
          <img :src="referenceData" alt="已选择的参考图" class="block h-[76px] w-[76px] rounded-xl border border-line object-cover">
          <button
            class="absolute -top-2 -right-2 h-6 w-6 rounded-full border border-line bg-plaster-light text-[15px] leading-none text-ink"
            aria-label="移除参考图"
            @click="removeReference"
          >
            ×
          </button>
        </span>
      </div>

      <!-- 按钮阴影里的纯白高光与深棕投影不属于设计 token，保持原值 -->
      <button
        class="mt-3.5 min-h-14 w-full rounded-2xl bg-clay text-base font-semibold tracking-[0.08em] text-cream shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_8px_22px_-14px_rgb(99_61_38/0.7)] transition-[background,transform,box-shadow] duration-200 hover:not-disabled:bg-clay-deep active:not-disabled:translate-y-px active:not-disabled:shadow-[inset_0_1px_0_rgb(255_255_255/0.1)] disabled:cursor-not-allowed disabled:bg-clay-soft disabled:text-cream-soft disabled:shadow-none"
        :disabled="!canSubmit || loading"
        @click="submit"
      >
        {{ loading ? '正在构思空间…' : '生成设计图' }}
      </button>
    </section>

    <section v-if="resultVisible" class="result" aria-live="polite">
      <div v-if="loadingVisible" class="grid aspect-square place-content-center gap-[18px] rounded-[20px] border border-line bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-paper)_70%,transparent),color-mix(in_srgb,var(--color-sand)_55%,transparent))] p-[30px] text-center text-[13px] text-muted">
        <div class="mx-auto grid w-[150px] gap-2.5" aria-hidden="true">
          <span class="h-2 rounded-full bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-clay)_6%,transparent),color-mix(in_srgb,var(--color-clay)_22%,transparent),color-mix(in_srgb,var(--color-clay)_6%,transparent))] bg-[length:200%_100%] animate-sweep" />
          <span class="h-2 w-[78%] animate-sweep [animation-delay:0.15s] rounded-full bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-clay)_6%,transparent),color-mix(in_srgb,var(--color-clay)_22%,transparent),color-mix(in_srgb,var(--color-clay)_6%,transparent))] bg-[length:200%_100%]" />
          <span class="h-2 w-[55%] animate-sweep [animation-delay:0.3s] rounded-full bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-clay)_6%,transparent),color-mix(in_srgb,var(--color-clay)_22%,transparent),color-mix(in_srgb,var(--color-clay)_6%,transparent))] bg-[length:200%_100%]" />
        </div>
        <p>正在把描述变成空间…</p>
      </div>

      <button
        v-if="loading"
        class="mx-auto mt-4 block border-b border-clay bg-transparent px-1 py-1.5 text-xs text-clay-deep"
        @click="cancelGenerate"
      >
        取消生成
      </button>

      <figure v-if="proofVisible" class="m-0">
        <img
          v-if="!resultImageFailed"
          class="block aspect-square w-full cursor-zoom-in rounded-[20px] border border-line bg-sand object-cover"
          :src="sceneImage"
          alt="生成的效果图，点击可放大预览"
          title="点击预览"
          @click="openPreview"
          @error="resultImageFailed = true"
        >
        <div
          v-else
          class="grid aspect-square w-full place-items-center rounded-[20px] border border-line bg-sand text-[13px] text-muted"
        >
          图片已失效
        </div>
        <figcaption class="flex items-start gap-2.5 pt-4">
          <span class="mt-0.5 inline-block shrink-0 rounded-full border border-sage/45 px-2 py-px text-[11px] leading-[1.6] text-sage">生成结果</span>
          <span class="min-w-0 flex-1">
            <p class="m-0 line-clamp-2 text-[13px] text-muted">{{ echoText }}</p>
            <p class="mt-1 mb-0 text-[11px] text-muted">{{ resultMeta }}</p>
            <p v-if="resultNotice" class="mt-1 mb-0 text-[11px] text-clay-deep">{{ resultNotice }}</p>
          </span>
          <img
            v-if="resultReference"
            class="ml-auto h-[46px] w-[46px] rounded-[10px] border border-line object-cover"
            :src="resultReference"
            alt="本次使用的参考图"
          >
        </figcaption>
      </figure>

      <button v-if="editVisible" class="mx-auto mt-6 block border-b border-clay bg-transparent px-1 py-2 text-sm text-clay-deep" @click="editPrompt">
        {{ editLabel }}
      </button>
    </section>

    <!-- 提示独立于两栏之外，生成期间也能看到「正在生成…」 -->
    <p class="mt-3 text-center text-xs text-muted" aria-live="polite">
      {{ hint }}
    </p>

    <section v-if="records.length" class="mt-11 border-t border-line pt-5">
      <div class="mb-4 flex items-baseline justify-between gap-3">
        <h2 class="m-0 font-serif text-[18px] font-semibold tracking-[0.08em]">历史生成</h2>
        <button class="border-0 bg-transparent text-xs text-muted" @click="clearAllHistory">
          清空
        </button>
      </div>
      <div class="grid gap-2.5">
        <button
          v-for="record in records"
          :key="record.id"
          class="grid w-full grid-cols-[80px_1fr] items-center gap-3 rounded-[14px] border border-line bg-paper/45 p-2 text-left text-inherit transition-colors duration-200 hover:border-clay"
          @click="showProof(record, true)"
        >
          <span class="grid h-20 w-20 place-items-center overflow-hidden rounded-[9px] bg-sand">
            <img
              v-if="!failedThumbnails.has(record.id)"
              class="h-full w-full object-cover"
              :src="record.image"
              alt=""
              loading="lazy"
              @error="failedThumbnails.add(record.id)"
            >
            <span v-else class="px-1 text-center text-[11px] leading-tight text-muted">已失效</span>
          </span>
          <span class="min-w-0">
            <span class="line-clamp-2 text-[13px] leading-[1.5]">{{ record.prompt }}</span>
            <span class="mt-1.5 block text-[11px] text-muted">
              {{ (record.hasReference ? '含参考图 · ' : '') + formatTime(record.createdAt) }}
            </span>
          </span>
        </button>
      </div>
    </section>
  </main>

  <div
    v-if="previewVisible"
    class="fixed inset-0 z-1000 flex flex-col bg-veil/90 p-6"
    role="dialog"
    aria-modal="true"
    aria-label="预览生成结果"
    tabindex="-1"
    @click.self="closePreview"
  >
    <!-- 缩放容器：按百分比撑出真实尺寸，父级才有可滚动的区域 -->
    <div
      class="mx-auto flex w-full max-w-[min(680px,60vh)] min-h-0 flex-1 overflow-auto"
      @click.self="closePreview"
    >
      <div
        class="m-auto shrink-0 transition-[width] duration-150"
        :style="{ width: `${zoom * 100}%` }"
      >
        <img class="block h-auto w-full object-contain" :src="sceneImage" alt="生成结果放大预览">
      </div>
    </div>
    <div class="mt-4 flex items-center gap-3" @click.stop>
      <button class="min-h-11 min-w-11 rounded-xl border border-cream/35 bg-cream/10 px-3.5 text-lg text-cream" aria-label="缩小" @click="changeZoom(-0.25)">
        −
      </button>
      <span class="min-w-[52px] text-center text-[13px] text-cream tabular-nums">{{ Math.round(zoom * 100) }}%</span>
      <button class="min-h-11 min-w-11 rounded-xl border border-cream/35 bg-cream/10 px-3.5 text-lg text-cream" aria-label="放大" @click="changeZoom(0.25)">
        ＋
      </button>
      <button ref="previewCloseRef" class="min-h-11 rounded-xl border border-cream/35 bg-cream/10 px-3.5 text-sm text-cream" aria-label="关闭预览" @click="closePreview">
        关闭
      </button>
    </div>
  </div>
</template>
