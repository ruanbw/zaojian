<script setup lang="ts">
import type { ExtendedPrototypeTheme } from '@/constants/prototypes'

defineOptions({ name: 'PrototypeFlexibleGenerate' })

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

const studio = usePrototypeStudio({
  id: props.theme.id,
  initialPrompt: props.theme.prompt,
  initialImage: props.theme.image,
  resultImage: props.theme.resultImage,
})
const {
  prompt, promptCount, selectedStyle, selectedRatio, isGenerating, hasResult,
  previewImage, canGenerate, appendPrompt, generatePreview,
} = studio
selectedStyle.value = props.theme.styles[0]
selectedRatio.value = props.theme.layout === 'poster' || props.theme.layout === 'grid' ? '16:9' : '4:3'
const ratios = ['16:9', '4:3', '1:1', '3:4']
</script>

<template>
  <main
    class="x-studio"
    :class="[`x-${theme.layout}`, { 'x-dark': theme.mode === 'dark' }]"
    :style="themeStyles"
  >
    <header class="x-studio-nav">
      <NuxtLink :to="`/prototypes/${theme.id}`" class="x-studio-brand"><span>{{ theme.order }}</span>造间 <small>{{ theme.english }}</small></NuxtLink>
      <p><i /> SPACE ENGINE / PROTOTYPE MODE</p>
      <NuxtLink :to="`/prototypes/${theme.id}`" class="x-studio-back">退出创作室 <b>×</b></NuxtLink>
    </header>

    <section class="x-studio-heading">
      <div><p>CREATE / DIRECTION {{ theme.order }}</p><h1>{{ theme.name }}<span>创作室</span></h1></div>
      <ol><li class="active">01 描述</li><li class="active">02 设定</li><li>03 生成</li></ol>
    </section>

    <div class="x-workspace">
      <form class="x-composer" @submit.prevent="generatePreview">
        <div class="x-panel-head"><span>01 / DESCRIBE</span><small>自然语言输入</small></div>
        <label :for="`x-prompt-${theme.id}`">你想生活在怎样的空间里？</label>
        <div class="x-prompt-box">
          <textarea :id="`x-prompt-${theme.id}`" v-model="prompt" maxlength="120" rows="6" placeholder="写下空间、风格、材质和光线……" />
          <span>PROMPT <b>{{ promptCount }} / 120</b></span>
        </div>
        <div class="x-keywords"><button v-for="keyword in theme.keywords" :key="keyword" type="button" @click="appendPrompt(keyword)">+ {{ keyword }}</button></div>

        <div class="x-panel-head x-direction"><span>02 / DIRECTION</span><small>设定视觉方向</small></div>
        <fieldset class="x-styles">
          <legend>风格</legend>
          <div><button v-for="(style, index) in theme.styles" :key="style" type="button" :class="{ selected: selectedStyle === style }" @click="selectedStyle = style"><small>0{{ index + 1 }}</small>{{ style }}<i /></button></div>
        </fieldset>
        <fieldset class="x-ratios">
          <legend>画幅</legend>
          <div><button v-for="ratio in ratios" :key="ratio" type="button" :class="{ selected: selectedRatio === ratio }" @click="selectedRatio = ratio">{{ ratio }}</button></div>
        </fieldset>

        <button class="x-generate" type="submit" :disabled="!canGenerate"><span>{{ isGenerating ? '正在构建空间…' : hasResult ? '再生成一版' : '生成空间提案' }}</span><b>↗</b></button>
        <p class="x-demo-note">原型交互演示 · 不调用真实生成服务</p>
      </form>

      <section class="x-preview-panel" aria-label="空间生成预览">
        <div class="x-preview-head"><span>OUTPUT / {{ theme.order }}01</span><span><i /> {{ isGenerating ? 'RENDERING' : hasResult ? 'COMPLETE' : 'REFERENCE' }}</span></div>
        <div class="x-canvas">
          <span class="x-canvas-corner top-left" /><span class="x-canvas-corner bottom-right" />
          <figure
            class="x-output"
            :class="{ portrait: selectedRatio === '3:4', square: selectedRatio === '1:1' }"
            :style="{ aspectRatio: selectedRatio.replace(':', ' / ') }"
            aria-live="polite"
          >
            <img :src="previewImage" :alt="hasResult ? '根据描述生成的原型演示结果' : `${theme.name}空间参考效果`">
            <div class="x-output-shade" />
            <span class="x-output-badge">{{ hasResult ? 'GENERATED / DEMO' : 'REFERENCE / DEMO' }}</span>
            <figcaption><p>{{ prompt }}</p><div><span>{{ selectedStyle }}</span><span>{{ selectedRatio }}</span><span>AI CONCEPT</span></div></figcaption>
            <div v-if="isGenerating" class="x-loading"><span aria-hidden="true" /><strong>正在生成空间</strong><small>LIGHT · MATERIAL · ATMOSPHERE</small></div>
          </figure>
        </div>
        <div class="x-preview-foot"><span>{{ theme.english }}</span><span>01 / 01</span></div>
      </section>
    </div>
    <footer class="x-studio-footer"><span>造间 / {{ theme.name }}</span><span>DESIGN PROTOTYPE {{ theme.order }} / 20</span></footer>
  </main>
