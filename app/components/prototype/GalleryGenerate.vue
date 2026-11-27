<script setup lang="ts">
defineOptions({ name: 'PrototypeGalleryGenerate' })

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
  id: 'gallery',
  initialPrompt: '奶油白客厅，低矮模块沙发，自然侧光，极简而温暖',
  initialImage: '/prototypes/gallery-living.jpg',
  resultImage: '/prototypes/gallery-detail.jpg',
})
selectedStyle.value = '极简主义'
selectedRatio.value = '16:9'

const styles = ['极简主义', '现代主义', '包豪斯']
const ratios = ['16:9', '4:3', '1:1', '9:16']
const suggestions = ['大尺度留白', '自然侧光', '黑白灰', '几何线条']
</script>

<template>
  <main class="gallery-studio">
    <header class="gallery-studio-nav">
      <NuxtLink to="/prototypes/gallery" class="gallery-studio-brand">造间<span>®</span></NuxtLink>
      <div><span>STUDIO</span><i />NEW PROJECT 001</div>
      <NuxtLink to="/prototypes/gallery">保存并退出 <b>×</b></NuxtLink>
    </header>

    <section class="gallery-studio-title">
      <div><p>FROM WORDS TO SPACE</p><h1>空间创作室<span>↗</span></h1></div>
      <p>一个清晰的工作台。<br>所有选择，都服务于你的想象。</p>
    </section>

    <div class="gallery-workbench">
      <form class="gallery-controls" @submit.prevent="generatePreview">
        <div class="gallery-control-heading"><span>01</span><h2>描述 / DESCRIPTION</h2></div>
        <div class="gallery-prompt">
          <label for="gallery-prompt">你想生活在什么样的空间里？</label>
          <textarea id="gallery-prompt" v-model="prompt" maxlength="120" rows="6" placeholder="空间类型、风格、材质、光线……" />
          <span>{{ String(promptCount).padStart(3, '0') }} / 120</span>
        </div>
        <div class="gallery-suggestions">
          <span>快速添加</span>
          <div><button v-for="item in suggestions" :key="item" type="button" @click="appendPrompt(item)">+ {{ item }}</button></div>
        </div>

        <div class="gallery-control-heading gallery-second"><span>02</span><h2>设定 / DIRECTION</h2></div>
        <fieldset class="gallery-field">
          <legend>美学方向</legend>
          <div class="gallery-style-buttons">
            <button v-for="(style, index) in styles" :key="style" type="button" :class="{ selected: selectedStyle === style }" @click="selectedStyle = style">
              <span>0{{ index + 1 }}</span>{{ style }}<i aria-hidden="true" />
            </button>
          </div>
        </fieldset>
        <fieldset class="gallery-field gallery-ratio-field">
          <legend>输出比例</legend>
          <div>
            <button v-for="ratio in ratios" :key="ratio" type="button" :class="{ selected: selectedRatio === ratio }" @click="selectedRatio = ratio">{{ ratio }}</button>
          </div>
        </fieldset>

        <div class="gallery-submit-wrap">
          <button class="gallery-generate" type="submit" :disabled="!canGenerate">
            <span>{{ isGenerating ? '生成中，请稍候' : hasResult ? '重新生成' : '生成空间' }}</span><b aria-hidden="true">→</b>
          </button>
          <p>PROTOTYPE MODE — 仅演示交互，不调用真实生成</p>
        </div>
      </form>

      <section class="gallery-canvas" aria-label="生成结果画布">
        <div class="gallery-canvas-top"><span>OUTPUT / {{ hasResult ? '002' : '001' }}</span><span>{{ isGenerating ? '● PROCESSING' : '● READY' }}</span></div>
        <div class="gallery-canvas-body">
          <span class="gallery-axis gallery-axis-x" aria-hidden="true" />
          <span class="gallery-axis gallery-axis-y" aria-hidden="true" />
          <figure
            class="gallery-output"
            :class="{ portrait: selectedRatio === '9:16', square: selectedRatio === '1:1' }"
            :style="{ aspectRatio: selectedRatio.replace(':', ' / ') }"
            aria-live="polite"
          >
            <img :src="previewImage" :alt="hasResult ? '根据描述生成的原型演示结果' : '白盒极简风空间示例'">
            <span class="gallery-output-label">{{ hasResult ? 'GENERATED CONCEPT' : 'REFERENCE PREVIEW' }}</span>
            <figcaption><span>{{ selectedStyle }}</span><span>{{ selectedRatio }}</span></figcaption>
            <div v-if="isGenerating" class="gallery-loading"><span /><p>正在构建空间</p><small>GENERATING YOUR ENVIRONMENT</small></div>
          </figure>
        </div>
        <div class="gallery-canvas-bottom"><span>{{ prompt || '等待空间描述' }}</span><b>ZAOJIAN / AI CONCEPT</b></div>
      </section>
    </div>

    <footer class="gallery-studio-footer"><span>01 输入描述</span><span>02 选择方向</span><span>03 生成空间</span><p>DESIGN PROTOTYPE B</p></footer>
  </main>
