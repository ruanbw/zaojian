export const SCENE_IMAGE = '/static/images/scene.svg'
export const API_BASE = 'http://localhost:3001'

export interface CaseItem {
  title: string
  description: string
}

export const cases: CaseItem[] = [
  {
    title: '午后客厅',
    description: '朝南的客厅，原木家具，米白墙面，午后的光落在地板上。',
  },
  {
    title: '柔光客厅',
    description: '原木日式客厅，低矮沙发，亚麻窗帘，午后柔光。',
  },
  {
    title: '暖木客厅',
    description: '暖色调客厅，浅陶土墙面，藤编灯与绿植，黄昏光线。',
  },
]

export const promptChips = [
  { label: '原木日式', prompt: '原木日式客厅，低矮沙发，亚麻窗帘，午后柔光' },
  { label: '侘寂卧室', prompt: '米白侘寂风卧室，弧形墙面，藤编灯，清晨的光' },
  { label: '温暖书房', prompt: '小户型书房，整墙书柜，暖黄台灯，绿植' },
]
