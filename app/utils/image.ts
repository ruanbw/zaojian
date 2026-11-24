export const MAX_REFERENCE_SIZE = 12 * 1024 * 1024
const COMPRESS_MAX_EDGE = 640
const WEBP_QUALITY = 0.78

interface DecodedImage {
  drawable: CanvasImageSource
  width: number
  height: number
  dispose: () => void
}

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
  return decode(file).then(({ drawable, width, height, dispose }) => {
    const scale = Math.min(1, COMPRESS_MAX_EDGE / Math.max(width, height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))

    const context = canvas.getContext('2d')
    if (!context) {
      dispose()
      throw new Error('浏览器不支持 Canvas 2D')
    }
    context.drawImage(drawable, 0, 0, canvas.width, canvas.height)
    dispose()
    return canvas.toDataURL('image/webp', WEBP_QUALITY)
  })
}

async function decode(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === 'function') {
    try {
      // from-image：按 EXIF 方向摆正，手机竖拍照片不会被旋转 90°
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
      return {
        drawable: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        dispose: () => bitmap.close(),
      }
    }
    catch {
      // 浏览器不支持该选项或格式，走 <img> 解码
    }
  }
  return decodeWithElement(file)
}

function decodeWithElement(file: File): Promise<DecodedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read failed'))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('decode failed'))
      image.onload = () => resolve({
        drawable: image,
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
        dispose: () => {},
      })
      image.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
