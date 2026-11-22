<script setup lang="ts">
import { API_BASE, promptChips } from '@/constants/content'
import type { HistoryRecord } from '@/utils/history'
import { clearHistory, formatTime, loadHistory, saveHistory } from '@/utils/history'
import {
  chooseReferenceFile,
  compressImage,
  MAX_REFERENCE_SIZE,
} from '@/utils/image'

defineOptions({ name: 'GeneratePage' })
definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '造间 · 生成设计图',
  },
})

const prompt = ref('')
const hint = ref('写下至少几个词，让空间有据可依。')
const referenceData = ref('')
const sceneImage = ref('')
const resultReference = ref('')
const echoText = ref('')
const resultMeta = ref('')
const editLabel = ref('修改描述')
const records = ref<HistoryRecord[]>(loadHistory())
const composerVisible = ref(true)
const resultVisible = ref(false)
const loadingVisible = ref(false)
const proofVisible = ref(false)
const editVisible = ref(false)
const loading = ref(false)
const previewVisible = ref(false)
const zoom = ref(1)

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
let controller: AbortController | undefined

const count = computed(() => prompt.value.length)
const canSubmit = computed(() => prompt.value.trim().length > 0)
const hasReference = computed(() => referenceData.value.length > 0)

function scrollTo(selector: string) {
  nextTick(() => {
    document
      .querySelector(selector)
      ?.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' })
  })
}

function goHome() {
  if (getCurrentPages().length > 1)
    uni.navigateBack()
  else
    uni.reLaunch({ url: '/pages/index/index' })
}

function showProof(record: HistoryRecord, fromHistory = false) {
  echoText.value = record.prompt
  sceneImage.value = record.image
  resultReference.value = record.reference
  resultMeta.value = `生成于 ${formatTime(record.createdAt)}`
  editLabel.value = fromHistory ? '继续生成' : '修改描述'
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
  zoom.value = 1
  previewVisible.value = true
}

function closePreview() {
  previewVisible.value = false
}

function changeZoom(delta: number) {
  zoom.value = Math.min(3, Math.max(0.5, Number((zoom.value + delta).toFixed(2))))
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
  prompt.value = value
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
    hint.value = '参考图已添加，会随本次请求一起发送。'
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

  controller = new AbortController()
  const timeout = setTimeout(() => controller?.abort(), 180_000)
  echoText.value = text
  composerVisible.value = false
  resultVisible.value = true
  loadingVisible.value = true
  proofVisible.value = false
  editVisible.value = false
  loading.value = true
  hint.value = '正在生成，通常需要十几秒…'

  try {
    const response = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text, reference: referenceData.value }),
      signal: controller.signal,
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok)
      throw new Error(data.error || `HTTP ${response.status}`)

    const record: HistoryRecord = {
      id: String(Date.now()),
      prompt: text,
      reference: referenceData.value,
      image: data.image || data.path,
      createdAt: new Date().toISOString(),
    }
    loading.value = false
    showProof(record)

    const items = loadHistory()
    items.unshift(record)
    if (saveHistory(items))
      records.value = loadHistory()
    else
      resultMeta.value = '本机存储空间不足，本次记录未保存。'
  }
  catch (error) {
    loading.value = false
    composerVisible.value = true
    resultVisible.value = false
    loadingVisible.value = false
    hint.value = error instanceof Error && error.name === 'AbortError'
      ? '生成超时，请重试。'
      : `生成失败：${error instanceof Error ? error.message : '未知错误'}`
  }
  finally {
    clearTimeout(timeout)
    controller = undefined
  }
}

function editPrompt() {
  controller?.abort()
  loading.value = false
  resultVisible.value = false
  composerVisible.value = true
  editLabel.value = '修改描述'
  scrollTo('.composer')
  nextTick(() => textareaRef.value?.focus())
}

async function clearAllHistory() {
  const { confirm } = await uni.showModal({
    title: '清空历史',
    content: '清空全部历史生成记录？',
  })
  if (!confirm)
    return

  clearHistory()
  records.value = []
  hint.value = '历史记录已清空。'
}

onMounted(() => window.addEventListener('keydown', onPreviewKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onPreviewKeydown)
  document.body.style.overflow = ''
  controller?.abort()
})
</script>

