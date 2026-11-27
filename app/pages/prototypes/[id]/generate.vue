<script setup lang="ts">
import { getExtendedPrototypeTheme, getPrototypeTheme, isExtendedPrototypeId, isPrototypeId } from '@/constants/prototypes'

defineOptions({ name: 'PrototypeGeneratePage' })

const route = useRoute()
const id = route.params.id
if (!isPrototypeId(id)) {
  throw createError({ statusCode: 404, statusMessage: 'Prototype not found' })
}
const theme = getPrototypeTheme(id)
const extendedTheme = isExtendedPrototypeId(id) ? getExtendedPrototypeTheme(id) : null
useHead({ title: `${theme.order} ${theme.name} · 生成页原型` })
</script>

<template>
  <PrototypeWarmGenerate v-if="id === 'warm'" />
  <PrototypeGalleryGenerate v-else-if="id === 'gallery'" />
  <PrototypeNoirGenerate v-else-if="id === 'noir'" />
  <PrototypeFlexibleGenerate v-else-if="extendedTheme" :key="id" :theme="extendedTheme" />
  <PrototypeSwitcher :current-id="id" mode="generate" />
</template>
