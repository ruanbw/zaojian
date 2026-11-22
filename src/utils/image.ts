export const MAX_REFERENCE_SIZE = 12 * 1024 * 1024
const COMPRESS_MAX_EDGE = 640

export function chooseReferenceFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      resolve(input.files?.[0] ?? null)
      input.value = ''
    }
    input.click()
  })
}

export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read failed'))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('decode failed'))
      image.onload = () => {
        const scale = Math.min(1, COMPRESS_MAX_EDGE / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(image.width * scale)
        canvas.height = Math.round(image.height * scale)
        canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/webp', 0.78))
      }
      image.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