<template>
  <div class="plaster" aria-hidden="true" />

  <main class="page">
    <header class="masthead">
      <button class="brand" @click="goHome">
        造间
      </button>
      <span class="brand-note">空间灵感生成</span>
    </header>

    <section class="intro">
      <span class="ghost" aria-hidden="true">间</span>
      <h1>把想象中的家<br>描述出来</h1>
      <p>写下空间、风格与光线，生成一张属于你的室内效果图。</p>
    </section>

    <section v-if="composerVisible" id="composer" class="composer">
      <label for="prompt">你的空间描述</label>
      <div class="field">
        <textarea
          id="prompt"
          ref="textareaRef"
          v-model="prompt"
          rows="3"
          :maxlength="120"
          placeholder="例如：朝南的客厅，原木家具，米白墙面，午后的光落在地板上"
        />
        <span class="count">{{ count }}/120</span>
      </div>

      <div class="chips">
        <button
          v-for="chip in promptChips"
          :key="chip.label"

          class="chip"
          @click="applyChip(chip.prompt)"
        >
          {{ chip.label }}
        </button>
      </div>

      <div class="upload">
        <button class="upload-button" @click="addReference">
          ＋ 添加参考图
        </button>
        <span v-if="hasReference" class="reference">
          <img :src="referenceData" alt="已选择的参考图">
          <button

            class="reference-remove"
            aria-label="移除参考图"
            @click="removeReference"
          >
            ×
          </button>
        </span>
      </div>

      <button

        class="submit"
        :class="{ 'is-loading': loading }"
        :disabled="!canSubmit || loading"
        @click="submit"
      >
        {{ loading ? '正在构思空间…' : '生成设计图' }}
      </button>
      <p class="hint" aria-live="polite">
        {{ hint }}
      </p>
    </section>

    <section v-if="resultVisible" class="result" aria-live="polite">
      <div v-if="loadingVisible" class="loading">
        <div class="loading-bars" aria-hidden="true">
          <i v-for="bar in 3" :key="bar" />
        </div>
        <p>正在把描述变成空间…</p>
      </div>

      <figure v-if="proofVisible" class="proof">
        <img
          class="scene scene-previewable"
          :src="sceneImage"
          alt="生成的效果图，点击可放大预览"
          title="点击预览"
          @click="openPreview"
        >
        <figcaption>
          <span class="tag">示例效果图</span>
          <span class="caption-body">
            <p class="echo">{{ echoText }}</p>
            <p class="result-meta">{{ resultMeta }}</p>
          </span>
          <img
            v-if="resultReference"
            class="result-ref"
            :src="resultReference"
            alt="本次使用的参考图"
          >
        </figcaption>
      </figure>

      <button v-if="editVisible" class="text-button" @click="editPrompt">
        {{ editLabel }}
      </button>
    </section>

    <section v-if="records.length" class="history">
      <div class="history-head">
        <h2>历史生成</h2>
        <button class="clear" @click="clearAllHistory">
          清空
        </button>
      </div>
      <div class="history-list">
        <button
          v-for="record in records"
          :key="record.id"

          class="history-item"
          @click="showProof(record, true)"
        >
          <img class="history-thumb" :src="record.image" alt="">
          <span class="history-body">
            <span class="history-prompt">{{ record.prompt }}</span>
            <span class="history-meta">
              {{ (record.reference ? '含参考图 · ' : '') + formatTime(record.createdAt) }}
            </span>
          </span>
        </button>
      </div>
    </section>
  </main>

  <div v-if="previewVisible" class="preview-overlay" @click.self="closePreview">
    <div class="preview-stage">
      <img
        class="preview-image"
        :src="sceneImage"
        alt="生成结果放大预览"
        :style="{ transform: `scale(${zoom})` }"
      >
    </div>
    <div class="preview-controls" @click.stop>
      <button class="preview-button" aria-label="缩小" @click="changeZoom(-0.25)">
        −
      </button>
      <span class="preview-zoom">{{ Math.round(zoom * 100) }}%</span>
      <button class="preview-button" aria-label="放大" @click="changeZoom(0.25)">
        ＋
      </button>
      <button class="preview-close" @click="closePreview">
        关闭
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.composer label {
  display: block;
  margin-bottom: 10px;
  font-size: 13px;
  letter-spacing: 0.06em;
}

.field {
  position: relative;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgb(255 253 249 / 62%);
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
}

.field:focus-within {
  border-color: var(--clay);
  background: var(--plaster-light);
  box-shadow: 0 0 0 4px rgb(140 90 60 / 10%);
}

.field textarea {
  display: block;
  width: 100%;
  min-height: 108px;
  padding: 18px 18px 34px;
  border: 0;
  border-radius: inherit;
  outline: 0;
  resize: vertical;
  background: transparent;
  color: var(--ink);
  font-family: inherit;
  font-size: inherit;
  line-height: 1.7;
}

.field textarea::placeholder {
  color: #a79a8c;
}

