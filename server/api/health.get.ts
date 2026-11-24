import { DEFAULT_MODELS } from '../utils/gateway'

export default defineEventHandler(() => ({
  ok: true,
  models: DEFAULT_MODELS,
}))
