<script setup lang="ts">
import { getExtendedPrototypeTheme, getPrototypeTheme, isExtendedPrototypeId, isPrototypeId } from '@/constants/prototypes'

defineOptions({ name: 'PrototypeHomePage' })

const route = useRoute()
const id = route.params.id
if (!isPrototypeId(id)) {
  throw createError({ statusCode: 404, statusMessage: 'Prototype not found' })
}
const theme = getPrototypeTheme(id)
const extendedTheme = isExtendedPrototypeId(id) ? getExtendedPrototypeTheme(id) : null
useHead({ title: `${theme.order} ${theme.name} · 首页原型` })
</script>

<template>
  <PrototypeWarmHome v-if="id === 'warm'" />
  <PrototypeGalleryHome v-else-if="id === 'gallery'" />
  <PrototypeNoirHome v-else-if="id === 'noir'" />
  <PrototypeFlexibleHome v-else-if="extendedTheme" :key="id" :theme="extendedTheme" />
  <PrototypeSwitcher :current-id="id" mode="home" />
</template>