.count {
  position: absolute;
  right: 16px;
  bottom: 11px;
  color: var(--muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.upload-button {
  padding: 7px 0;
  border: 0;
  border-bottom: 1px dashed var(--clay);
  background: transparent;
  color: var(--clay-deep);
  cursor: pointer;
  font-size: 13px;
  text-align: left;
}

.reference {
  position: relative;
  display: inline-flex;
  margin-top: 10px;
}

.reference img {
  display: block;
  width: 76px;
  height: 76px;
  object-fit: cover;
  border: 1px solid var(--line);
  border-radius: 12px;
}

.reference-remove {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--plaster-light);
  color: var(--ink);
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 14px 0 16px;
}

.chip {
  padding: 7px 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-size: 12px;
  transition:
    border-color 0.2s,
    color 0.2s,
    background 0.2s;
}

.chip:hover {
  border-color: var(--clay);
  color: var(--clay-deep);
}

.chip:active {
  background: rgb(140 90 60 / 8%);
}

.submit {
  width: 100%;
  min-height: 56px;
  margin-top: 14px;
  border: 0;
  border-radius: 16px;
  background: var(--clay);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 16%),
    0 8px 22px -14px rgb(99 61 38 / 70%);
  color: #fff9f1;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-align: center;
  transition:
    background 0.2s,
    transform 0.12s,
    box-shadow 0.2s;
}

.submit:hover:not(:disabled) {
  background: var(--clay-deep);
}

.submit:active:not(:disabled) {
  transform: translateY(1px);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 10%);
}

.submit:disabled {
  background: var(--clay-soft);
  box-shadow: none;
  color: #fbf6ef;
  cursor: not-allowed;
}

.submit.is-loading {
  background: var(--clay-deep);
  cursor: progress;
}

.hint {
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 12px;
  text-align: center;
}

.loading {
  display: grid;
  place-content: center;
  gap: 18px;
  aspect-ratio: 4 / 5;
  padding: 30px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: linear-gradient(135deg, rgb(255 253 249 / 70%), rgb(231 217 196 / 55%));
  color: var(--muted);
  font-size: 13px;
  text-align: center;
}

.loading-bars {
  display: grid;
  gap: 10px;
  width: 150px;
  margin: 0 auto;
}

.loading-bars i {
  height: 8px;
  border-radius: 99px;
  background: linear-gradient(90deg, rgb(140 90 60 / 6%), rgb(140 90 60 / 22%), rgb(140 90 60 / 6%));
  background-size: 200% 100%;
  animation: sweep 1.4s linear infinite;
}

.loading-bars i:nth-child(2) {
  width: 78%;
  animation-delay: 0.15s;
}

.loading-bars i:nth-child(3) {
  width: 55%;
  animation-delay: 0.3s;
}

@keyframes sweep {
  to {
    background-position: -200% 0;
  }
}

.proof {
  margin: 0;
}

.scene {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: #efe4d3;
}

figcaption {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 16px 2px 0;
}

figcaption .tag {
  flex: none;
  margin-top: 2px;
}

.caption-body {
  flex: 1;
  min-width: 0;
}

.echo {
  display: -webkit-box;
  overflow: hidden;
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.result-meta {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 11px;
}

.result-ref {
  width: 46px;
  height: 46px;
  margin-left: auto;
  object-fit: cover;
  border: 1px solid var(--line);
  border-radius: 10px;
}

.history {
  margin-top: 44px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}

.history-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.history-head h2 {
  margin: 0;
  font-family: var(--serif);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.clear {
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-size: 12px;
}

.history-list {
  display: grid;
  gap: 10px;
}

.history-item {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgb(255 253 249 / 45%);
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s;
}

.history-item:hover {
  border-color: var(--clay);
}

.history-thumb {
  width: 64px;
  height: 80px;
  object-fit: cover;
  border-radius: 9px;
  background: #efe4d3;
}

.history-body {
  min-width: 0;
}

.history-prompt {
  display: -webkit-box;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.5;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.history-meta {
  display: block;
  margin-top: 6px;
  color: var(--muted);
  font-size: 11px;
}

.text-button {
  display: block;
  margin: 24px auto 0;
  padding: 8px 4px;
  border: 0;
  border-bottom: 1px solid var(--clay);
  background: transparent;
  color: var(--clay-deep);
  cursor: pointer;
  font-size: 14px;
}

.scene-previewable {
  cursor: zoom-in;
}

.preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgb(24 19 15 / 90%);
}

.preview-stage {
  display: grid;
  flex: 1;
  place-items: center;
  width: 100%;
  overflow: auto;
}

.preview-image {
  max-width: 100%;
  max-height: 78vh;
  object-fit: contain;
  transform-origin: center;
  transition: transform 0.15s;
}

.preview-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.preview-button,
.preview-close {
  min-width: 44px;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid rgb(255 249 241 / 35%);
  border-radius: 12px;
  background: rgb(255 249 241 / 10%);
  color: #fff9f1;
  cursor: pointer;
  font-size: 18px;
}

.preview-close {
  font-size: 14px;
}

.preview-zoom {
  min-width: 52px;
  color: #fff9f1;
  font-size: 13px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
</style>
