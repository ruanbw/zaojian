<script setup lang="ts">
defineOptions({ name: 'PrototypeWarmGenerate' })

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
  id: 'warm',
  initialPrompt: '朝南的客厅，原木家具，米白墙面，午后的光落在地板上',
  initialImage: '/prototypes/warm-living.jpg',
  resultImage: '/prototypes/warm-bedroom.jpg',
})

const styles = ['自然原木', '奶油侘寂', '现代简约']
const ratios = ['4:3', '1:1', '3:4']
const chips = ['柔和自然光', '浅木色', '亚麻材质', '少量绿植']
</script>

<template>
  <main class="warm-studio">
    <header class="warm-studio-nav">
      <NuxtLink to="/prototypes/warm" class="warm-studio-brand"><span>间</span>造间 <small>ATELIER</small></NuxtLink>
      <p>空间创作室 <i /> 灵感预览</p>
      <NuxtLink to="/prototypes/warm" class="warm-studio-back">返回灵感集 <span>×</span></NuxtLink>
    </header>

    <section class="warm-studio-heading">
      <div><p>CREATE YOUR SPACE / 01</p><h1>你的家，从一段描述开始。</h1></div>
      <span>无需专业术语，写下你真正喜欢的生活片段。</span>
    </section>

    <div class="warm-workspace">
      <form class="warm-composer" @submit.prevent="generatePreview">
        <div class="warm-form-head"><span>01</span><h2>描述你的空间</h2><small>DESCRIBE</small></div>
        <label for="warm-prompt" class="warm-label">空间想象</label>
        <div class="warm-textarea">
          <textarea id="warm-prompt" v-model="prompt" maxlength="120" rows="5" placeholder="例如：一间有落地窗的客厅，午后有光，原木和米白色……" />
          <span>{{ promptCount }} / 120</span>
        </div>
        <div class="warm-chips" aria-label="补充描述">
          <button v-for="chip in chips" :key="chip" type="button" @click="appendPrompt(chip)">+ {{ chip }}</button>
        </div>

        <fieldset class="warm-options">
          <legend><span>02</span>选择偏好的氛围</legend>
          <div class="warm-style-grid">
            <button
              v-for="style in styles"
              :key="style"
              type="button"
              :class="{ selected: selectedStyle === style }"
              :aria-pressed="selectedStyle === style"
              @click="selectedStyle = style"
            >
              <i :class="`warm-swatch-${style}`" aria-hidden="true" />
              <span>{{ style }}</span>
              <b aria-hidden="true">✓</b>
            </button>
          </div>
        </fieldset>

        <fieldset class="warm-ratio-field">
          <legend>画幅比例</legend>
          <div class="warm-ratios">
            <button v-for="ratio in ratios" :key="ratio" type="button" :class="{ selected: selectedRatio === ratio }" @click="selectedRatio = ratio">
              <i :style="{ aspectRatio: ratio.replace(':', ' / ') }" aria-hidden="true" />{{ ratio }}
            </button>
          </div>
        </fieldset>

        <button class="warm-generate" type="submit" :disabled="!canGenerate">
          <span>{{ isGenerating ? '正在描绘空间…' : hasResult ? '再生成一版' : '生成我的空间' }}</span><b aria-hidden="true">→</b>
        </button>
        <p class="warm-demo-note">原型交互演示 · 不调用真实生成服务</p>
      </form>

      <section class="warm-preview-area" aria-label="空间效果预览">
        <div class="warm-preview-head"><span>SPACE PREVIEW</span><span><i /> {{ isGenerating ? 'RENDERING' : hasResult ? 'COMPLETE' : 'INSPIRATION' }}</span></div>
        <figure
          class="warm-preview"
          :class="{ portrait: selectedRatio === '3:4', square: selectedRatio === '1:1' }"
          :style="{ aspectRatio: selectedRatio.replace(':', ' / ') }"
          aria-live="polite"
        >
          <img :src="previewImage" :alt="hasResult ? '根据描述生成的原型演示结果' : '暖木自然风空间示例'">
          <div class="warm-preview-shade" />
          <span class="warm-preview-badge">{{ hasResult ? '原型演示结果' : '示例效果' }}</span>
          <figcaption>
            <p>{{ prompt || '你的空间描述会显示在这里' }}</p>
            <div><span>{{ selectedStyle }}</span><i /><span>{{ selectedRatio }}</span><i /><span>AI CONCEPT</span></div>
          </figcaption>
          <div v-if="isGenerating" class="warm-loading">
            <span class="warm-loader" aria-hidden="true" />
            <strong>正在组织光线与材质</strong>
            <small>把想象转译为空间…</small>
          </div>
        </figure>
        <div class="warm-preview-foot"><span>造间 · 空间概念提案</span><span>01 / 01</span></div>
        <div class="warm-preview-tip"><span>创作提示</span><p>加入时间段和光线，例如「清晨的侧光」，<br>能让空间氛围更具体。</p></div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.warm-studio { --ink: #342d26; --muted: #82766b; --clay: #9a5f43; --line: #d9cfc1; min-height: 100vh; padding: 0 5vw 112px; color: var(--ink); background: #f4efe6; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif; }
.warm-studio :global(a) { color: inherit; text-decoration: none; }
.warm-studio-nav { display: flex; max-width: 1320px; height: 84px; margin: auto; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
.warm-studio-brand { display: flex; align-items: center; gap: 10px; font-family: "Songti SC", serif; font-size: 21px; font-weight: 700; letter-spacing: .1em; }
.warm-studio-brand > span { display: grid; width: 34px; height: 34px; place-items: center; color: #fff9ed; background: var(--clay); border-radius: 50%; font-size: 15px; }
.warm-studio-brand small { color: var(--muted); font-family: Arial, sans-serif; font-size: 8px; font-weight: 400; }
.warm-studio-nav > p { display: flex; align-items: center; gap: 12px; margin: 0; color: var(--muted); font-size: 10px; letter-spacing: .1em; }
.warm-studio-nav > p i { width: 3px; height: 3px; background: var(--clay); border-radius: 50%; }
.warm-studio-back { display: flex; align-items: center; gap: 16px; color: var(--muted); font-size: 11px; }
.warm-studio-back span { display: grid; width: 28px; height: 28px; place-items: center; border: 1px solid var(--line); border-radius: 50%; color: var(--ink); font-size: 17px; }
.warm-studio-heading { display: flex; max-width: 1320px; margin: auto; align-items: end; justify-content: space-between; padding: 48px 0 36px; }
.warm-studio-heading p { margin: 0 0 10px; color: var(--clay); font-size: 9px; font-weight: 600; letter-spacing: .2em; }
.warm-studio-heading h1 { margin: 0; font-family: "Songti SC", serif; font-size: clamp(28px, 3vw, 40px); font-weight: 500; letter-spacing: -.03em; }
.warm-studio-heading > span { padding-bottom: 4px; color: var(--muted); font-size: 11px; }
.warm-workspace { display: grid; max-width: 1320px; margin: auto; grid-template-columns: minmax(360px, .82fr) minmax(480px, 1.18fr); border: 1px solid var(--line); background: rgb(255 253 248 / .45); }
.warm-composer { padding: 30px 34px 26px; border-right: 1px solid var(--line); }
.warm-form-head { display: flex; align-items: center; margin-bottom: 26px; }
.warm-form-head > span, .warm-options legend > span { margin-right: 10px; color: var(--clay); font-family: Georgia, serif; font-size: 12px; font-style: italic; }
.warm-form-head h2 { margin: 0; font-family: "Songti SC", serif; font-size: 19px; font-weight: 600; }
.warm-form-head small { margin-left: auto; color: var(--muted); font-size: 8px; letter-spacing: .15em; }
.warm-label { display: block; margin-bottom: 8px; color: var(--muted); font-size: 11px; }
.warm-textarea { position: relative; overflow: hidden; border: 1px solid var(--line); border-radius: 3px; background: #fffdf8; transition: border-color .2s, box-shadow .2s; }
.warm-textarea:focus-within { border-color: var(--clay); box-shadow: 0 0 0 3px rgb(154 95 67 / .1); }
.warm-textarea textarea { display: block; width: 100%; min-height: 128px; padding: 16px 16px 30px; resize: vertical; color: var(--ink); background: transparent; border: 0; outline: 0; font-size: 13px; line-height: 1.9; box-sizing: border-box; }
.warm-textarea textarea::placeholder { color: #aaa095; }
.warm-textarea > span { position: absolute; right: 12px; bottom: 8px; color: var(--muted); font-size: 9px; }
.warm-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 10px; }
.warm-chips button { padding: 5px 9px; color: var(--muted); background: transparent; border: 1px solid var(--line); border-radius: 99px; font-size: 10px; cursor: pointer; }
.warm-chips button:hover { color: var(--clay); border-color: var(--clay); }
.warm-options, .warm-ratio-field { margin: 28px 0 0; padding: 0; border: 0; }
.warm-options legend { display: flex; align-items: center; margin-bottom: 12px; font-family: "Songti SC", serif; font-size: 15px; font-weight: 600; }
.warm-style-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.warm-style-grid button { position: relative; padding: 6px 6px 10px; color: var(--muted); background: transparent; border: 1px solid var(--line); border-radius: 3px; cursor: pointer; font-size: 10px; }
.warm-style-grid button.selected { color: var(--ink); border-color: var(--clay); }
.warm-style-grid button > i { display: block; height: 42px; margin-bottom: 8px; background: #d9c7ad; }
.warm-style-grid button > .warm-swatch-奶油侘寂 { background: #e8e1d5; }
.warm-style-grid button > .warm-swatch-现代简约 { background: #c8c8c1; }
.warm-style-grid button b { position: absolute; top: 10px; right: 10px; display: none; width: 16px; height: 16px; place-items: center; color: #fff; background: var(--clay); border-radius: 50%; font-size: 9px; }
.warm-style-grid button.selected b { display: grid; }
.warm-ratio-field { display: flex; align-items: center; justify-content: space-between; }
.warm-ratio-field legend { float: left; color: var(--muted); font-size: 11px; }
.warm-ratios { display: flex; gap: 5px; }
.warm-ratios button { display: flex; height: 34px; align-items: center; gap: 6px; padding: 0 9px; color: var(--muted); background: transparent; border: 1px solid var(--line); border-radius: 3px; font-size: 9px; cursor: pointer; }
.warm-ratios button.selected { color: var(--clay); border-color: var(--clay); background: rgb(154 95 67 / .05); }
.warm-ratios i { display: block; width: 13px; max-height: 15px; border: 1px solid currentColor; }
.warm-generate { display: flex; width: 100%; align-items: center; justify-content: space-between; margin-top: 28px; padding: 14px 18px; color: #fffaf0; background: var(--clay); border: 0; border-radius: 3px; font-size: 13px; cursor: pointer; }
.warm-generate:hover:not(:disabled) { background: #7d4932; }
.warm-generate:disabled { cursor: not-allowed; opacity: .5; }
.warm-generate b { font-size: 18px; font-weight: 400; }
.warm-demo-note { margin: 9px 0 0; color: var(--muted); font-size: 9px; text-align: center; }
.warm-preview-area { display: flex; min-width: 0; flex-direction: column; padding: 30px; background: #ebe3d6; }
.warm-preview-head, .warm-preview-foot { display: flex; align-items: center; justify-content: space-between; color: var(--muted); font-size: 8px; letter-spacing: .15em; }
.warm-preview-head { margin-bottom: 12px; }
.warm-preview-head span:last-child { display: flex; align-items: center; gap: 6px; }
.warm-preview-head i { width: 4px; height: 4px; background: var(--clay); border-radius: 50%; }
.warm-preview { position: relative; width: 100%; max-height: 610px; margin: 0; overflow: hidden; background: #d5c8b5; transition: aspect-ratio .3s; }
.warm-preview.portrait { width: min(68%, 410px); align-self: center; }
.warm-preview.square { width: min(86%, 520px); align-self: center; }
.warm-preview > img { width: 100%; height: 100%; object-fit: cover; }
.warm-preview-shade { position: absolute; inset: 0; background: linear-gradient(transparent 50%, rgb(34 26 19 / .7)); }
.warm-preview-badge { position: absolute; top: 14px; left: 14px; padding: 5px 9px; color: var(--ink); background: rgb(255 250 240 / .9); font-size: 9px; }
.warm-preview figcaption { position: absolute; right: 20px; bottom: 18px; left: 20px; color: #fff; }
.warm-preview figcaption p { display: -webkit-box; margin: 0 0 10px; overflow: hidden; font-family: "Songti SC", serif; font-size: 15px; line-height: 1.6; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.warm-preview figcaption > div { display: flex; align-items: center; gap: 8px; font-size: 7px; letter-spacing: .12em; opacity: .75; }
.warm-preview figcaption i { width: 2px; height: 2px; background: #fff; border-radius: 50%; }
.warm-preview-foot { margin-top: 10px; }
.warm-preview-tip { display: flex; gap: 16px; margin-top: auto; padding-top: 24px; }
.warm-preview-tip > span { flex-shrink: 0; color: var(--clay); font-size: 10px; }
.warm-preview-tip p { margin: 0; color: var(--muted); font-size: 10px; line-height: 1.8; }
.warm-loading { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; color: var(--ink); background: rgb(244 239 230 / .9); backdrop-filter: blur(6px); }
.warm-loader { width: 34px; height: 34px; margin-bottom: 18px; border: 1px solid rgb(154 95 67 / .2); border-top-color: var(--clay); border-radius: 50%; animation: warm-spin .8s linear infinite; }
.warm-loading strong { font-family: "Songti SC", serif; font-size: 16px; font-weight: 500; }
.warm-loading small { margin-top: 6px; color: var(--muted); font-size: 10px; }
@keyframes warm-spin { to { transform: rotate(360deg); } }
@media (max-width: 980px) {
  .warm-workspace { grid-template-columns: minmax(330px, .9fr) 1.1fr; }
  .warm-composer { padding: 26px 24px; }
  .warm-preview-area { padding: 24px; }
}
@media (max-width: 760px) {
  .warm-studio { padding: 0 18px 96px; }
  .warm-studio-nav { height: 72px; }
  .warm-studio-nav > p { display: none; }
  .warm-studio-heading { display: block; padding: 38px 0 26px; }
  .warm-studio-heading > span { display: block; margin-top: 12px; }
  .warm-workspace { display: flex; flex-direction: column; border: 0; background: transparent; }
  .warm-composer { padding: 22px 0 30px; border: 0; }
  .warm-preview-area { padding: 20px; }
  .warm-preview { min-height: 300px; }
  .warm-preview-tip { display: none; }
}
@media (max-width: 390px) {
  .warm-style-grid { gap: 5px; }
  .warm-ratio-field { align-items: flex-start; gap: 12px; }
  .warm-ratios button { padding: 0 7px; }
}
</style>
