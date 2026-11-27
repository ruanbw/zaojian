<script setup lang="ts">
defineOptions({ name: 'PrototypeNoirHome' })

const scenes = [
  { number: '01', title: '自然共生', tag: 'ORGANIC MODERN', image: '/prototypes/noir-living.jpg', prompt: '自然现代客厅，灰色布艺，皮革单椅，大面积落地窗与绿植' },
  { number: '02', title: '通透秩序', tag: 'OPEN LIVING', image: '/prototypes/noir-detail.jpg', prompt: '通透现代起居室，浅灰沙发，落地窗，木质地板' },
  { number: '03', title: '线性空间', tag: 'LINEAR MINIMAL', image: '/prototypes/gallery-detail.jpg', prompt: '现代开放餐厨，深灰石材，木质细节，大面积自然采光' },
]
</script>

<template>
  <main class="noir-home">
    <header class="noir-nav">
      <NuxtLink to="/prototypes/noir" class="noir-brand">
        <span class="noir-logo" aria-hidden="true"><i /><i /><i /><i /></span>
        造间 <small>ZAOJIAN®</small>
      </NuxtLink>
      <div class="noir-status"><i /> AI SPACE ENGINE <span>ONLINE</span></div>
      <NuxtLink to="/prototypes/noir/generate" class="noir-nav-cta">启动创作 <span>↗</span></NuxtLink>
    </header>

    <section class="noir-hero" aria-labelledby="noir-title">
      <img class="noir-hero-bg" src="/prototypes/noir-living.jpg" alt="落地窗外绿植与室内现代家具相映的客厅" fetchpriority="high">
      <div class="noir-hero-shade" />
      <div class="noir-grid" aria-hidden="true" />
      <div class="noir-hero-top"><span>GENERATIVE INTERIOR EXPERIENCE</span><span>EST. 2026 / V.01</span></div>
      <div class="noir-hero-copy">
        <p><span /> 从一句话，到一种生活</p>
        <h1 id="noir-title">不止想象。<br>看见你的<span>下一种生活。</span></h1>
        <div class="noir-hero-bottom">
          <p>把脑中的片段，转译成可感知的空间。<br>光线、材质、氛围，此刻重新组合。</p>
          <NuxtLink to="/prototypes/noir/generate" class="noir-primary">
            <span>开始生成</span><b aria-hidden="true">↗</b>
          </NuxtLink>
        </div>
      </div>
      <div class="noir-prompt-card">
        <span>PROMPT → SPACE</span>
        <p>“自然光、原木、<br>一个慢下来的下午。”</p>
        <div><i /><i /><i /><b>READY TO IMAGINE</b></div>
      </div>
      <span class="noir-scroll" aria-hidden="true">SCROLL TO EXPLORE ↓</span>
    </section>

    <section class="noir-scenes" aria-labelledby="noir-scenes-title">
      <div class="noir-section-head">
        <div><span>EXPLORE / 001—003</span><h2 id="noir-scenes-title">灵感场景库</h2></div>
        <p>不是风格的复制，<br>是可能性的起点。</p>
      </div>
      <div class="noir-scene-grid">
        <NuxtLink
          v-for="scene in scenes"
          :key="scene.number"
          :to="{ path: '/prototypes/noir/generate', query: { p: scene.prompt } }"
          class="noir-scene"
        >
          <div class="noir-scene-image">
            <img :src="scene.image" :alt="scene.title" loading="lazy">
            <span>{{ scene.tag }}</span>
            <b aria-hidden="true">↗</b>
          </div>
          <div class="noir-scene-meta"><span>/ {{ scene.number }}</span><h3>{{ scene.title }}</h3><small>使用此灵感 →</small></div>
        </NuxtLink>
      </div>
    </section>

    <section class="noir-capabilities" aria-label="产品能力">
      <div><span>01 / DESCRIBE</span><strong>自然语言输入</strong><p>无需参数，像聊天一样描述空间。</p></div>
      <div><span>02 / REFINE</span><strong>风格精准控制</strong><p>选择氛围，让结果更贴近偏好。</p></div>
      <div><span>03 / CREATE</span><strong>空间即时呈现</strong><p>把抽象灵感，变成清晰视觉提案。</p></div>
    </section>

    <footer class="noir-footer"><span>造间 — IMAGINE YOUR NEXT SPACE</span><NuxtLink to="/prototypes/noir/generate">ENTER THE STUDIO ↗</NuxtLink></footer>
  </main>
</template>

