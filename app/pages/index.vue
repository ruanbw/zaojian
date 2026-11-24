<script setup lang="ts">
import { cases, SCENE_IMAGE } from '@/constants/content'

defineOptions({ name: 'HomePage' })

useHead({ title: '造间 · 案例灵感' })

function goGenerate() {
  navigateTo('/generate')
}
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
      <article v-for="(item, index) in cases" :key="item.title">
        <img
          class="block aspect-[4/3] w-full rounded-[18px] border border-line bg-[#efe4d3] object-cover"
          :class="{
            'object-[65%_50%]': index === 1,
            'sepia-[0.14] saturate-[0.92] brightness-[1.02]': index === 1,
            'object-[35%_50%]': index === 2,
            'hue-rotate-[-12deg] saturate-[0.88] brightness-[0.98]': index === 2,
          }"
          :src="SCENE_IMAGE"
          :alt="`示例效果图：${item.title}`"
        >
        <div class="pt-3">
          <span class="inline-block rounded-full border border-sage/45 px-2 py-px text-[11px] leading-[1.6] text-sage">示例灵感</span>
          <h2 class="mt-2 mb-1 font-serif text-[19px] font-semibold">
            {{ item.title }}
          </h2>
          <p class="m-0 text-[13px] leading-[1.6] text-muted">
            {{ item.description }}
          </p>
        </div>
      </article>
    </section>
  </main>

  <div class="pointer-events-none fixed inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-plaster from-[42%] to-transparent px-6 pt-7 pb-[calc(18px+env(safe-area-inset-bottom))]">
    <button
      class="pointer-events-auto grid min-h-14 w-full max-w-[392px] place-items-center rounded-2xl bg-clay text-base font-semibold tracking-[0.08em] text-[#fff9f1] shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_8px_22px_-14px_rgb(99_61_38/0.7)] transition-[background,transform] duration-200 hover:bg-clay-deep active:translate-y-px"
      @click="goGenerate"
    >
      生成我的家
    </button>
  </div>
</template>
