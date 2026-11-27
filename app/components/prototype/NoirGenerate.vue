<script setup lang="ts">
defineOptions({ name: 'PrototypeNoirGenerate' })

const {
  prompt,
  promptCount,
  selectedStyle,
  selectedRatio,
  isGenerating,
  hasResult,
  previewImage,
  canGenerate,
  appendPrompt,
  generatePreview,
} = usePrototypeStudio({
  id: 'noir',
  initialPrompt: '自然现代客厅，灰色布艺，皮革单椅，大面积落地窗与绿植',
  initialImage: '/prototypes/noir-living.jpg',
  resultImage: '/prototypes/noir-detail.jpg',
})
selectedStyle.value = '自然现代'
selectedRatio.value = '16:9'

const styles = ['自然现代', '暗黑极简', '未来工业']
const ratios = ['16:9', '4:3', '1:1', '9:16']
const chips = ['电影感光线', '天然石材', '深色系', '空间留白']
</script>

<template>
  <main class="noir-studio">
    <header class="noir-studio-nav">
      <NuxtLink to="/prototypes/noir" class="noir-studio-brand"><span><i /><i /><i /><i /></span>造间 <small>STUDIO®</small></NuxtLink>
      <div class="noir-session"><i /> SESSION 001 <span>/</span> AUTOSAVED</div>
      <NuxtLink to="/prototypes/noir" class="noir-exit">退出工作室 <b>×</b></NuxtLink>
    </header>

    <section class="noir-studio-heading">
      <div><p>AI ENVIRONMENT GENERATOR / V.01</p><h1>把想象，转译为空间。</h1></div>
      <div class="noir-steps"><span class="active">01 描述</span><i /><span class="active">02 设定</span><i /><span>03 生成</span></div>
    </section>

    <div class="noir-workspace">
      <form class="noir-controls" @submit.prevent="generatePreview">
        <div class="noir-panel-label"><span>01 / INPUT</span><small>自然语言</small></div>
        <label for="noir-prompt">描述你想看见的空间</label>
        <div class="noir-prompt-box">
          <textarea id="noir-prompt" v-model="prompt" maxlength="120" rows="6" placeholder="一个怎样的空间？有怎样的光和材质？" />
          <div><span><i /> PROMPT READY</span><b>{{ promptCount }} / 120</b></div>
        </div>
        <div class="noir-prompt-chips"><button v-for="chip in chips" :key="chip" type="button" @click="appendPrompt(chip)">+ {{ chip }}</button></div>

        <div class="noir-panel-label noir-direction"><span>02 / DIRECTION</span><small>风格与画幅</small></div>
        <fieldset class="noir-style-field">
          <legend>视觉方向</legend>
          <div>
            <button v-for="(style, index) in styles" :key="style" type="button" :class="{ selected: selectedStyle === style }" @click="selectedStyle = style">
              <span>0{{ index + 1 }}</span>{{ style }}<i aria-hidden="true">↗</i>
            </button>
          </div>
        </fieldset>
        <fieldset class="noir-ratio-field">
          <legend>画幅比例</legend>
          <div><button v-for="ratio in ratios" :key="ratio" type="button" :class="{ selected: selectedRatio === ratio }" @click="selectedRatio = ratio">{{ ratio }}</button></div>
        </fieldset>

        <button class="noir-generate" type="submit" :disabled="!canGenerate">
          <span><i aria-hidden="true" />{{ isGenerating ? '正在生成空间…' : hasResult ? '再次生成' : '生成空间' }}</span><b aria-hidden="true">↗</b>
        </button>
        <p class="noir-demo-note">PROTOTYPE ONLY / 不调用真实生成服务</p>
      </form>

      <section class="noir-viewport" aria-label="空间实时预览">
        <div class="noir-viewport-head"><span>OUTPUT_VIEW / 001</span><div><i /> {{ isGenerating ? 'GENERATING' : hasResult ? 'RENDER COMPLETE' : 'SYSTEM READY' }}</div></div>
        <div class="noir-viewport-grid">
          <span class="noir-corner corner-tl" aria-hidden="true" /><span class="noir-corner corner-tr" aria-hidden="true" /><span class="noir-corner corner-bl" aria-hidden="true" /><span class="noir-corner corner-br" aria-hidden="true" />
          <figure
            class="noir-output"
            :class="{ portrait: selectedRatio === '9:16', square: selectedRatio === '1:1' }"
            :style="{ aspectRatio: selectedRatio.replace(':', ' / ') }"
            aria-live="polite"
          >
            <img :src="previewImage" :alt="hasResult ? '根据描述生成的原型演示结果' : '暮光自然现代风空间示例'">
            <div class="noir-output-shade" />
            <span class="noir-output-badge">{{ hasResult ? 'AI GENERATED / DEMO' : 'REFERENCE FRAME' }}</span>
            <div class="noir-output-coordinates">X 31.2304<br>Y 121.4737</div>
            <figcaption><p>{{ prompt }}</p><div><span>{{ selectedStyle }}</span><span>{{ selectedRatio }}</span><span>HQ</span></div></figcaption>
            <div v-if="isGenerating" class="noir-loading"><span class="noir-loader"><i /><i /><i /></span><strong>正在生成你的空间</strong><small>ANALYZING LIGHT · MATERIAL · ATMOSPHERE</small></div>
          </figure>
        </div>
        <div class="noir-viewport-foot"><div><span>MODEL</span><b>ZAOJIAN V1</b></div><div><span>MODE</span><b>CONCEPT</b></div><div><span>STATUS</span><b>{{ hasResult ? 'COMPLETE' : 'PREVIEW' }}</b></div><small>01 / 01</small></div>
      </section>
    </div>
    <footer class="noir-studio-footer"><span>造间 / GENERATIVE SPACE SYSTEM</span><span>ALL POSSIBILITIES BEGIN WITH A PROMPT.</span></footer>
  </main>