</template>

<style scoped>
.gallery-studio { --ink: #1d1d1b; --muted: #777772; --line: #cececa; min-height: 100vh; padding: 0 3vw 108px; color: var(--ink); background: #f4f4f1; font-family: Arial, "PingFang SC", sans-serif; }
.gallery-studio :global(a) { color: inherit; text-decoration: none; }
.gallery-studio-nav { display: grid; max-width: 1500px; height: 78px; margin: auto; grid-template-columns: 1fr 1fr 1fr; align-items: center; border-bottom: 1px solid var(--ink); }
.gallery-studio-brand { width: fit-content; font-size: 24px; font-weight: 800; letter-spacing: -.08em; }
.gallery-studio-brand span { margin-left: 5px; vertical-align: top; font-size: 9px; letter-spacing: 0; }
.gallery-studio-nav > div { display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--muted); font-size: 8px; letter-spacing: .15em; }
.gallery-studio-nav > div span { color: var(--ink); }
.gallery-studio-nav > div i { width: 2px; height: 2px; background: var(--muted); }
.gallery-studio-nav > a:last-child { display: flex; align-items: center; justify-self: end; gap: 14px; color: var(--muted); font-size: 10px; }
.gallery-studio-nav b { display: grid; width: 28px; height: 28px; place-items: center; color: var(--ink); border: 1px solid var(--line); border-radius: 50%; font-size: 16px; font-weight: 400; }
.gallery-studio-title { display: flex; max-width: 1500px; margin: auto; align-items: end; justify-content: space-between; padding: 38px 0 28px; }
.gallery-studio-title > div > p { margin: 0 0 8px; color: var(--muted); font-size: 8px; letter-spacing: .2em; }
.gallery-studio-title h1 { margin: 0; font-size: clamp(32px, 4vw, 52px); font-weight: 600; letter-spacing: -.07em; }
.gallery-studio-title h1 span { margin-left: 14px; font-size: .6em; font-weight: 400; }
.gallery-studio-title > p { margin: 0; color: var(--muted); font-size: 10px; line-height: 1.8; }
.gallery-workbench { display: grid; max-width: 1500px; min-height: 700px; margin: auto; grid-template-columns: minmax(350px, 420px) 1fr; border: 1px solid var(--ink); }
.gallery-controls { display: flex; flex-direction: column; padding: 28px; border-right: 1px solid var(--ink); }
.gallery-control-heading { display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--ink); }
.gallery-control-heading > span { font-size: 9px; }
.gallery-control-heading h2 { margin: 0; font-size: 10px; font-weight: 600; letter-spacing: .12em; }
.gallery-prompt { position: relative; padding-top: 18px; }
.gallery-prompt label { color: var(--muted); font-size: 10px; }
.gallery-prompt textarea { display: block; width: 100%; min-height: 132px; margin-top: 8px; padding: 0 0 26px; resize: vertical; color: var(--ink); background: transparent; border: 0; outline: 0; font-size: 14px; line-height: 1.8; box-sizing: border-box; }
.gallery-prompt textarea::placeholder { color: #aaa; }
.gallery-prompt > span { position: absolute; right: 0; bottom: 5px; color: var(--muted); font-size: 8px; }
.gallery-suggestions > span { color: var(--muted); font-size: 9px; }
.gallery-suggestions > div { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.gallery-suggestions button { padding: 5px 8px; color: var(--muted); background: transparent; border: 1px solid var(--line); font-size: 9px; cursor: pointer; }
.gallery-suggestions button:hover { color: #fff; background: var(--ink); border-color: var(--ink); }
.gallery-second { margin-top: 28px; }
.gallery-field { margin: 18px 0 0; padding: 0; border: 0; }
.gallery-field legend { margin-bottom: 10px; color: var(--muted); font-size: 9px; }
.gallery-style-buttons { border-top: 1px solid var(--line); }
.gallery-style-buttons button { display: grid; width: 100%; grid-template-columns: 35px 1fr 14px; align-items: center; padding: 10px 4px; color: var(--muted); background: transparent; border: 0; border-bottom: 1px solid var(--line); text-align: left; font-size: 11px; cursor: pointer; }
.gallery-style-buttons button > span { font-size: 8px; }
.gallery-style-buttons button i { width: 10px; height: 10px; border: 1px solid var(--line); border-radius: 50%; }
.gallery-style-buttons button.selected { color: var(--ink); font-weight: 600; }
.gallery-style-buttons button.selected i { background: var(--ink); border: 3px solid #f4f4f1; box-shadow: 0 0 0 1px var(--ink); }
.gallery-ratio-field > div { display: grid; grid-template-columns: repeat(4, 1fr); }
.gallery-ratio-field button { height: 32px; margin-left: -1px; color: var(--muted); background: transparent; border: 1px solid var(--line); font-size: 9px; cursor: pointer; }
.gallery-ratio-field button:first-child { margin-left: 0; }
.gallery-ratio-field button.selected { position: relative; z-index: 1; color: #fff; background: var(--ink); border-color: var(--ink); }
.gallery-submit-wrap { margin-top: auto; padding-top: 24px; }
.gallery-generate { display: flex; width: 100%; align-items: center; justify-content: space-between; padding: 14px 16px; color: #fff; background: var(--ink); border: 0; font-size: 12px; cursor: pointer; }
.gallery-generate b { font-size: 18px; font-weight: 400; }
.gallery-generate:disabled { opacity: .45; cursor: not-allowed; }
.gallery-submit-wrap > p { margin: 8px 0 0; color: var(--muted); font-size: 7px; letter-spacing: .08em; text-align: center; }
.gallery-canvas { display: flex; min-width: 0; flex-direction: column; background: #e8e8e4; }
.gallery-canvas-top, .gallery-canvas-bottom { display: flex; align-items: center; justify-content: space-between; padding: 15px 18px; color: var(--muted); font-size: 8px; letter-spacing: .12em; }
.gallery-canvas-top { border-bottom: 1px solid var(--line); }
.gallery-canvas-body { position: relative; display: flex; min-height: 580px; flex: 1; align-items: center; justify-content: center; padding: 38px; overflow: hidden; }
.gallery-axis { position: absolute; background: var(--line); opacity: .6; }
.gallery-axis-x { top: 50%; right: 18px; left: 18px; height: 1px; }
.gallery-axis-y { top: 18px; bottom: 18px; left: 50%; width: 1px; }
.gallery-output { position: relative; z-index: 1; width: 100%; max-height: 560px; margin: 0; overflow: hidden; background: #ccc; box-shadow: 0 12px 35px rgb(0 0 0 / .1); }
.gallery-output.portrait { width: min(44%, 320px); }
.gallery-output.square { width: min(72%, 530px); }
.gallery-output > img { width: 100%; height: 100%; object-fit: cover; }
.gallery-output-label { position: absolute; top: 0; left: 0; padding: 7px 9px; color: #fff; background: var(--ink); font-size: 7px; letter-spacing: .13em; }
.gallery-output figcaption { position: absolute; right: 0; bottom: 0; display: flex; color: #fff; background: var(--ink); font-size: 8px; }
.gallery-output figcaption span { padding: 8px 10px; border-left: 1px solid #555; }
.gallery-canvas-bottom { gap: 20px; border-top: 1px solid var(--line); letter-spacing: 0; }
.gallery-canvas-bottom > span { max-width: 70%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gallery-canvas-bottom b { flex-shrink: 0; font-size: 7px; font-weight: 400; letter-spacing: .12em; }
.gallery-loading { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; color: #fff; background: rgb(20 20 18 / .82); backdrop-filter: blur(4px); }
.gallery-loading > span { width: 34px; height: 34px; margin-bottom: 16px; border: 1px solid #666; border-top-color: #fff; border-radius: 50%; animation: gallery-spin .8s linear infinite; }
.gallery-loading p { margin: 0; font-size: 13px; }
.gallery-loading small { margin-top: 6px; color: #bbb; font-size: 7px; letter-spacing: .16em; }
.gallery-studio-footer { display: flex; max-width: 1500px; margin: auto; gap: 30px; padding-top: 18px; color: var(--muted); font-size: 8px; letter-spacing: .1em; }
.gallery-studio-footer p { margin: 0 0 0 auto; }
@keyframes gallery-spin { to { transform: rotate(360deg); } }
@media (max-width: 1000px) {
  .gallery-workbench { grid-template-columns: 350px 1fr; }
  .gallery-controls { padding: 22px; }
  .gallery-canvas-body { padding: 24px; }
}
@media (max-width: 760px) {
  .gallery-studio { padding: 0 16px 96px; }
  .gallery-studio-nav { height: 70px; grid-template-columns: 1fr 1fr; }
  .gallery-studio-nav > div { display: none; }
  .gallery-studio-title { padding: 32px 0 24px; }
  .gallery-studio-title > p { display: none; }
  .gallery-workbench { display: flex; flex-direction: column; border: 0; }
  .gallery-controls { padding: 0 0 28px; border: 0; }
  .gallery-submit-wrap { margin-top: 28px; }
  .gallery-canvas { border: 1px solid var(--ink); }
  .gallery-canvas-body { min-height: 390px; padding: 24px; }
  .gallery-output.portrait { width: min(70%, 300px); }
  .gallery-studio-footer { gap: 14px; flex-wrap: wrap; }
  .gallery-studio-footer p { width: 100%; margin: 0; }
}
</style>
