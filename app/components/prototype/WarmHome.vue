<script setup lang="ts">
defineOptions({ name: 'PrototypeWarmHome' })

const cards = [
  {
    title: '午后客厅',
    subtitle: '原木 · 米白 · 柔光',
    prompt: '朝南的客厅，原木家具，米白墙面，午后的光落在地板上',
    image: '/prototypes/warm-living.jpg',
    number: '01',
  },
  {
    title: '木构住宅',
    subtitle: '木色 · 线条 · 天空',
    prompt: '现代木构住宅外观，大面积玻璃，温暖木色，简洁建筑线条',
    image: '/prototypes/warm-bedroom.jpg',
    number: '02',
  },
  {
    title: '开放餐厨',
    subtitle: '石材 · 秩序 · 通透',
    prompt: '现代开放式餐厨，深灰石材，木质细节，大面积自然采光',
    image: '/prototypes/gallery-detail.jpg',
    number: '03',
  },
]
</script>

<template>
  <main class="warm-home">
    <header class="warm-nav">
      <NuxtLink to="/prototypes/warm" class="warm-brand" aria-label="造间暖木杂志首页">
        <span class="warm-brand-mark" aria-hidden="true">间</span>
        <span>造间<small>ZAOJIAN ATELIER</small></span>
      </NuxtLink>
      <nav class="warm-links" aria-label="页面导航">
        <a href="#inspirations">灵感集</a>
        <a href="#process">创作方式</a>
      </nav>
      <NuxtLink to="/prototypes/warm/generate" class="warm-nav-cta">
        开始创作 <span aria-hidden="true">↗</span>
      </NuxtLink>
    </header>

    <section class="warm-hero" aria-labelledby="warm-title">
      <div class="warm-hero-copy">
        <p class="warm-eyebrow"><span /> YOUR SPACE, REIMAGINED</p>
        <h1 id="warm-title">把理想的生活，<br>安放在<span>空间里。</span></h1>
        <p class="warm-intro">
          从一束光、一种材质，或一个模糊的念头开始。<br>
          让想象慢慢长成可以被看见的家。
        </p>
        <div class="warm-actions">
          <NuxtLink to="/prototypes/warm/generate" class="warm-primary">
            描述我的家 <span aria-hidden="true">→</span>
          </NuxtLink>
          <a href="#inspirations" class="warm-text-link">先看看灵感</a>
        </div>
        <div class="warm-hero-note">
          <span>自然材质</span><i />
          <span>真实光影</span><i />
          <span>为你生成</span>
        </div>
      </div>

      <div class="warm-hero-visual">
        <span class="warm-vertical-copy" aria-hidden="true">A QUIET PLACE TO CALL HOME</span>
        <div class="warm-image-frame">
          <img src="/prototypes/warm-living.jpg" alt="自然光洒入原木与灰色家具围合的客厅" fetchpriority="high">
          <div class="warm-image-caption">
            <span>THE SLOW LIVING</span>
            <strong>午后，光有了形状</strong>
          </div>
        </div>
        <span class="warm-stamp" aria-hidden="true">空间<br>想象<br>计划</span>
      </div>
    </section>

    <section id="inspirations" class="warm-inspirations" aria-labelledby="warm-inspiration-title">
      <div class="warm-section-heading">
        <div>
          <p class="warm-eyebrow"><span /> CURATED SPACES</p>
          <h2 id="warm-inspiration-title">灵感，不必从零开始</h2>
        </div>
        <p>选一间靠近理想的空间，<br>再把它改成你的样子。</p>
      </div>
      <div class="warm-card-grid">
        <NuxtLink
          v-for="card in cards"
          :key="card.title"
          :to="{ path: '/prototypes/warm/generate', query: { p: card.prompt } }"
          class="warm-card"
        >
          <div class="warm-card-image">
            <img :src="card.image" :alt="card.title" loading="lazy">
            <span aria-hidden="true">↗</span>
          </div>
          <div class="warm-card-meta">
            <span>{{ card.number }}</span>
            <div><h3>{{ card.title }}</h3><p>{{ card.subtitle }}</p></div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section id="process" class="warm-process" aria-label="创作步骤">
      <p>从想象到空间，只需三步</p>
      <ol>
        <li><span>01</span><div><strong>写下想象</strong><small>空间、风格与光线</small></div></li>
        <li><span>02</span><div><strong>选择氛围</strong><small>让偏好成为细节</small></div></li>
        <li><span>03</span><div><strong>看见新家</strong><small>生成你的空间提案</small></div></li>
      </ol>
    </section>

    <footer class="warm-footer">
      <span>造间 · 让每一种生活，都有空间承载</span>
      <span>DESIGN PROTOTYPE A</span>
    </footer>
  </main>