</template>

<style scoped>
.x-studio { min-height: 100vh; padding: 0 3vw 110px; color: var(--x-ink); background: var(--x-surface); font-family: var(--x-font); }
.x-studio :global(a) { color: inherit; text-decoration: none; }
.x-studio-nav { display: flex; max-width: 1500px; height: 80px; margin: auto; align-items: center; justify-content: space-between; border-bottom: 1px solid color-mix(in srgb, var(--x-ink) 25%, transparent); }
.x-studio-brand { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 700; }
.x-studio-brand > span { display: grid; width: 34px; height: 34px; place-items: center; color: var(--x-accent-ink); background: var(--x-accent); border-radius: var(--x-radius); font-size: 11px; }
.x-studio-brand small { max-width: 200px; color: var(--x-muted); font-family: Arial, sans-serif; font-size: 7px; font-weight: 400; letter-spacing: .14em; }
.x-studio-nav > p { display: flex; align-items: center; gap: 7px; color: var(--x-muted); font-family: Arial, sans-serif; font-size: 8px; letter-spacing: .14em; }
.x-studio-nav > p i { width: 4px; height: 4px; background: var(--x-accent); border-radius: 50%; }
.x-studio-back { display: flex; align-items: center; gap: 14px; color: var(--x-muted); font-size: 10px; }
.x-studio-back b { display: grid; width: 28px; height: 28px; place-items: center; color: var(--x-ink); border: 1px solid color-mix(in srgb, var(--x-ink) 25%, transparent); border-radius: var(--x-radius); font-size: 16px; font-weight: 400; }
.x-studio-heading { display: flex; max-width: 1500px; margin: auto; align-items: end; justify-content: space-between; padding: 38px 0 28px; }
.x-studio-heading p { margin: 0 0 8px; color: var(--x-accent); font-family: Arial, sans-serif; font-size: 8px; letter-spacing: .18em; }
.x-studio-heading h1 { margin: 0; font-size: clamp(30px, 3.6vw, 48px); font-weight: 600; letter-spacing: -.055em; }
.x-studio-heading h1 span { margin-left: 10px; color: var(--x-muted); font-size: .48em; font-weight: 400; letter-spacing: 0; }
.x-studio-heading ol { display: flex; gap: 20px; margin: 0; padding: 0 0 5px; color: var(--x-muted); list-style: none; font-family: Arial, "PingFang SC", sans-serif; font-size: 9px; }
.x-studio-heading li.active { color: var(--x-ink); }
.x-workspace { display: grid; max-width: 1500px; min-height: 680px; margin: auto; grid-template-columns: minmax(350px, 420px) 1fr; border: 1px solid color-mix(in srgb, var(--x-ink) 40%, transparent); border-radius: var(--x-radius); overflow: hidden; }
.x-composer { display: flex; flex-direction: column; padding: 26px; border-right: 1px solid color-mix(in srgb, var(--x-ink) 30%, transparent); background: color-mix(in srgb, var(--x-surface) 94%, var(--x-ink)); }
.x-panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.x-panel-head > span { color: var(--x-accent); font-family: Arial, sans-serif; font-size: 8px; letter-spacing: .16em; }
.x-panel-head > small { color: var(--x-muted); font-size: 9px; }
.x-composer > label { margin-bottom: 9px; font-size: 11px; }
.x-prompt-box { border: 1px solid color-mix(in srgb, var(--x-ink) 28%, transparent); border-radius: var(--x-radius); background: color-mix(in srgb, var(--x-surface) 85%, #ffffff); }
.x-prompt-box:focus-within { border-color: var(--x-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--x-accent) 12%, transparent); }
.x-prompt-box textarea { display: block; width: 100%; min-height: 140px; padding: 15px; resize: vertical; color: var(--x-ink); background: transparent; border: 0; outline: 0; font-family: var(--x-font); font-size: 13px; line-height: 1.85; box-sizing: border-box; }
.x-prompt-box textarea::placeholder { color: var(--x-muted); }
.x-prompt-box > span { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; color: var(--x-muted); border-top: 1px solid color-mix(in srgb, var(--x-ink) 15%, transparent); font-family: Arial, sans-serif; font-size: 7px; letter-spacing: .12em; }
.x-prompt-box b { font-weight: 400; }
.x-keywords { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
.x-keywords button { padding: 5px 8px; color: var(--x-muted); background: transparent; border: 1px solid color-mix(in srgb, var(--x-ink) 22%, transparent); border-radius: var(--x-radius); font-size: 9px; cursor: pointer; }
.x-keywords button:hover { color: var(--x-accent); border-color: var(--x-accent); }
.x-direction { margin-top: 28px; padding-top: 20px; border-top: 1px solid color-mix(in srgb, var(--x-ink) 20%, transparent); }
.x-styles, .x-ratios { margin: 0; padding: 0; border: 0; }
.x-styles legend, .x-ratios legend { margin-bottom: 10px; color: var(--x-muted); font-size: 9px; }
.x-styles > div { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.x-styles button { display: flex; min-height: 64px; flex-direction: column; align-items: flex-start; justify-content: space-between; padding: 9px; color: var(--x-muted); background: transparent; border: 1px solid color-mix(in srgb, var(--x-ink) 23%, transparent); border-radius: var(--x-radius); font-family: var(--x-font); font-size: 10px; cursor: pointer; }
.x-styles button small { font-family: Arial, sans-serif; font-size: 7px; }
.x-styles button i { align-self: flex-end; width: 9px; height: 9px; border: 1px solid currentColor; border-radius: 50%; }
.x-styles button.selected { color: var(--x-accent); border-color: var(--x-accent); background: color-mix(in srgb, var(--x-accent) 7%, transparent); }
.x-styles button.selected i { background: var(--x-accent); }
.x-ratios { margin-top: 20px; }
.x-ratios > div { display: grid; grid-template-columns: repeat(4, 1fr); }
.x-ratios button { height: 32px; margin-left: -1px; color: var(--x-muted); background: transparent; border: 1px solid color-mix(in srgb, var(--x-ink) 23%, transparent); font-family: Arial, sans-serif; font-size: 9px; cursor: pointer; }
.x-ratios button:first-child { margin-left: 0; border-radius: var(--x-radius) 0 0 var(--x-radius); }
.x-ratios button:last-child { border-radius: 0 var(--x-radius) var(--x-radius) 0; }
.x-ratios button.selected { position: relative; z-index: 1; color: var(--x-accent-ink); background: var(--x-accent); border-color: var(--x-accent); }
.x-generate { display: flex; width: 100%; align-items: center; justify-content: space-between; margin-top: auto; padding: 13px 16px; color: var(--x-accent-ink); background: var(--x-accent); border: 0; border-radius: var(--x-radius); font-family: var(--x-font); font-size: 12px; font-weight: 600; cursor: pointer; }
.x-generate b { font-size: 17px; font-weight: 400; }
.x-generate:disabled { cursor: not-allowed; opacity: .45; }
.x-demo-note { margin: 9px 0 0; color: var(--x-muted); font-family: Arial, "PingFang SC", sans-serif; font-size: 8px; text-align: center; }
.x-preview-panel { display: flex; min-width: 0; flex-direction: column; background: color-mix(in srgb, var(--x-surface) 91%, var(--x-ink)); }
.x-preview-head, .x-preview-foot { display: flex; align-items: center; justify-content: space-between; padding: 15px 18px; color: var(--x-muted); font-family: Arial, sans-serif; font-size: 8px; letter-spacing: .12em; }
.x-preview-head { border-bottom: 1px solid color-mix(in srgb, var(--x-ink) 18%, transparent); }
.x-preview-head span:last-child { display: flex; align-items: center; gap: 6px; }
.x-preview-head i { width: 4px; height: 4px; background: var(--x-accent); border-radius: 50%; }
.x-canvas { position: relative; display: flex; min-height: 570px; flex: 1; align-items: center; justify-content: center; padding: 36px; overflow: hidden; }
.x-canvas-corner { position: absolute; width: 18px; height: 18px; border-color: var(--x-muted); border-style: solid; opacity: .6; }
.x-canvas-corner.top-left { top: 16px; left: 16px; border-width: 1px 0 0 1px; }
.x-canvas-corner.bottom-right { right: 16px; bottom: 16px; border-width: 0 1px 1px 0; }
.x-output { position: relative; width: 100%; max-height: 550px; margin: 0; overflow: hidden; border-radius: var(--x-radius); background: var(--x-muted); box-shadow: 0 16px 45px rgb(0 0 0 / .14); }
.x-output.portrait { width: min(48%, 330px); }
.x-output.square { width: min(76%, 530px); }
.x-output > img { width: 100%; height: 100%; object-fit: cover; }
.x-output-shade { position: absolute; inset: 0; background: linear-gradient(transparent 52%, rgb(8 10 8 / .76)); }
.x-output-badge { position: absolute; top: 12px; left: 12px; padding: 6px 8px; color: var(--x-accent-ink); background: var(--x-accent); border-radius: var(--x-radius); font-family: Arial, sans-serif; font-size: 7px; letter-spacing: .12em; }
.x-output figcaption { position: absolute; right: 18px; bottom: 15px; left: 18px; color: #fff; }
.x-output figcaption p { display: -webkit-box; margin: 0 0 10px; overflow: hidden; font-size: 12px; line-height: 1.7; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.x-output figcaption > div { display: flex; gap: 6px; }
.x-output figcaption span { padding: 4px 7px; border: 1px solid rgb(255 255 255 / .35); font-family: Arial, sans-serif; font-size: 7px; }
.x-preview-foot { border-top: 1px solid color-mix(in srgb, var(--x-ink) 18%, transparent); }
.x-loading { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; color: var(--x-ink); background: color-mix(in srgb, var(--x-surface) 88%, transparent); backdrop-filter: blur(5px); }
.x-loading > span { width: 34px; height: 34px; margin-bottom: 16px; border: 1px solid color-mix(in srgb, var(--x-accent) 25%, transparent); border-top-color: var(--x-accent); border-radius: 50%; animation: x-spin .8s linear infinite; }
.x-loading strong { font-size: 14px; font-weight: 500; }
.x-loading small { margin-top: 7px; color: var(--x-muted); font-family: Arial, sans-serif; font-size: 7px; letter-spacing: .12em; }
.x-studio-footer { display: flex; max-width: 1500px; margin: auto; justify-content: space-between; padding-top: 18px; color: var(--x-muted); font-family: Arial, "PingFang SC", sans-serif; font-size: 8px; letter-spacing: .12em; }
/* 网格方案将输出置于左侧，呈现工具台的反向工作流。 */
.x-grid .x-workspace { grid-template-columns: 1fr minmax(350px, 420px); box-shadow: 8px 8px 0 var(--x-accent); }
.x-grid .x-composer { order: 2; border-right: 0; border-left: 1px solid color-mix(in srgb, var(--x-ink) 30%, transparent); }
.x-grid .x-preview-panel { order: 1; }
.x-grid .x-canvas { background-image: linear-gradient(color-mix(in srgb, var(--x-ink) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--x-ink) 8%, transparent) 1px, transparent 1px); background-size: 48px 48px; }
/* 卡片方案把创作区和预览区作为两块柔软面板。 */
.x-cards .x-workspace { gap: 14px; border: 0; overflow: visible; background: transparent; }
.x-cards .x-composer, .x-cards .x-preview-panel { border: 1px solid color-mix(in srgb, var(--x-ink) 14%, transparent); border-radius: var(--x-radius); overflow: hidden; }
.x-cards .x-composer { background: color-mix(in srgb, #ffffff 52%, var(--x-surface)); }
/* 极简方案用分隔线而非厚重容器。 */
.x-minimal .x-workspace { border-right: 0; border-left: 0; border-radius: 0; }
.x-minimal .x-composer { background: transparent; }
.x-minimal .x-preview-panel { background: color-mix(in srgb, var(--x-ink) 4%, var(--x-surface)); }
/* 海报与奢华方案强调大预览。 */
.x-poster .x-workspace, .x-luxury .x-workspace { grid-template-columns: minmax(340px, 390px) 1fr; }
.x-poster .x-output > img { filter: saturate(.8) brightness(.85); }
.x-luxury .x-output { outline: 1px solid var(--x-accent); outline-offset: 7px; }
.x-luxury .x-composer { background: color-mix(in srgb, var(--x-surface) 96%, var(--x-accent)); }
.x-editorial .x-output { border-radius: 180px 180px var(--x-radius) var(--x-radius); }
@keyframes x-spin { to { transform: rotate(360deg); } }
@media (max-width: 1000px) {
  .x-workspace, .x-grid .x-workspace, .x-poster .x-workspace, .x-luxury .x-workspace { grid-template-columns: 350px 1fr; }
  .x-composer { padding: 22px; }
  .x-canvas { padding: 24px; }
}
@media (max-width: 760px) {
  .x-studio { padding: 0 15px 96px; }
  .x-studio-nav { height: 70px; }
  .x-studio-nav > p { display: none; }
  .x-studio-brand small { display: none; }
  .x-studio-heading { align-items: flex-start; flex-direction: column; gap: 18px; padding: 32px 0 24px; }
  .x-workspace, .x-grid .x-workspace, .x-poster .x-workspace, .x-luxury .x-workspace { display: flex; flex-direction: column; border: 0; border-radius: 0; overflow: visible; box-shadow: none; }
  .x-composer, .x-grid .x-composer { order: 1; padding: 22px 0 30px; border: 0; background: transparent; }
  .x-preview-panel, .x-grid .x-preview-panel { order: 2; border: 1px solid color-mix(in srgb, var(--x-ink) 24%, transparent); border-radius: var(--x-radius); overflow: hidden; }
  .x-canvas { min-height: 390px; padding: 24px; }
  .x-output.portrait { width: min(70%, 300px); }
  .x-studio-footer { gap: 20px; line-height: 1.7; }
}
</style>
