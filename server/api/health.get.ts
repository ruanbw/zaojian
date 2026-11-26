import { IMAGE_MODEL, isConfigured } from '../utils/gateway'

export default defineEventHandler(() => ({
  ok: isConfigured,
  models: isConfigured ? [IMAGE_MODEL] : [],
}))