</template>

<style scoped>
.warm-home {
  --warm-ink: #342d26;
  --warm-muted: #82766b;
  --warm-clay: #9a5f43;
  --warm-line: #d9cfc1;
  min-height: 100vh;
  padding: 0 5vw 110px;
  overflow: hidden;
  color: var(--warm-ink);
  background: #f4efe6;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
}
.warm-home :global(a) { color: inherit; text-decoration: none; }
.warm-nav { max-width: 1320px; height: 92px; margin: auto; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--warm-line); }
.warm-brand { display: flex; align-items: center; gap: 12px; font-family: "Songti SC", serif; font-size: 22px; font-weight: 700; letter-spacing: .12em; }
.warm-brand-mark { display: grid; width: 38px; height: 38px; place-items: center; color: #f8f3e9; background: var(--warm-clay); border-radius: 50% 50% 46% 54%; font-size: 18px; }
.warm-brand small { display: block; margin-top: -2px; font-family: Arial, sans-serif; font-size: 8px; font-weight: 500; letter-spacing: .17em; }
.warm-links { display: flex; gap: 36px; color: var(--warm-muted); font-size: 13px; }
.warm-links a:hover { color: var(--warm-clay); }
.warm-nav-cta { padding: 10px 0; border-bottom: 1px solid var(--warm-ink); font-size: 13px; }
.warm-nav-cta span { margin-left: 18px; }
.warm-hero { max-width: 1320px; margin: auto; display: grid; grid-template-columns: .92fr 1.08fr; gap: 7vw; align-items: center; padding: 62px 0 82px; }
.warm-eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 24px; color: var(--warm-clay); font-size: 10px; font-weight: 600; letter-spacing: .2em; }
.warm-eyebrow > span { width: 24px; height: 1px; background: currentColor; }
.warm-hero h1 { margin: 0; font-family: "Songti SC", "STSong", serif; font-size: clamp(42px, 4.5vw, 68px); font-weight: 500; line-height: 1.35; letter-spacing: -.04em; }
.warm-hero h1 span { color: var(--warm-clay); }
.warm-intro { margin: 28px 0 0; color: var(--warm-muted); font-size: 14px; line-height: 2; }
.warm-actions { display: flex; align-items: center; gap: 28px; margin-top: 36px; }
.warm-primary { display: flex; min-width: 176px; align-items: center; justify-content: space-between; padding: 15px 20px; color: #fffaf0 !important; background: var(--warm-clay); border-radius: 3px; font-size: 14px; transition: background .2s, transform .2s; }
.warm-primary:hover { background: #7d4932; transform: translateY(-2px); }
.warm-text-link { border-bottom: 1px solid var(--warm-line); font-size: 13px; }
.warm-hero-note { display: flex; align-items: center; gap: 12px; margin-top: 48px; color: var(--warm-muted); font-size: 11px; letter-spacing: .08em; }
.warm-hero-note i { width: 3px; height: 3px; background: var(--warm-clay); border-radius: 50%; }
.warm-hero-visual { position: relative; padding: 0 32px 0 0; }
.warm-image-frame { position: relative; height: min(62vw, 610px); max-height: 610px; min-height: 500px; overflow: hidden; border-radius: 240px 240px 6px 6px; background: #ddd1bf; }
.warm-image-frame > img { width: 100%; height: 100%; object-fit: cover; object-position: 54% center; }
.warm-image-caption { position: absolute; right: 0; bottom: 0; left: 0; padding: 70px 30px 26px; color: #fff; background: linear-gradient(transparent, rgb(31 24 18 / .68)); }
.warm-image-caption span { display: block; margin-bottom: 5px; font-size: 9px; letter-spacing: .22em; }
.warm-image-caption strong { font-family: "Songti SC", serif; font-size: 20px; font-weight: 500; letter-spacing: .08em; }
.warm-vertical-copy { position: absolute; top: 90px; right: 5px; color: var(--warm-muted); font-size: 8px; letter-spacing: .24em; writing-mode: vertical-rl; }
.warm-stamp { position: absolute; bottom: 52px; left: -34px; display: grid; width: 76px; height: 76px; place-items: center; color: #f8f0e2; background: var(--warm-clay); border: 5px solid #f4efe6; border-radius: 50%; font-family: "Songti SC", serif; font-size: 11px; line-height: 1.35; text-align: center; transform: rotate(-10deg); }
.warm-inspirations { max-width: 1320px; margin: auto; padding: 72px 0; border-top: 1px solid var(--warm-line); }
.warm-section-heading { display: flex; align-items: end; justify-content: space-between; margin-bottom: 34px; }
.warm-section-heading .warm-eyebrow { margin-bottom: 12px; }
.warm-section-heading h2 { margin: 0; font-family: "Songti SC", serif; font-size: 34px; font-weight: 500; }
.warm-section-heading > p { margin: 0; color: var(--warm-muted); font-size: 12px; line-height: 1.9; }
.warm-card-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 22px; }
.warm-card-image { position: relative; height: 320px; overflow: hidden; background: #e1d7c8; }
.warm-card:first-child .warm-card-image { border-radius: 120px 4px 4px 4px; }
.warm-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.warm-card:hover img { transform: scale(1.035); }
.warm-card-image > span { position: absolute; top: 14px; right: 14px; display: grid; width: 34px; height: 34px; place-items: center; color: var(--warm-ink); background: rgb(248 243 233 / .88); border-radius: 50%; }
.warm-card-meta { display: flex; gap: 16px; padding-top: 18px; }
.warm-card-meta > span { padding-top: 4px; color: var(--warm-clay); font-family: Georgia, serif; font-size: 12px; }
.warm-card-meta h3 { margin: 0; font-family: "Songti SC", serif; font-size: 20px; font-weight: 600; }
.warm-card-meta p { margin: 3px 0 0; color: var(--warm-muted); font-size: 11px; letter-spacing: .06em; }
.warm-process { max-width: 1320px; margin: auto; padding: 44px 0; border-top: 1px solid var(--warm-line); border-bottom: 1px solid var(--warm-line); }
.warm-process > p { margin: 0 0 28px; color: var(--warm-muted); font-size: 12px; }
.warm-process ol { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin: 0; padding: 0; list-style: none; }
.warm-process li { display: flex; gap: 16px; align-items: center; }
.warm-process li > span { color: var(--warm-clay); font-family: Georgia, serif; font-size: 32px; font-style: italic; }
.warm-process strong, .warm-process small { display: block; }
.warm-process strong { font-family: "Songti SC", serif; font-size: 17px; }
.warm-process small { margin-top: 4px; color: var(--warm-muted); font-size: 11px; }
.warm-footer { max-width: 1320px; margin: auto; display: flex; justify-content: space-between; padding-top: 26px; color: var(--warm-muted); font-size: 10px; letter-spacing: .08em; }
@media (max-width: 900px) {
  .warm-hero { gap: 38px; }
  .warm-image-frame { min-height: 450px; }
  .warm-card-image { height: 250px; }
}
@media (max-width: 680px) {
  .warm-home { padding: 0 20px 96px; }
  .warm-nav { height: 76px; }
  .warm-links { display: none; }
  .warm-nav-cta { font-size: 12px; }
  .warm-nav-cta span { margin-left: 8px; }
  .warm-hero { display: flex; flex-direction: column; gap: 42px; padding: 46px 0 56px; }
  .warm-hero-copy { width: 100%; }
  .warm-hero h1 { font-size: clamp(38px, 11vw, 50px); }
  .warm-intro br { display: none; }
  .warm-hero-note { margin-top: 32px; }
  .warm-hero-visual { width: calc(100% - 14px); padding-right: 14px; }
  .warm-image-frame { height: 124vw; min-height: 0; max-height: 570px; border-radius: 180px 180px 4px 4px; }
  .warm-stamp { left: -10px; }
  .warm-vertical-copy { right: -5px; }
  .warm-section-heading { display: block; }
  .warm-section-heading > p { margin-top: 16px; }
  .warm-section-heading > p br { display: none; }
  .warm-section-heading h2 { font-size: 28px; }
  .warm-inspirations { padding: 52px 0; }
  .warm-card-grid { grid-template-columns: 1fr; gap: 34px; }
  .warm-card-image { height: 100vw; max-height: 420px; }
  .warm-card:first-child .warm-card-image { border-radius: 100px 4px 4px 4px; }
  .warm-process ol { grid-template-columns: 1fr; gap: 24px; }
  .warm-footer { gap: 20px; line-height: 1.7; }
}
</style>
