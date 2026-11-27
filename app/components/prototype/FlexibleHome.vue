<script setup lang="ts">
import type { ExtendedPrototypeTheme } from '@/constants/prototypes'

defineOptions({ name: 'PrototypeFlexibleHome' })

const props = defineProps<{ theme: ExtendedPrototypeTheme }>()

const themeStyles = computed(() => ({
  '--x-accent': props.theme.accent,
  '--x-accent-ink': props.theme.accentInk,
  '--x-surface': props.theme.surface,
  '--x-ink': props.theme.ink,
  '--x-muted': props.theme.muted,
  '--x-radius': props.theme.radius,
  '--x-font': props.theme.font === 'serif'
    ? '"Songti SC", "STSong", serif'
    : props.theme.font === 'mono'
      ? '"SFMono-Regular", Consolas, "PingFang SC", monospace'
      : 'Arial, "PingFang SC", sans-serif',
}))

const cards = computed(() => props.theme.scenes.map((title, index) => ({
  title,
  image: [props.theme.image, props.theme.secondaryImage, props.theme.resultImage][index],
  prompt: `${props.theme.prompt}，重点呈现${title}`,
  number: String(index + 1).padStart(2, '0'),
})))
</script>

<template>
  <main
    class="x-home"
    :class="[`x-${theme.layout}`, { 'x-dark': theme.mode === 'dark' }]"
    :style="themeStyles"
  >
    <header class="x-nav">
      <NuxtLink :to="`/prototypes/${theme.id}`" class="x-brand" :aria-label="`${theme.name}首页`">
        <span>{{ theme.order }}</span>
        <div>造间<small>{{ theme.english }}</small></div>
      </NuxtLink>
      <p>{{ theme.name }} / SPACE COLLECTION</p>
      <NuxtLink :to="`/prototypes/${theme.id}/generate`" class="x-nav-action">开始创作 <b>↗</b></NuxtLink>
    </header>

    <section class="x-hero" :aria-labelledby="`x-title-${theme.id}`">
      <div class="x-copy">
        <p class="x-eyebrow"><span /> DIRECTION {{ theme.order }} / 20</p>
        <h1 :id="`x-title-${theme.id}`">{{ theme.headline }}<br><em>{{ theme.accentLine }}</em></h1>
        <p class="x-subline">{{ theme.subline }}</p>
        <div class="x-actions">
          <NuxtLink :to="`/prototypes/${theme.id}/generate`" class="x-primary">描述我的空间 <b>→</b></NuxtLink>
          <a :href="`#spaces-${theme.id}`" class="x-secondary">浏览灵感场景</a>
        </div>
      </div>
      <div class="x-visual">
        <img :src="theme.image" :alt="`${theme.name}主题空间示例`" fetchpriority="high">
        <div class="x-visual-meta"><span>SCENE / {{ theme.order }}01</span><strong>{{ theme.scenes[0] }}</strong></div>
        <span class="x-shape x-shape-one" aria-hidden="true" /><span class="x-shape x-shape-two" aria-hidden="true" />
      </div>
    </section>

    <div class="x-tags" aria-label="设计关键词"><span v-for="(tag, index) in theme.tags" :key="tag"><small>0{{ index + 1 }}</small>{{ tag }}</span><p>WORDS INTO WORLDS</p></div>

    <section :id="`spaces-${theme.id}`" class="x-spaces" :aria-labelledby="`x-spaces-title-${theme.id}`">
      <div class="x-section-head"><div><p>CURATED ATMOSPHERES</p><h2 :id="`x-spaces-title-${theme.id}`">从一种氛围开始</h2></div><span>选择一个场景，让灵感继续生长。</span></div>
      <div class="x-card-grid">
        <NuxtLink
          v-for="card in cards"
          :key="card.title"
          :to="{ path: `/prototypes/${theme.id}/generate`, query: { p: card.prompt } }"
          class="x-card"
        >
          <div class="x-card-image"><img :src="card.image" :alt="card.title" loading="lazy"><span>↗</span></div>
          <div class="x-card-meta"><small>{{ card.number }}</small><h3>{{ card.title }}</h3><p>以此灵感创作</p></div>
        </NuxtLink>
      </div>
    </section>

    <section class="x-process" aria-label="空间创作流程"><p>一个念头，三步成真。</p><div><span><b>01</b>描述空间</span><i>→</i><span><b>02</b>选择方向</span><i>→</i><span><b>03</b>生成提案</span></div></section>
    <footer class="x-footer"><span>造间 · {{ theme.name }}</span><span>DESIGN PROTOTYPE {{ theme.order }} / 20</span></footer>
  </main>
