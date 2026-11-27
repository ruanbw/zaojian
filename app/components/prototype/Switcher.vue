<script setup lang="ts">
import type { PrototypeId } from '@/constants/prototypes'
import { prototypeThemes } from '@/constants/prototypes'

defineOptions({ name: 'PrototypeSwitcher' })

const props = defineProps<{
  currentId: PrototypeId
  mode: 'home' | 'generate'
}>()

const route = useRoute()
const open = ref(false)
const currentTheme = computed(() => prototypeThemes.find(theme => theme.id === props.currentId)!)
watch(() => route.fullPath, () => { open.value = false })

function target(id: PrototypeId, mode: 'home' | 'generate') {
  return mode === 'home' ? `/prototypes/${id}` : `/prototypes/${id}/generate`
}
</script>

<template>
  <nav class="prototype-switcher" aria-label="原型版本切换">
    <NuxtLink class="switcher-all" to="/prototypes" aria-label="返回方案总览">
      全部方案
    </NuxtLink>
    <span class="switcher-divider" aria-hidden="true" />
    <div class="switcher-version-picker">
      <button class="switcher-current" type="button" :aria-expanded="open" aria-controls="prototype-version-menu" @click="open = !open">
        <b>{{ currentTheme.order }}</b><span>/ 20</span><i :class="{ open }" aria-hidden="true">⌃</i>
      </button>
      <div v-if="open" id="prototype-version-menu" class="switcher-versions" aria-label="选择设计版本">
        <p>选择原型 <span>A—T</span></p>
        <div>
          <NuxtLink
            v-for="theme in prototypeThemes"
            :key="theme.id"
            :to="target(theme.id, props.mode)"
            :class="{ active: props.currentId === theme.id }"
            :aria-label="`${theme.order} ${theme.name}`"
            :title="theme.name"
          >
            {{ theme.order }}
          </NuxtLink>
        </div>
        <strong>{{ currentTheme.name }}</strong>
      </div>
    </div>
    <span class="switcher-divider" aria-hidden="true" />
    <div class="switcher-modes" aria-label="选择页面">
      <NuxtLink :to="target(props.currentId, 'home')" :class="{ active: props.mode === 'home' }">
        首页
      </NuxtLink>
      <NuxtLink :to="target(props.currentId, 'generate')" :class="{ active: props.mode === 'generate' }">
        生成页
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.prototype-switcher {
  position: fixed;
  z-index: 100;
  bottom: max(18px, env(safe-area-inset-bottom));
  left: 50%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px;
  color: #f7f6f2;
  background: rgb(24 25 23 / 0.92);
  border: 1px solid rgb(255 255 255 / 0.15);
  border-radius: 999px;
  box-shadow: 0 12px 36px rgb(0 0 0 / 0.24);
  backdrop-filter: blur(18px);
  transform: translateX(-50%);
}

.prototype-switcher a {
  color: inherit;
  text-decoration: none;
}

.switcher-all {
  padding: 0 10px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0.72;
}

.switcher-divider {
  width: 1px;
  height: 20px;
  background: rgb(255 255 255 / 0.16);
}

.switcher-version-picker {
  position: relative;
}

.switcher-current {
  display: flex;
  height: 34px;
  align-items: center;
  gap: 5px;
  padding: 0 9px;
  color: #f7f6f2;
  background: transparent;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
}

.switcher-current b {
  font-size: 13px;
}

.switcher-current span {
  color: #aaa;
  font-size: 10px;
}

.switcher-current i {
  margin-left: 4px;
  color: #aaa;
  font-size: 12px;
  font-style: normal;
  transition: transform .2s;
}

.switcher-current i.open {
  transform: rotate(180deg);
}

.switcher-versions {
  position: absolute;
  bottom: 48px;
  left: 50%;
  width: 282px;
  padding: 15px;
  color: #f7f6f2;
  background: #20221e;
  border: 1px solid #494c45;
  border-radius: 18px;
  box-shadow: 0 16px 40px rgb(0 0 0 / .3);
  transform: translateX(-50%);
}

.switcher-versions > p {
  display: flex;
  justify-content: space-between;
  margin: 0 0 12px;
  color: #c8cbc3;
  font-size: 11px;
}

.switcher-versions > p span {
  color: #8e9388;
  font-size: 9px;
}

.switcher-versions > div {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.switcher-versions a {
  display: grid;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid #42463e;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  opacity: 0.65;
}

.switcher-versions > strong {
  display: block;
  margin-top: 12px;
  color: #aeb3a7;
  font-size: 10px;
  font-weight: 400;
  text-align: center;
}

.switcher-modes {
  display: flex;
  gap: 3px;
}

.switcher-modes a {
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0.58;
}

.switcher-versions a.active,
.switcher-modes a.active {
  color: #20211e;
  background: #f2f1ec;
  opacity: 1;
}

.switcher-versions a:hover,
.switcher-modes a:hover,
.switcher-all:hover {
  opacity: 1;
}

@media (max-width: 480px) {
  .prototype-switcher {
    bottom: max(10px, env(safe-area-inset-bottom));
    gap: 6px;
    padding: 6px;
  }

  .switcher-all {
    display: none;
  }

  .prototype-switcher > .switcher-divider:first-of-type {
    display: none;
  }

  .switcher-versions {
    position: fixed;
    bottom: 64px;
    left: 50%;
    width: min(282px, calc(100vw - 32px));
  }

  .switcher-versions a {
    width: auto;
    height: auto;
  }
}
</style>
