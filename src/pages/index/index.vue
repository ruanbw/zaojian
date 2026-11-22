<script setup lang="ts">
import { cases, SCENE_IMAGE } from '@/constants/content'

defineOptions({ name: 'IndexPage' })
definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '造间 · 案例灵感',
  },
})

function goGenerate() {
  uni.navigateTo({ url: '/pages/generate/index' })
}
</script>

<template>
  <div class="plaster" aria-hidden="true" />

  <main class="page">
    <header class="masthead">
      <span class="brand">造间</span>
      <span class="brand-note">空间灵感生成</span>
    </header>

    <section class="intro">
      <span class="ghost" aria-hidden="true">间</span>
      <h1>从喜欢的家<br>开始想象</h1>
      <p>先看看这些空间的样子，再写下属于你的那一间。</p>
    </section>

    <section class="cases" aria-label="案例展示">
      <article v-for="(item, index) in cases" :key="item.title" class="case">
        <img
          class="case-img"
          :class="`case-img--${index + 1}`"
          :src="SCENE_IMAGE"
          :alt="`示例效果图：${item.title}`"
        >
        <div class="case-body">
          <span class="tag">示例灵感</span>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </div>
      </article>
    </section>
  </main>

  <div class="dock">
    <button class="enter" @click="goGenerate">
      生成我的家
    </button>
  </div>
</template>

<style lang="scss">
.page {
  padding-bottom: 150px;
}

.cases {
  display: grid;
  gap: 28px;
}

.case-img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: #efe4d3;
}

.case-img--2 {
  object-position: 65% 50%;
  filter: sepia(0.14) saturate(0.92) brightness(1.02);
}

.case-img--3 {
  object-position: 35% 50%;
  filter: hue-rotate(-12deg) saturate(0.88) brightness(0.98);
}

.case-body {
  padding: 12px 2px 0;
}

.case h2 {
  margin: 8px 0 4px;
  font-family: var(--serif);
  font-size: 19px;
  font-weight: 600;
}

.case p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
}

.dock {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  padding: 28px 24px calc(18px + env(safe-area-inset-bottom));
  background: linear-gradient(to top, var(--plaster) 42%, rgb(244 237 225 / 0%));
  pointer-events: none;
}

.enter {
  display: grid;
  place-items: center;
  width: min(100%, 392px);
  min-height: 56px;
  border: 0;
  border-radius: 16px;
  background: var(--clay);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 16%),
    0 8px 22px -14px rgb(99 61 38 / 70%);
  color: #fff9f1;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.08em;
  pointer-events: auto;
  transition:
    background 0.2s,
    transform 0.12s;
}

.enter:hover {
  background: var(--clay-deep);
}

.enter:active {
  transform: translateY(1px);
}
</style>