</template>

<style scoped>
.x-home { min-height: 100vh; padding: 0 4vw 112px; overflow: hidden; color: var(--x-ink); background: var(--x-surface); font-family: var(--x-font); transition: background .25s; }
.x-home :global(a) { color: inherit; text-decoration: none; }
.x-nav { display: flex; max-width: 1400px; height: 88px; margin: auto; align-items: center; justify-content: space-between; border-bottom: 1px solid color-mix(in srgb, var(--x-ink) 24%, transparent); }
.x-brand { display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 700; letter-spacing: .05em; }
.x-brand > span { display: grid; width: 38px; height: 38px; place-items: center; color: var(--x-accent-ink); background: var(--x-accent); border-radius: var(--x-radius); font-size: 12px; }
.x-brand small { display: block; margin-top: 2px; color: var(--x-muted); font-family: Arial, sans-serif; font-size: 7px; font-weight: 400; letter-spacing: .14em; }
.x-nav > p { color: var(--x-muted); font-size: 8px; letter-spacing: .16em; }
.x-nav-action { display: flex; align-items: center; gap: 18px; font-size: 11px; }
.x-nav-action b { display: grid; width: 32px; height: 32px; place-items: center; color: var(--x-accent-ink); background: var(--x-accent); border-radius: var(--x-radius); font-size: 15px; font-weight: 400; }
.x-hero { display: grid; max-width: 1400px; margin: auto; grid-template-columns: .9fr 1.1fr; gap: 5vw; align-items: center; padding: 64px 0 76px; }
.x-eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 22px; color: var(--x-accent); font-family: Arial, sans-serif; font-size: 8px; font-weight: 600; letter-spacing: .18em; }
.x-eyebrow span { width: 25px; height: 1px; background: currentColor; }
.x-copy h1 { margin: 0; font-family: var(--x-font); font-size: clamp(44px, 5.4vw, 78px); font-weight: 600; line-height: 1.18; letter-spacing: -.065em; }
.x-copy h1 em { color: var(--x-accent); font-style: normal; }
.x-subline { max-width: 440px; margin: 26px 0 0; color: var(--x-muted); font-size: 13px; line-height: 1.95; }
.x-actions { display: flex; align-items: center; gap: 24px; margin-top: 34px; }
.x-primary { display: flex; min-width: 180px; align-items: center; justify-content: space-between; padding: 14px 17px; color: var(--x-accent-ink) !important; background: var(--x-accent); border-radius: var(--x-radius); font-family: Arial, "PingFang SC", sans-serif; font-size: 12px; font-weight: 600; }
.x-primary b { font-size: 18px; font-weight: 400; }
.x-secondary { padding-bottom: 5px; border-bottom: 1px solid color-mix(in srgb, var(--x-ink) 30%, transparent); font-size: 11px; }
.x-visual { position: relative; height: min(58vw, 620px); min-height: 480px; overflow: hidden; background: color-mix(in srgb, var(--x-ink) 10%, var(--x-surface)); border-radius: var(--x-radius); }
.x-visual > img { width: 100%; height: 100%; object-fit: cover; }
.x-visual::after { position: absolute; inset: 0; background: linear-gradient(transparent 55%, rgb(0 0 0 / .62)); content: ""; }
.x-visual-meta { position: absolute; z-index: 2; right: 24px; bottom: 22px; left: 24px; display: flex; align-items: end; justify-content: space-between; color: #fff; }
.x-visual-meta span { font-family: Arial, sans-serif; font-size: 8px; letter-spacing: .15em; }
.x-visual-meta strong { font-size: 20px; font-weight: 500; }
.x-shape { display: none; }
.x-tags { display: flex; max-width: 1400px; margin: auto; align-items: center; gap: 34px; padding: 20px 0; border-top: 1px solid color-mix(in srgb, var(--x-ink) 20%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--x-ink) 20%, transparent); }
.x-tags > span { display: flex; align-items: center; gap: 8px; font-size: 11px; }
.x-tags small { color: var(--x-accent); font-family: Arial, sans-serif; font-size: 8px; }
.x-tags > p { margin: 0 0 0 auto; color: var(--x-muted); font-family: Arial, sans-serif; font-size: 8px; letter-spacing: .17em; }
.x-spaces { max-width: 1400px; margin: auto; padding: 84px 0 70px; }
.x-section-head { display: flex; align-items: end; justify-content: space-between; margin-bottom: 28px; }
.x-section-head p { margin: 0 0 9px; color: var(--x-accent); font-family: Arial, sans-serif; font-size: 8px; letter-spacing: .18em; }
.x-section-head h2 { margin: 0; font-size: 31px; font-weight: 500; letter-spacing: -.04em; }
.x-section-head > span { color: var(--x-muted); font-size: 10px; }
.x-card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.x-card-image { position: relative; height: 300px; overflow: hidden; background: color-mix(in srgb, var(--x-ink) 8%, var(--x-surface)); border-radius: var(--x-radius); }
.x-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
.x-card:hover img { transform: scale(1.04); }
.x-card-image > span { position: absolute; top: 12px; right: 12px; display: grid; width: 34px; height: 34px; place-items: center; color: var(--x-accent-ink); background: var(--x-accent); border-radius: var(--x-radius); }
.x-card-meta { display: grid; grid-template-columns: 34px 1fr auto; align-items: center; padding: 15px 2px; }
.x-card-meta small { color: var(--x-accent); font-family: Arial, sans-serif; font-size: 8px; }
.x-card-meta h3 { margin: 0; font-size: 17px; font-weight: 500; }
.x-card-meta p { margin: 0; color: var(--x-muted); font-size: 9px; }
.x-process { display: flex; max-width: 1400px; margin: auto; align-items: center; justify-content: space-between; padding: 34px 0; border-top: 1px solid color-mix(in srgb, var(--x-ink) 20%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--x-ink) 20%, transparent); }
.x-process > p { margin: 0; font-size: 14px; }
.x-process > div { display: flex; align-items: center; gap: 24px; color: var(--x-muted); font-size: 11px; }
.x-process b { margin-right: 8px; color: var(--x-accent); font-family: Arial, sans-serif; font-size: 9px; }
.x-process i { color: var(--x-accent); font-style: normal; }
.x-footer { display: flex; max-width: 1400px; margin: auto; justify-content: space-between; padding-top: 24px; color: var(--x-muted); font-family: Arial, "PingFang SC", sans-serif; font-size: 8px; letter-spacing: .12em; }
/* 几何蓝图：硬网格、坐标线与明确色块。 */
.x-grid { background-image: linear-gradient(color-mix(in srgb, var(--x-ink) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--x-ink) 6%, transparent) 1px, transparent 1px); background-size: 64px 64px; }
.x-grid .x-hero { position: relative; grid-template-columns: 1.15fr .85fr; }
.x-grid .x-copy { padding: 34px; background: var(--x-surface); border: 1px solid var(--x-ink); box-shadow: 10px 10px 0 var(--x-accent); }
.x-grid .x-copy h1 { text-transform: uppercase; }
.x-grid .x-visual { min-height: 560px; border: 1px solid var(--x-ink); }
.x-grid .x-shape { position: absolute; z-index: 2; display: block; }
.x-grid .x-shape-one { top: 18px; right: 18px; width: 52px; height: 52px; background: var(--x-accent); border-radius: 50%; }
.x-grid .x-shape-two { top: 18px; right: 82px; width: 52px; height: 52px; border: 1px solid #fff; transform: rotate(45deg); }
/* 柔软卡片：大面积圆角与浮动色块。 */
.x-cards .x-hero { margin-top: 28px; padding: 48px; background: color-mix(in srgb, var(--x-accent) 10%, var(--x-surface)); border-radius: calc(var(--x-radius) * 1.5); }
.x-cards .x-visual { border-radius: calc(var(--x-radius) * 1.3); }
.x-cards .x-card { padding: 10px; background: color-mix(in srgb, #ffffff 55%, transparent); border-radius: var(--x-radius); }
.x-cards .x-card-meta { padding: 16px 8px 8px; }
/* 极简留白：更平缓的比例与大量空白。 */
.x-minimal .x-hero { grid-template-columns: .78fr 1.22fr; gap: 8vw; padding-top: 88px; padding-bottom: 100px; }
.x-minimal .x-copy h1 { font-size: clamp(40px, 4.6vw, 66px); font-weight: 400; line-height: 1.45; }
.x-minimal .x-visual { height: min(48vw, 560px); }
.x-minimal .x-card-grid { gap: 32px; }
.x-minimal .x-card-image { height: 350px; }
/* 沉浸海报：图片即画布，文字直接叠在场景上。 */
.x-poster .x-hero { position: relative; display: block; height: min(76vh, 750px); min-height: 650px; padding: 0; }
.x-poster .x-visual { position: absolute; inset: 0; height: 100%; min-height: 0; }
.x-poster .x-visual::after { background: linear-gradient(90deg, rgb(5 12 7 / .86), rgb(5 12 7 / .12)), linear-gradient(0deg, rgb(5 12 7 / .65), transparent 60%); }
.x-poster .x-copy { position: absolute; z-index: 3; bottom: 70px; left: 6%; max-width: 850px; }
.x-poster .x-copy h1 { color: #f5f4ec; font-size: clamp(50px, 6vw, 88px); }
.x-poster .x-subline { color: #d2d8cd; }
.x-poster .x-secondary { color: #fff; border-color: #aaa; }
.x-poster .x-visual-meta { top: 24px; bottom: auto; }
/* 奢华对称：居中标题、双重边框与拱形影像。 */
.x-luxury .x-hero { display: block; max-width: 1160px; padding: 64px 0 80px; text-align: center; }
.x-luxury .x-copy .x-eyebrow, .x-luxury .x-actions { justify-content: center; }
.x-luxury .x-subline { margin-right: auto; margin-left: auto; }
.x-luxury .x-visual { height: 590px; margin-top: 54px; border: 1px solid var(--x-accent); border-radius: 260px 260px 0 0; outline: 1px solid color-mix(in srgb, var(--x-accent) 55%, transparent); outline-offset: 10px; }
.x-luxury .x-card-image { border-radius: 160px 160px 0 0; }
/* 编辑布局：图片拱顶与杂志式错位。 */
.x-editorial .x-hero { grid-template-columns: 1fr 1fr; }
.x-editorial .x-visual { border-radius: 260px 260px var(--x-radius) var(--x-radius); }
.x-editorial .x-card:nth-child(2) { margin-top: 42px; }
.x-editorial .x-card:nth-child(3) { margin-top: 84px; }
.x-dark .x-card { background: color-mix(in srgb, #ffffff 3%, transparent); }
@media (max-width: 900px) {
  .x-hero { gap: 32px; }
  .x-cards .x-hero { padding: 32px; }
  .x-card-image { height: 240px; }
  .x-card-meta { grid-template-columns: 28px 1fr; }
  .x-card-meta p { display: none; }
}
@media (max-width: 680px) {
  .x-home { padding: 0 18px 96px; }
  .x-nav { height: 74px; }
  .x-nav > p { display: none; }
  .x-brand small { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .x-nav-action { gap: 8px; }
  .x-hero, .x-grid .x-hero, .x-minimal .x-hero, .x-editorial .x-hero { display: flex; flex-direction: column; gap: 36px; padding: 44px 0 56px; }
  .x-copy h1, .x-minimal .x-copy h1 { font-size: clamp(37px, 11vw, 50px); line-height: 1.25; }
  .x-subline { font-size: 12px; }
  .x-actions { align-items: flex-start; flex-direction: column; gap: 18px; }
  .x-primary { width: 100%; box-sizing: border-box; }
  .x-visual, .x-minimal .x-visual { width: 100%; height: 112vw; min-height: 380px; max-height: 540px; }
  .x-grid .x-copy { padding: 22px; box-shadow: 6px 6px 0 var(--x-accent); }
  .x-grid .x-visual { min-height: 390px; }
  .x-cards .x-hero { margin-top: 20px; padding: 22px; }
  .x-poster .x-hero { display: block; height: 72vh; min-height: 630px; padding: 0; }
  .x-poster .x-visual { height: 100%; min-height: 0; }
  .x-poster .x-copy { right: 7%; bottom: 44px; left: 7%; }
  .x-poster .x-copy h1 { font-size: clamp(40px, 11.5vw, 52px); }
  .x-poster .x-actions { gap: 14px; margin-top: 24px; }
  .x-luxury .x-hero { padding: 44px 0 64px; }
  .x-luxury .x-visual { height: 112vw; min-height: 390px; margin-top: 44px; border-radius: 160px 160px 0 0; }
  .x-editorial .x-card:nth-child(2), .x-editorial .x-card:nth-child(3) { margin-top: 0; }
  .x-tags { gap: 12px; justify-content: space-between; }
  .x-tags > span { flex-direction: column; gap: 3px; font-size: 9px; }
  .x-tags > p { display: none; }
  .x-spaces { padding: 60px 0 46px; }
  .x-section-head > span { display: none; }
  .x-card-grid { grid-template-columns: 1fr; gap: 28px; }
  .x-card-image, .x-minimal .x-card-image { height: 76vw; max-height: 390px; }
  .x-process { align-items: flex-start; flex-direction: column; gap: 22px; }
  .x-process > div { width: 100%; justify-content: space-between; gap: 6px; }
  .x-process b { display: block; margin-bottom: 5px; }
  .x-footer { gap: 18px; line-height: 1.7; }
}
</style>