</template>

<style scoped>
.noir-studio { --bg: #121410; --panel: #191c16; --line: #31362b; --text: #eef0e8; --muted: #8c9383; --accent: #d7f99d; min-height: 100vh; padding: 0 3vw 110px; color: var(--text); background: var(--bg); font-family: Arial, "PingFang SC", sans-serif; }
.noir-studio :global(a) { color: inherit; text-decoration: none; }
.noir-studio-nav { display: flex; max-width: 1500px; height: 78px; margin: auto; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
.noir-studio-brand { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 600; letter-spacing: .08em; }
.noir-studio-brand > span { display: grid; grid-template-columns: repeat(2, 7px); gap: 2px; transform: rotate(45deg); }
.noir-studio-brand > span i { width: 7px; height: 7px; background: var(--accent); }
.noir-studio-brand > span i:nth-child(2), .noir-studio-brand > span i:nth-child(3) { opacity: .35; }
.noir-studio-brand small { color: var(--muted); font-size: 8px; font-weight: 400; }
.noir-session { display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 8px; letter-spacing: .15em; }
.noir-session > i { width: 4px; height: 4px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 8px var(--accent); }
.noir-session span { color: #484e41; }
.noir-exit { display: flex; align-items: center; gap: 14px; color: var(--muted); font-size: 10px; }
.noir-exit b { display: grid; width: 28px; height: 28px; place-items: center; color: var(--text); border: 1px solid var(--line); border-radius: 50%; font-size: 16px; font-weight: 400; }
.noir-studio-heading { display: flex; max-width: 1500px; margin: auto; align-items: end; justify-content: space-between; padding: 38px 0 28px; }
.noir-studio-heading p { margin: 0 0 10px; color: var(--accent); font-size: 8px; letter-spacing: .18em; }
.noir-studio-heading h1 { margin: 0; font-size: clamp(30px, 3.6vw, 48px); font-weight: 500; letter-spacing: -.06em; }
.noir-steps { display: flex; align-items: center; gap: 10px; padding-bottom: 5px; color: #656b5f; font-size: 9px; }
.noir-steps span.active { color: var(--text); }
.noir-steps i { width: 28px; height: 1px; background: var(--line); }
.noir-workspace { display: grid; max-width: 1500px; min-height: 700px; margin: auto; grid-template-columns: minmax(350px, 420px) 1fr; border: 1px solid var(--line); }
.noir-controls { display: flex; flex-direction: column; padding: 26px; border-right: 1px solid var(--line); background: var(--panel); }
.noir-panel-label { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
.noir-panel-label > span { color: var(--accent); font-size: 8px; letter-spacing: .17em; }
.noir-panel-label > small { color: var(--muted); font-size: 9px; }
.noir-controls > label { display: block; margin-bottom: 9px; color: #c9cec1; font-size: 11px; }
.noir-prompt-box { border: 1px solid #3a4033; background: #12150f; transition: border-color .2s, box-shadow .2s; }
.noir-prompt-box:focus-within { border-color: var(--accent); box-shadow: 0 0 0 2px rgb(215 249 157 / .07); }
.noir-prompt-box textarea { display: block; width: 100%; min-height: 140px; padding: 15px; resize: vertical; color: var(--text); background: transparent; border: 0; outline: 0; font-size: 13px; line-height: 1.85; box-sizing: border-box; }
.noir-prompt-box textarea::placeholder { color: #666d5f; }
.noir-prompt-box > div { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-top: 1px solid #2b3026; color: var(--muted); font-size: 7px; letter-spacing: .12em; }
.noir-prompt-box > div > span { display: flex; align-items: center; gap: 6px; }
.noir-prompt-box > div i { width: 3px; height: 3px; background: var(--accent); border-radius: 50%; }
.noir-prompt-box b { font-weight: 400; }
.noir-prompt-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
.noir-prompt-chips button { padding: 5px 8px; color: var(--muted); background: transparent; border: 1px solid var(--line); border-radius: 99px; font-size: 9px; cursor: pointer; }
.noir-prompt-chips button:hover { color: var(--accent); border-color: #69775a; }
.noir-direction { margin-top: 30px; margin-bottom: 16px; padding-top: 20px; border-top: 1px solid var(--line); }
.noir-style-field, .noir-ratio-field { margin: 0; padding: 0; border: 0; }
.noir-style-field legend, .noir-ratio-field legend { margin-bottom: 10px; color: var(--muted); font-size: 9px; }
.noir-style-field > div { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.noir-style-field button { display: flex; min-height: 62px; flex-direction: column; align-items: flex-start; justify-content: space-between; padding: 8px; color: var(--muted); background: #141710; border: 1px solid var(--line); font-size: 10px; cursor: pointer; }
.noir-style-field button > span { font-size: 7px; }
.noir-style-field button i { align-self: flex-end; font-size: 11px; font-style: normal; }
.noir-style-field button.selected { color: var(--accent); border-color: var(--accent); background: rgb(215 249 157 / .04); }
.noir-ratio-field { margin-top: 20px; }
.noir-ratio-field > div { display: grid; grid-template-columns: repeat(4, 1fr); }
.noir-ratio-field button { height: 32px; margin-left: -1px; color: var(--muted); background: transparent; border: 1px solid var(--line); font-size: 9px; cursor: pointer; }
.noir-ratio-field button:first-child { margin-left: 0; }
.noir-ratio-field button.selected { position: relative; z-index: 1; color: #171a13; background: var(--accent); border-color: var(--accent); }
.noir-generate { display: flex; width: 100%; align-items: center; justify-content: space-between; margin-top: auto; padding: 8px 8px 8px 17px; color: #171a13; background: var(--accent); border: 0; border-radius: 99px; font-size: 12px; font-weight: 600; cursor: pointer; }
.noir-generate > span { display: flex; align-items: center; gap: 8px; }
.noir-generate > span i { width: 5px; height: 5px; background: #171a13; border-radius: 50%; }
.noir-generate > b { display: grid; width: 34px; height: 34px; place-items: center; color: var(--accent); background: #171a13; border-radius: 50%; font-size: 16px; font-weight: 400; }
.noir-generate:disabled { cursor: not-allowed; opacity: .45; }
.noir-controls:has(.noir-style-field) .noir-generate { margin-top: 28px; }
.noir-demo-note { margin: 9px 0 0; color: var(--muted); font-size: 7px; letter-spacing: .1em; text-align: center; }
.noir-viewport { display: flex; min-width: 0; flex-direction: column; background: #0e100c; }
.noir-viewport-head { display: flex; align-items: center; justify-content: space-between; padding: 15px 18px; color: var(--muted); border-bottom: 1px solid var(--line); font-size: 8px; letter-spacing: .14em; }
.noir-viewport-head > div { display: flex; align-items: center; gap: 7px; color: var(--accent); }
.noir-viewport-head i { width: 4px; height: 4px; background: var(--accent); border-radius: 50%; }
.noir-viewport-grid { position: relative; display: flex; min-height: 580px; flex: 1; align-items: center; justify-content: center; padding: 38px; overflow: hidden; background-image: linear-gradient(rgb(140 150 125 / .07) 1px, transparent 1px), linear-gradient(90deg, rgb(140 150 125 / .07) 1px, transparent 1px); background-size: 48px 48px; }
.noir-corner { position: absolute; width: 16px; height: 16px; border-color: #505747; border-style: solid; }
.corner-tl { top: 16px; left: 16px; border-width: 1px 0 0 1px; }.corner-tr { top: 16px; right: 16px; border-width: 1px 1px 0 0; }.corner-bl { bottom: 16px; left: 16px; border-width: 0 0 1px 1px; }.corner-br { right: 16px; bottom: 16px; border-width: 0 1px 1px 0; }
.noir-output { position: relative; width: 100%; max-height: 560px; margin: 0; overflow: hidden; background: #23271e; box-shadow: 0 18px 55px rgb(0 0 0 / .45); }
.noir-output.portrait { width: min(44%, 320px); }
.noir-output.square { width: min(72%, 530px); }
.noir-output > img { width: 100%; height: 100%; object-fit: cover; filter: saturate(.78) brightness(.85); }
.noir-output-shade { position: absolute; inset: 0; background: linear-gradient(transparent 55%, rgb(7 9 6 / .82)); }
.noir-output-badge { position: absolute; top: 12px; left: 12px; padding: 6px 8px; color: var(--accent); background: rgb(15 18 12 / .75); border: 1px solid rgb(215 249 157 / .25); font-size: 7px; letter-spacing: .12em; }
.noir-output-coordinates { position: absolute; top: 14px; right: 14px; color: rgb(238 240 232 / .65); font-size: 6px; line-height: 1.7; letter-spacing: .13em; text-align: right; }
.noir-output figcaption { position: absolute; right: 18px; bottom: 15px; left: 18px; }
.noir-output figcaption p { display: -webkit-box; margin: 0 0 10px; overflow: hidden; color: #e4e8dc; font-size: 12px; line-height: 1.7; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.noir-output figcaption > div { display: flex; gap: 6px; }
.noir-output figcaption span { padding: 4px 7px; color: #bec5b5; border: 1px solid rgb(238 240 232 / .25); font-size: 7px; }
.noir-viewport-foot { display: flex; align-items: center; gap: 30px; padding: 14px 18px; border-top: 1px solid var(--line); }
.noir-viewport-foot > div { display: flex; flex-direction: column; gap: 3px; }
.noir-viewport-foot span { color: #68705f; font-size: 6px; letter-spacing: .14em; }
.noir-viewport-foot b { color: #b5bcac; font-size: 8px; font-weight: 400; }
.noir-viewport-foot small { margin-left: auto; color: var(--accent); font-size: 8px; }
.noir-loading { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; background: rgb(12 15 10 / .88); backdrop-filter: blur(5px); }
.noir-loader { display: flex; gap: 5px; margin-bottom: 20px; }
.noir-loader i { width: 6px; height: 26px; background: var(--accent); animation: noir-pulse .7s ease-in-out infinite alternate; }
.noir-loader i:nth-child(2) { animation-delay: .15s; }.noir-loader i:nth-child(3) { animation-delay: .3s; }
.noir-loading strong { font-size: 14px; font-weight: 500; }
.noir-loading small { margin-top: 8px; color: var(--muted); font-size: 7px; letter-spacing: .12em; }
.noir-studio-footer { display: flex; max-width: 1500px; margin: auto; justify-content: space-between; padding-top: 18px; color: var(--muted); font-size: 7px; letter-spacing: .15em; }
@keyframes noir-pulse { to { height: 10px; opacity: .35; } }
@media (min-width: 1100px) {
  .noir-controls:has(.noir-style-field) .noir-generate { margin-top: auto; }
  .noir-ratio-field { margin-bottom: 28px; }
}
@media (max-width: 1000px) {
  .noir-workspace { grid-template-columns: 350px 1fr; }
  .noir-controls { padding: 22px; }
  .noir-viewport-grid { padding: 24px; }
}
@media (max-width: 760px) {
  .noir-studio { padding: 0 14px 96px; }
  .noir-studio-nav { height: 70px; }
  .noir-session { display: none; }
  .noir-studio-heading { display: block; padding: 32px 0 24px; }
  .noir-steps { margin-top: 20px; }
  .noir-workspace { display: flex; flex-direction: column; border: 0; }
  .noir-controls { padding: 22px 0 30px; border: 0; background: transparent; }
  .noir-viewport { border: 1px solid var(--line); }
  .noir-viewport-grid { min-height: 390px; padding: 24px; }
  .noir-output.portrait { width: min(70%, 300px); }
  .noir-viewport-foot { gap: 20px; }
  .noir-studio-footer { gap: 18px; line-height: 1.7; }
}
</style>
