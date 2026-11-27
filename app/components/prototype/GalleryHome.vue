<script setup lang="ts">
defineOptions({ name: 'PrototypeGalleryHome' })

const projects = [
  {
    number: '001',
    title: '柔光会客厅',
    type: 'LIVING / SOFT MINIMAL',
    prompt: '奶油白客厅，低矮模块沙发，自然侧光，极简而温暖',
    image: '/prototypes/gallery-living.jpg',
  },
  {
    number: '002',
    title: '黑白餐厨',
    type: 'DINING / MONOCHROME',
    prompt: '黑白开放餐厨，深灰石材，线性楼梯，现代极简',
    image: '/prototypes/gallery-detail.jpg',
  },
  {
    number: '003',
    title: '通透起居室',
    type: 'LIVING / OPEN PLAN',
    prompt: '通透现代起居室，浅灰沙发，落地窗，木质地板',
    image: '/prototypes/noir-detail.jpg',
  },
]
</script>

<template>
  <main class="gallery-home">
    <header class="gallery-nav">
      <NuxtLink to="/prototypes/gallery" class="gallery-brand">造间<span>®</span></NuxtLink>
      <p>AN AI INTERIOR GALLERY<br>SHANGHAI · 2026</p>
      <NuxtLink to="/prototypes/gallery/generate" class="gallery-nav-cta">创建空间 <span>↗</span></NuxtLink>
    </header>

    <section class="gallery-hero" aria-labelledby="gallery-title">
      <div class="gallery-heading-row">
        <div>
          <p class="gallery-kicker">YOUR WORDS. YOUR SPACE.</p>
          <h1 id="gallery-title">空间，<br>由<span>你</span>定义。</h1>
        </div>
        <div class="gallery-intro">
          <span>( 关于造间 )</span>
          <p>不需要专业术语。描述你想生活的样子，<br>剩下的交给想象与技术。</p>
          <NuxtLink to="/prototypes/gallery/generate">开始一次空间实验 <b>→</b></NuxtLink>
        </div>
      </div>

      <NuxtLink to="/prototypes/gallery/generate" class="gallery-hero-image">
        <img src="/prototypes/gallery-living.jpg" alt="奶油白色调与简洁线条构成的明亮客厅" fetchpriority="high">
        <span class="gallery-image-index">FEATURED SPACE — 001</span>
        <span class="gallery-image-action" aria-hidden="true">↗</span>
        <div class="gallery-image-caption"><strong>柔光会客厅</strong><span>35° 12′ N / A PLACE TO SLOW DOWN</span></div>
      </NuxtLink>
      <div class="gallery-ticker" aria-hidden="true">
        <span>LESS NOISE</span><i>*</i><span>MORE SPACE</span><i>*</i><span>YOUR WORDS</span><i>*</i><span>NEW POSSIBILITIES</span>
      </div>
    </section>

    <section class="gallery-projects" aria-labelledby="gallery-projects-title">
      <div class="gallery-section-head">
        <h2 id="gallery-projects-title">精选空间 <sup>(03)</sup></h2>
        <p>点击任一空间，以此作为创作起点。</p>
      </div>
      <div class="gallery-project-list">
        <NuxtLink
          v-for="project in projects"
          :key="project.number"
          :to="{ path: '/prototypes/gallery/generate', query: { p: project.prompt } }"
          class="gallery-project"
        >
          <span class="gallery-project-number">{{ project.number }}</span>
          <div class="gallery-project-thumb"><img :src="project.image" :alt="project.title" loading="lazy"></div>
          <div class="gallery-project-name"><h3>{{ project.title }}</h3><p>{{ project.type }}</p></div>
          <span class="gallery-project-arrow" aria-hidden="true">↗</span>
        </NuxtLink>
      </div>
    </section>

    <section class="gallery-manifesto">
      <p>不是更多风格，<br>而是更接近<span>你。</span></p>
      <NuxtLink to="/prototypes/gallery/generate">生成我的空间 <span>→</span></NuxtLink>
    </section>

    <footer class="gallery-footer"><span>造间 / ZAOJIAN</span><span>DESIGN PROTOTYPE B</span><span>SPACE IS PERSONAL.</span></footer>
  </main>