<style scoped>
.noir-home { --noir-bg: #121410; --noir-panel: #1a1d17; --noir-text: #eef0e8; --noir-muted: #92978a; --noir-accent: #d7f99d; min-height: 100vh; padding: 0 3vw 110px; color: var(--noir-text); background: var(--noir-bg); font-family: Arial, "PingFang SC", sans-serif; }
.noir-home :global(a) { color: inherit; text-decoration: none; }
.noir-nav { display: flex; max-width: 1480px; height: 86px; margin: auto; align-items: center; justify-content: space-between; }
.noir-brand { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 600; letter-spacing: .08em; }
.noir-brand small { color: var(--noir-muted); font-size: 8px; font-weight: 400; letter-spacing: .12em; }
.noir-logo { display: grid; grid-template-columns: repeat(2, 8px); gap: 2px; transform: rotate(45deg); }
.noir-logo i { width: 8px; height: 8px; background: var(--noir-accent); }
.noir-logo i:nth-child(2), .noir-logo i:nth-child(3) { opacity: .35; }
.noir-status { display: flex; align-items: center; gap: 8px; color: var(--noir-muted); font-size: 8px; letter-spacing: .16em; }
.noir-status i { width: 5px; height: 5px; background: var(--noir-accent); border-radius: 50%; box-shadow: 0 0 10px var(--noir-accent); }
.noir-status span { color: var(--noir-accent); }
.noir-nav-cta { display: flex; align-items: center; gap: 20px; padding: 10px 16px; border: 1px solid #393d33; border-radius: 99px; font-size: 11px; }
.noir-nav-cta span { color: var(--noir-accent); }
.noir-hero { position: relative; max-width: 1480px; height: min(74vh, 760px); min-height: 620px; margin: auto; overflow: hidden; border: 1px solid #2c3027; border-radius: 3px; }
.noir-hero-bg, .noir-hero-shade, .noir-grid { position: absolute; inset: 0; width: 100%; height: 100%; }
.noir-hero-bg { object-fit: cover; object-position: center; filter: saturate(.72) brightness(.74); }
.noir-hero-shade { background: linear-gradient(90deg, rgb(10 13 9 / .9) 0%, rgb(10 13 9 / .55) 50%, rgb(10 13 9 / .18) 100%), linear-gradient(0deg, rgb(10 13 9 / .72), transparent 55%); }
.noir-grid { opacity: .12; background-image: linear-gradient(#c7cebd 1px, transparent 1px), linear-gradient(90deg, #c7cebd 1px, transparent 1px); background-size: 100px 100px; }
.noir-hero-top { position: absolute; top: 26px; right: 28px; left: 28px; display: flex; justify-content: space-between; color: #b4baaa; font-size: 8px; letter-spacing: .2em; }
.noir-hero-copy { position: absolute; top: 50%; left: 6%; width: 80%; transform: translateY(-47%); }
.noir-hero-copy > p:first-child { display: flex; align-items: center; gap: 10px; margin: 0 0 22px; color: var(--noir-accent); font-size: 11px; letter-spacing: .15em; }
.noir-hero-copy > p:first-child span { width: 26px; height: 1px; background: var(--noir-accent); }
.noir-hero h1 { max-width: 1000px; margin: 0; font-size: clamp(48px, 6.3vw, 92px); font-weight: 500; line-height: 1.15; letter-spacing: -.07em; }
.noir-hero h1 span { color: var(--noir-accent); }
.noir-hero-bottom { display: flex; max-width: 760px; align-items: center; justify-content: space-between; gap: 30px; margin-top: 38px; }
.noir-hero-bottom > p { margin: 0; color: #c0c5b8; font-size: 12px; line-height: 1.9; }
.noir-primary { display: flex; min-width: 190px; align-items: center; justify-content: space-between; padding: 8px 8px 8px 22px; color: #171a13 !important; background: var(--noir-accent); border-radius: 99px; font-size: 13px; font-weight: 600; }
.noir-primary b { display: grid; width: 38px; height: 38px; place-items: center; color: var(--noir-accent); background: #171a13; border-radius: 50%; font-size: 18px; }
.noir-prompt-card { position: absolute; right: 3%; bottom: 8%; width: 245px; padding: 20px; border: 1px solid rgb(224 233 211 / .25); background: rgb(18 21 16 / .72); backdrop-filter: blur(14px); }
.noir-prompt-card > span { color: var(--noir-accent); font-size: 8px; letter-spacing: .2em; }
.noir-prompt-card > p { margin: 16px 0 20px; font-size: 14px; line-height: 1.8; }
.noir-prompt-card > div { display: flex; align-items: center; gap: 4px; }
.noir-prompt-card i { width: 3px; height: 3px; background: var(--noir-accent); border-radius: 50%; }
.noir-prompt-card b { margin-left: auto; color: var(--noir-muted); font-size: 7px; font-weight: 400; letter-spacing: .14em; }
.noir-scroll { position: absolute; bottom: 24px; left: 28px; color: #a9afa0; font-size: 7px; letter-spacing: .18em; }
.noir-scenes { max-width: 1480px; margin: auto; padding: 100px 0 80px; }
.noir-section-head { display: flex; align-items: end; justify-content: space-between; margin-bottom: 32px; }
.noir-section-head span { color: var(--noir-accent); font-size: 8px; letter-spacing: .18em; }
.noir-section-head h2 { margin: 12px 0 0; font-size: 32px; font-weight: 500; letter-spacing: -.04em; }
.noir-section-head > p { margin: 0; color: var(--noir-muted); font-size: 11px; line-height: 1.8; }
.noir-scene-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.noir-scene { padding: 10px; border: 1px solid #2c3027; background: var(--noir-panel); }
.noir-scene-image { position: relative; height: 300px; overflow: hidden; }
.noir-scene-image img { width: 100%; height: 100%; object-fit: cover; filter: saturate(.65) brightness(.78); transition: filter .4s, transform .6s; }
.noir-scene:hover img { filter: saturate(.9) brightness(.9); transform: scale(1.03); }
.noir-scene-image > span { position: absolute; top: 12px; left: 12px; padding: 5px 8px; color: #e8ecdf; background: rgb(15 17 13 / .7); font-size: 7px; letter-spacing: .13em; }
.noir-scene-image > b { position: absolute; right: 12px; bottom: 12px; display: grid; width: 34px; height: 34px; place-items: center; color: #171a13; background: var(--noir-accent); border-radius: 50%; font-weight: 400; }
.noir-scene-meta { display: grid; grid-template-columns: 45px 1fr auto; align-items: center; padding: 17px 5px 8px; }
.noir-scene-meta > span { color: var(--noir-accent); font-size: 8px; }
.noir-scene-meta h3 { margin: 0; font-size: 16px; font-weight: 500; }
.noir-scene-meta small { color: var(--noir-muted); font-size: 9px; }
.noir-capabilities { display: grid; max-width: 1480px; margin: auto; grid-template-columns: repeat(3, 1fr); border-top: 1px solid #30342b; border-bottom: 1px solid #30342b; }
.noir-capabilities > div { padding: 36px 30px; border-right: 1px solid #30342b; }
.noir-capabilities > div:last-child { border: 0; }
.noir-capabilities span { color: var(--noir-accent); font-size: 8px; letter-spacing: .16em; }
.noir-capabilities strong { display: block; margin: 16px 0 8px; font-size: 17px; font-weight: 500; }
.noir-capabilities p { margin: 0; color: var(--noir-muted); font-size: 11px; }
.noir-footer { display: flex; max-width: 1480px; margin: auto; justify-content: space-between; padding-top: 26px; color: var(--noir-muted); font-size: 8px; letter-spacing: .15em; }
.noir-footer a { color: var(--noir-accent); }
@media (max-width: 1000px) {
  .noir-prompt-card { display: none; }
  .noir-hero-copy { width: 88%; }
  .noir-scene-image { height: 240px; }
}
@media (max-width: 640px) {
  .noir-home { padding: 0 14px 96px; }
  .noir-nav { height: 74px; }
  .noir-status { display: none; }
  .noir-brand small { display: none; }
  .noir-nav-cta { gap: 10px; padding: 8px 13px; }
  .noir-hero { height: 78vh; min-height: 630px; }
  .noir-hero-bg { object-position: 64% center; }
  .noir-hero-shade { background: linear-gradient(0deg, rgb(10 13 9 / .9), rgb(10 13 9 / .12) 90%), linear-gradient(90deg, rgb(10 13 9 / .55), transparent); }
  .noir-hero-top { top: 18px; right: 18px; left: 18px; }
  .noir-hero-top span:last-child { display: none; }
  .noir-hero-copy { top: auto; bottom: 66px; left: 7%; width: 86%; transform: none; }
  .noir-hero h1 { font-size: clamp(45px, 13.5vw, 62px); line-height: 1.18; }
  .noir-hero-bottom { display: block; margin-top: 26px; }
  .noir-primary { width: 100%; margin-top: 24px; }
  .noir-scroll { bottom: 20px; left: 20px; }
  .noir-scenes { padding: 70px 0 56px; }
  .noir-section-head > p { display: none; }
  .noir-scene-grid { grid-template-columns: 1fr; gap: 22px; }
  .noir-scene-image { height: 66vw; }
  .noir-capabilities { grid-template-columns: 1fr; }
  .noir-capabilities > div { padding: 28px 12px; border-right: 0; border-bottom: 1px solid #30342b; }
  .noir-footer { gap: 20px; line-height: 1.7; }
}
</style>
