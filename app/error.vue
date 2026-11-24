<script setup lang="ts">
defineOptions({ name: 'ErrorPage' })

const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}>()

useHead({ title: '造间 · 页面走丢了' })

// 按状态码给出克制的文案，404 / 5xx / 其他各走一套
const copy = computed(() => {
  const statusCode = props.error?.statusCode
  if (statusCode === 404) {
    return {
      title: '这一页还没有造出来',
      hint: '也许它正等着一句描述，把它变成一间房。',
    }
  }
  if (typeof statusCode === 'number' && statusCode >= 500) {
    return {
      title: '出了点问题',
      hint: '房子造到一半塌了，稍后再试一次。',
    }
  }
  return {
    title: '页面走丢了',
    hint: '这间房的门牌不见了，回首页重新找找。',
  }
})

const statusLabel = computed(() => (props.error?.statusCode ? `错误 ${props.error.statusCode}` : '出错了'))

// 报错原文不进主视觉，只在折叠区里给排查用
const detail = computed(() => props.error?.message || props.error?.statusMessage || '无更多信息')
const showDetail = computed(() => import.meta.dev || Boolean(props.error?.message || props.error?.statusMessage))

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="plaster" aria-hidden="true" />

  <main class="mx-auto flex min-h-[100dvh] w-full max-w-[440px] flex-col px-6 pt-[calc(28px+env(safe-area-inset-top))] pb-[calc(28px+env(safe-area-inset-bottom))]">
    <header class="flex items-baseline justify-between gap-4 border-b border-line pb-3.5">
      <span class="font-serif text-[22px] font-semibold tracking-[0.14em]">造间</span>
      <span class="text-xs tracking-[0.08em] text-muted">空间灵感生成</span>
    </header>

    <section class="flex flex-1 flex-col justify-center py-14">
      <span class="pointer-events-none select-none font-serif text-[150px] leading-none text-clay/[0.075]" aria-hidden="true">间</span>
      <p class="m-0 text-xs tracking-[0.08em] text-muted">
        {{ statusLabel }}
      </p>
      <h1 class="mt-3 mb-0 font-serif text-[clamp(28px,8.5vw,36px)] font-semibold leading-[1.42] tracking-[0.02em]">
        {{ copy.title }}
      </h1>
      <p class="mt-[18px] max-w-[19em] text-sm text-muted">
        {{ copy.hint }}
      </p>

      <button
        class="mt-9 grid min-h-14 w-full max-w-[392px] place-items-center rounded-2xl bg-clay text-base font-semibold tracking-[0.08em] text-cream shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_8px_22px_-14px_rgb(99_61_38/0.7)] transition-[background,transform] duration-200 hover:bg-clay-deep active:translate-y-px"
        type="button"
        @click="goHome"
      >
        返回首页
      </button>

      <details v-if="showDetail" class="mt-8 text-xs text-muted">
        <summary class="cursor-pointer select-none">错误详情</summary>
        <pre class="mt-2 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-line bg-paper/62 px-4 py-3 font-sans text-[12px] leading-[1.6] text-ink">{{ detail }}</pre>
      </details>
    </section>
  </main>
</template>