</template>

<style scoped>
.gallery-home { --gallery-ink: #1d1d1b; --gallery-muted: #777772; --gallery-line: #cececa; min-height: 100vh; padding: 0 4vw 108px; color: var(--gallery-ink); background: #f4f4f1; font-family: Arial, "PingFang SC", sans-serif; }
.gallery-home :global(a) { color: inherit; text-decoration: none; }
.gallery-nav { display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; max-width: 1440px; height: 92px; margin: auto; border-bottom: 1px solid var(--gallery-ink); }
.gallery-brand { width: fit-content; font-size: 25px; font-weight: 800; letter-spacing: -.08em; }
.gallery-brand span { margin-left: 5px; vertical-align: top; font-size: 10px; letter-spacing: 0; }
.gallery-nav > p { margin: 0; color: var(--gallery-muted); font-size: 9px; line-height: 1.6; letter-spacing: .13em; }
.gallery-nav-cta { justify-self: end; font-size: 12px; font-weight: 600; }
.gallery-nav-cta span { display: inline-grid; width: 31px; height: 31px; margin-left: 12px; place-items: center; color: #fff; background: var(--gallery-ink); border-radius: 50%; }
.gallery-hero { max-width: 1440px; margin: auto; padding-top: 64px; }
.gallery-heading-row { display: grid; grid-template-columns: 1.45fr .55fr; gap: 40px; align-items: end; padding-bottom: 48px; }
.gallery-kicker { margin: 0 0 20px; font-size: 10px; font-weight: 600; letter-spacing: .22em; }
.gallery-hero h1 { margin: 0; font-size: clamp(64px, 9vw, 134px); font-weight: 700; line-height: .95; letter-spacing: -.09em; }
.gallery-hero h1 span { color: transparent; -webkit-text-stroke: 1.5px var(--gallery-ink); }
.gallery-intro { max-width: 330px; padding-bottom: 4px; }
.gallery-intro > span { color: var(--gallery-muted); font-size: 10px; }
.gallery-intro p { margin: 18px 0 24px; font-size: 13px; line-height: 1.9; }
.gallery-intro a { display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px; border-bottom: 1px solid var(--gallery-ink); font-size: 12px; font-weight: 600; }
.gallery-intro b { font-size: 18px; font-weight: 400; }
.gallery-hero-image { position: relative; display: block; height: min(50vw, 650px); min-height: 440px; overflow: hidden; background: #ddd; }
.gallery-hero-image > img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s; }
.gallery-hero-image:hover > img { transform: scale(1.02); }
.gallery-image-index { position: absolute; top: 22px; left: 22px; padding: 7px 10px; color: #fff; background: rgb(0 0 0 / .55); font-size: 9px; letter-spacing: .14em; }
.gallery-image-action { position: absolute; top: 20px; right: 20px; display: grid; width: 48px; height: 48px; place-items: center; color: var(--gallery-ink); background: #f4f4f1; border-radius: 50%; font-size: 21px; }
.gallery-image-caption { position: absolute; right: 0; bottom: 0; left: 0; display: flex; align-items: end; justify-content: space-between; padding: 80px 26px 24px; color: #fff; background: linear-gradient(transparent, rgb(0 0 0 / .55)); }
.gallery-image-caption strong { font-size: 24px; font-weight: 500; letter-spacing: .05em; }
.gallery-image-caption span { font-size: 9px; letter-spacing: .12em; }
.gallery-ticker { display: flex; align-items: center; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid var(--gallery-line); font-size: 11px; font-weight: 600; letter-spacing: .13em; }
.gallery-ticker i { color: var(--gallery-muted); font-size: 15px; font-style: normal; font-weight: 400; }
.gallery-projects { max-width: 1440px; margin: auto; padding: 92px 0; }
.gallery-section-head { display: flex; align-items: end; justify-content: space-between; margin-bottom: 24px; }
.gallery-section-head h2 { margin: 0; font-size: 32px; letter-spacing: -.05em; }
.gallery-section-head sup { color: var(--gallery-muted); font-size: 11px; font-weight: 400; letter-spacing: 0; }
.gallery-section-head p { margin: 0; color: var(--gallery-muted); font-size: 11px; }
.gallery-project-list { border-top: 1px solid var(--gallery-ink); }
.gallery-project { display: grid; grid-template-columns: 70px 130px 1fr 48px; gap: 24px; align-items: center; padding: 18px 0; border-bottom: 1px solid var(--gallery-line); }
.gallery-project-number { align-self: start; padding-top: 4px; color: var(--gallery-muted); font-size: 10px; }
.gallery-project-thumb { height: 86px; overflow: hidden; background: #ddd; }
.gallery-project-thumb img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1); transition: filter .3s, transform .5s; }
.gallery-project:hover img { filter: grayscale(0); transform: scale(1.05); }
.gallery-project-name { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.gallery-project-name h3 { margin: 0; font-size: clamp(24px, 3vw, 42px); font-weight: 500; letter-spacing: -.05em; }
.gallery-project-name p { margin: 0; color: var(--gallery-muted); font-size: 9px; letter-spacing: .13em; }
.gallery-project-arrow { display: grid; width: 42px; height: 42px; place-items: center; border: 1px solid var(--gallery-line); border-radius: 50%; transition: color .2s, background .2s; }
.gallery-project:hover .gallery-project-arrow { color: #fff; background: var(--gallery-ink); }
.gallery-manifesto { max-width: 1440px; margin: auto; padding: 70px 6vw; color: #f4f4f1; background: var(--gallery-ink); }
.gallery-manifesto p { margin: 0 0 44px; font-size: clamp(38px, 6vw, 82px); font-weight: 500; line-height: 1.2; letter-spacing: -.07em; }
.gallery-manifesto p span { color: transparent; -webkit-text-stroke: 1px #f4f4f1; }
.gallery-manifesto a { display: flex; align-items: center; justify-content: space-between; padding-top: 20px; border-top: 1px solid #555552; font-size: 13px; }
.gallery-manifesto a span { font-size: 25px; }
.gallery-footer { display: flex; max-width: 1440px; margin: auto; justify-content: space-between; padding-top: 28px; color: var(--gallery-muted); font-size: 9px; letter-spacing: .13em; }
@media (max-width: 800px) {
  .gallery-heading-row { grid-template-columns: 1fr .7fr; }
  .gallery-project { grid-template-columns: 45px 100px 1fr 42px; gap: 15px; }
  .gallery-project-name { display: block; }
  .gallery-project-name p { margin-top: 8px; }
}
@media (max-width: 600px) {
  .gallery-home { padding: 0 18px 96px; }
  .gallery-nav { height: 76px; grid-template-columns: 1fr 1fr; }
  .gallery-nav > p { display: none; }
  .gallery-hero { padding-top: 42px; }
  .gallery-heading-row { display: block; padding-bottom: 34px; }
  .gallery-hero h1 { font-size: clamp(64px, 23vw, 94px); }
  .gallery-intro { margin: 36px 0 0 auto; }
  .gallery-hero-image { height: 115vw; min-height: 400px; }
  .gallery-hero-image > img { object-position: 60% center; }
  .gallery-image-caption { display: block; }
  .gallery-image-caption strong, .gallery-image-caption span { display: block; }
  .gallery-image-caption span { margin-top: 6px; }
  .gallery-ticker { gap: 22px; justify-content: flex-start; overflow: hidden; white-space: nowrap; }
  .gallery-ticker span:nth-of-type(n+3), .gallery-ticker i:nth-of-type(n+3) { display: none; }
  .gallery-projects { padding: 64px 0; }
  .gallery-section-head { display: block; }
  .gallery-section-head p { margin-top: 12px; }
  .gallery-project { grid-template-columns: 30px 72px 1fr 30px; gap: 10px; padding: 14px 0; }
  .gallery-project-thumb { height: 72px; }
  .gallery-project-name h3 { font-size: 20px; }
  .gallery-project-name p { font-size: 7px; line-height: 1.5; }
  .gallery-project-arrow { width: 30px; height: 30px; }
  .gallery-manifesto { padding: 48px 24px; }
  .gallery-footer { gap: 12px; flex-wrap: wrap; }
}
</style>
