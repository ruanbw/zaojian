import type { PrototypeId } from '@/constants/prototypes'

interface PrototypeStudioOptions {
  id: PrototypeId
  initialPrompt: string
  initialImage: string
  resultImage: string
}

export function usePrototypeStudio(options: PrototypeStudioOptions) {
  const route = useRoute()
  const preset = typeof route.query.p === 'string' ? route.query.p.trim() : ''
  const prompt = ref(preset || options.initialPrompt)
  const selectedStyle = ref('自然原木')
  const selectedRatio = ref('4:3')
  const isGenerating = ref(false)
  const hasResult = ref(false)
  const resultImage = ref(options.resultImage)
  let timer: ReturnType<typeof setTimeout> | undefined

  const previewImage = computed(() => hasResult.value ? resultImage.value : options.initialImage)
  const canGenerate = computed(() => prompt.value.trim().length > 0 && !isGenerating.value)
  const promptCount = computed(() => prompt.value.length)

  function appendPrompt(value: string) {
    const current = prompt.value.trim()
    prompt.value = `${current ? `${current}，` : ''}${value}`.slice(0, 120)
    hasResult.value = false
  }

  function generatePreview() {
    if (!canGenerate.value)
      return

    isGenerating.value = true
    hasResult.value = false
    timer = setTimeout(() => {
      isGenerating.value = false
      hasResult.value = true
    }, 650)
  }

  watch(prompt, () => {
    if (hasResult.value)
      hasResult.value = false
  })

  onUnmounted(() => clearTimeout(timer))

  return {
    id: options.id,
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
  }
}
