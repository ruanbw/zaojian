<script setup lang="ts">
import { prototypeThemes } from '@/constants/prototypes'

defineOptions({ name: 'PrototypeGalleryPage' })
useHead({ title: '造间 · 首页与生成页设计原型' })
</script>

<template>
  <main class="prototype-index">
    <header class="index-nav">
      <NuxtLink to="/" class="index-brand">造间 <span>DESIGN LAB</span></NuxtLink>
      <NuxtLink to="/" class="index-back">返回现有首页 <span>↗</span></NuxtLink>
    </header>

    <section class="index-hero">
      <p>20 DESIGN DIRECTIONS / 40 PAGES</p>
      <h1>同一个造间，<br><span>二十种气质。</span></h1>
      <div class="index-hero-note"><span>01—20</span><p>每套方案都包含完整的首页与生成页。<br>进入原型，体验布局、风格与交互。</p></div>
    </section>

    <section class="index-grid" aria-label="可选设计方案">
      <article v-for="theme in prototypeThemes" :id="`theme-${theme.id}`" :key="theme.id" class="index-card" :style="{ '--card-accent': theme.accent, '--card-surface': theme.surface }">
        <div class="index-card-visual">
          <img :src="theme.image" :alt="`${theme.name}设计方向的空间氛围`" loading="lazy">
          <span>{{ theme.order }}</span>
          <div><i v-for="n in 3" :key="n" /></div>
        </div>
        <div class="index-card-body">
          <p>{{ theme.english }}</p>
          <h2><span>方案 {{ theme.order }}</span>{{ theme.name }}</h2>
          <p class="index-summary">{{ theme.summary }}</p>
          <ul><li v-for="tag in theme.tags" :key="tag">{{ tag }}</li></ul>
          <div class="index-card-actions">
            <NuxtLink :to="`/prototypes/${theme.id}`">查看首页 <span>→</span></NuxtLink>
            <NuxtLink :to="`/prototypes/${theme.id}/generate`">生成页 <span>↗</span></NuxtLink>
          </div>
        </div>
      </article>
    </section>

    <footer class="index-footer"><span>所有生成操作均为交互演示，不消耗生成额度。</span><span>选择时重点看：品牌气质 / 信息层级 / 创作效率</span></footer>
  </main>
</template>

<style scoped>
.prototype-index { min-height: 100vh; padding: 0 4vw 48px; color: #242521; background: #ecece7; font-family: Arial, "PingFang SC", sans-serif; }
.prototype-index :global(a) { color: inherit; text-decoration: none; }
.index-nav { display: flex; max-width: 1440px; height: 84px; margin: auto; align-items: center; justify-content: space-between; border-bottom: 1px solid #b9bab3; }
.index-brand { font-size: 22px; font-weight: 800; letter-spacing: -.06em; }
.index-brand span { margin-left: 10px; color: #777970; font-size: 8px; font-weight: 400; letter-spacing: .16em; }
.index-back { display: flex; align-items: center; gap: 14px; color: #66685f; font-size: 11px; }
.index-back span { color: #242521; font-size: 16px; }
.index-hero { display: grid; max-width: 1440px; margin: auto; grid-template-columns: 1fr auto; padding: 68px 0 56px; }
.index-hero > p { grid-column: 1 / -1; margin: 0 0 18px; color: #6f7168; font-size: 9px; letter-spacing: .2em; }
.index-hero h1 { margin: 0; font-size: clamp(52px, 7.5vw, 106px); font-weight: 600; line-height: 1.04; letter-spacing: -.09em; }
.index-hero h1 span { color: transparent; -webkit-text-stroke: 1px #242521; }
.index-hero-note { display: flex; align-items: flex-start; gap: 18px; align-self: end; padding-bottom: 8px; }
.index-hero-note > span { color: #777970; font-size: 9px; }
.index-hero-note p { margin: 0; color: #64665e; font-size: 11px; line-height: 1.9; }
.index-grid { display: grid; max-width: 1440px; margin: auto; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.index-card { min-width: 0; border: 1px solid #c7c8c0; background: #f5f5f0; }
.index-card-visual { position: relative; height: 230px; overflow: hidden; background: var(--card-surface); }
.index-card-visual::after { position: absolute; inset: 0; background: linear-gradient(transparent 55%, rgb(0 0 0 / .35)); content: ""; }
.index-card-visual img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.index-card:hover .index-card-visual img { transform: scale(1.035); }
.index-card-visual > span { position: absolute; z-index: 1; top: 18px; left: 18px; display: grid; width: 40px; height: 40px; place-items: center; color: #fff; background: #242521; border: 2px solid var(--card-accent); border-radius: 50%; font-size: 13px; font-weight: 700; }
.index-card-visual > div { position: absolute; z-index: 1; right: 18px; bottom: 18px; display: flex; gap: 5px; }
.index-card-visual i { width: 20px; height: 4px; background: rgb(255 255 255 / .45); }
.index-card-visual i:first-child { background: #fff; }
.index-card-body { padding: 24px; }
.index-card-body > p:first-child { margin: 0 0 8px; color: #777970; font-size: 8px; letter-spacing: .17em; }
.index-card h2 { margin: 0; font-size: 27px; font-weight: 600; letter-spacing: -.05em; }
.index-card h2 > span { display: block; margin-bottom: 4px; color: #777970; font-size: 9px; font-weight: 400; letter-spacing: .06em; }
.index-card .index-summary { min-height: 48px; margin: 18px 0; color: #66685f; font-size: 11px; line-height: 1.8; }
.index-card ul { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 24px; padding: 0; list-style: none; }
.index-card li { padding: 4px 8px; color: #64665e; border: 1px solid #d0d1ca; border-radius: 99px; font-size: 9px; }
.index-card-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.index-card-actions a { display: flex; align-items: center; justify-content: space-between; padding: 11px 12px; border: 1px solid #c7c8c0; font-size: 11px; }
.index-card-actions a:first-child { color: #fff; background: #242521; border-color: #242521; }
.index-card-actions a:hover { border-color: #777970; }
.index-footer { display: flex; max-width: 1440px; margin: auto; justify-content: space-between; padding-top: 24px; color: #777970; font-size: 9px; }
@media (max-width: 1200px) {
  .index-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 1000px) {
  .index-grid { grid-template-columns: repeat(2, 1fr); }
  .index-card-visual { height: 240px; }
  .index-card-body { padding: 18px; }
}
@media (max-width: 700px) {
  .prototype-index { padding: 0 18px 36px; }
  .index-nav { height: 72px; }
  .index-hero { display: block; padding: 48px 0 38px; }
  .index-hero h1 { font-size: clamp(46px, 14vw, 64px); }
  .index-hero-note { margin-top: 28px; }
  .index-grid { grid-template-columns: 1fr; gap: 22px; }
  .index-card-visual { height: 64vw; max-height: 330px; }
  .index-card-body { padding: 22px; }
  .index-card .index-summary { min-height: 0; }
  .index-card-actions { grid-template-columns: 1fr 1fr; }
  .index-footer { flex-direction: column; gap: 8px; line-height: 1.7; }
}
</style>
