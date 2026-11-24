<script setup lang="ts">
import { cases, SCENE_IMAGE } from '@/constants/content'

defineOptions({ name: 'HomePage' })

useHead({ title: '造间 · 案例灵感' })

// 案例卡点进生成页时，把描述作为提示词预填（去掉末尾中文句号）
const caseLinks = cases.map((item) => ({
  title: item.title,
  description: item.description,
  to: { path: '/generate', query: { p: item.description.replace(/。$/, '') } },
}))
</script>

<template>
  <div class="plaster" aria-hidden="true" />

  <main class="mx-auto w-full max-w-[440px] px-6 pt-[calc(28px+env(safe-area-inset-top))] pb-[calc(150px+env(safe-area-inset-bottom))]">
    <header class="flex items-baseline justify-between gap-4 border-b border-line pb-3.5">
      <span class="font-serif text-[22px] font-semibold tracking-[0.14em]">造间</span>
      <span class="text-xs tracking-[0.08em] text-muted">空间灵感生成</span>
    </header>

    <section class="relative pt-12 pb-[38px]">
      <span class="pointer-events-none absolute top-0.5 -right-1.5 select-none font-serif text-[188px] leading-none text-clay/[0.075]" aria-hidden="true">间</span>
      <h1 class="relative m-0 font-serif text-[clamp(30px,9vw,38px)] font-semibold leading-[1.42] tracking-[0.02em]">
        从喜欢的家<br>开始想象
      </h1>
      <p class="relative mt-[18px] max-w-[19em] text-sm text-muted">
        先看看这些空间的样子，再写下属于你的那一间。
      </p>
    </section>

    <section class="grid gap-7" aria-label="案例展示">
      <div>
        <img
          class="block aspect-[4/5] w-full rounded-[18px] border border-line bg-sand object-cover"
          :src="SCENE_IMAGE"
          alt="示例：造间风格的客厅示意图"
          loading="eager"
          decoding="async"
        >
        <div class="pt-3">
          <span class="inline-block rounded-full border border-sage/45 px-2 py-px text-[11px] leading-[1.6] text-sage">示例灵感</span>
        </div>
      </div>

      <div class="grid gap-3">
        <NuxtLink
          v-for="item in caseLinks"
          :key="item.title"
          :to="item.to"
          class="block rounded-[14px] border border-line bg-paper/45 p-4 transition-colors duration-200 hover:border-clay active:bg-clay-wash"
        >
          <h2 class="m-0 font-serif text-[19px] font-semibold">
            {{ item.title }}
          </h2>
          <p class="m-0 mt-1 text-[13px] leading-[1.6] text-muted">
            {{ item.description }}
          </p>
        </NuxtLink>
      </div>
    </section>
  </main>

  <div class="pointer-events-none fixed inset-x-0 bottom-0 flex justify-center">
    <div class="mx-auto w-full max-w-[440px] bg-gradient-to-t from-plaster from-[42%] to-transparent px-6 pt-7 pb-[calc(18px+env(safe-area-inset-bottom))]">
      <NuxtLink
        to="/generate"
        class="pointer-events-auto grid min-h-14 w-full max-w-[392px] place-items-center rounded-2xl bg-clay text-base font-semibold tracking-[0.08em] text-cream shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_8px_22px_-14px_rgb(99_61_38/0.7)] transition-[background,transform] duration-200 hover:bg-clay-deep active:translate-y-px"
      >
        生成我的家
      </NuxtLink>
    </div>
  </div>
</template>
