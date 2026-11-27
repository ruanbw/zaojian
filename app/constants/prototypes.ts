const corePrototypeThemes = [
  {
    id: 'warm',
    order: 'A',
    name: '暖木杂志',
    english: 'WARM EDITORIAL',
    summary: '像翻阅一本生活方式杂志，在自然材质与柔和光影里找到灵感。',
    tags: ['陶土暖色', '衬线标题', '编辑式布局'],
    image: '/prototypes/warm-living.jpg',
    accent: '#9a5f43',
    surface: '#f3eee5',
  },
  {
    id: 'gallery',
    order: 'B',
    name: '白盒画廊',
    english: 'WHITE GALLERY',
    summary: '去掉多余装饰，用大尺度影像和清晰网格突出空间作品本身。',
    tags: ['黑白灰', '极简网格', '作品导向'],
    image: '/prototypes/gallery-living.jpg',
    accent: '#1d1d1b',
    surface: '#f4f4f1',
  },
  {
    id: 'noir',
    order: 'C',
    name: '暮光工作室',
    english: 'NOIR STUDIO',
    summary: '沉浸式暗色画布与高亮操作，让「输入—生成」更像专业创作工具。',
    tags: ['深色沉浸', '荧光点缀', '工具感'],
    image: '/prototypes/noir-living.jpg',
    accent: '#d7f99d',
    surface: '#151713',
  },
] as const

export const extendedPrototypeThemes = [
  {
    id: 'blueprint', order: 'D', name: '蓝图计划', english: 'LIVING BLUEPRINT',
    summary: '用清晰网格、标注与功能分区，把家的想象变成一份有序提案。',
    tags: ['建筑蓝调', '功能网格', '理性秩序'], image: '/prototypes/coastal.jpg', resultImage: '/prototypes/silver.jpg', secondaryImage: '/prototypes/gallery-detail.jpg',
    accent: '#f2c14e', accentInk: '#172c3c', surface: '#dce9ed', ink: '#17324a', muted: '#5f7684', mode: 'light', layout: 'grid', font: 'mono', radius: '0px',
    headline: '生活有计划，', accentLine: '空间有答案。', subline: '把风格之外的动线、功能与日常，也一起纳入想象。',
    prompt: '功能主义的通透客厅，清晰动线，模块化收纳，蓝灰色调与暖木细节',
    styles: ['功能主义', '理性极简', '现代包豪斯'], keywords: ['模块化收纳', '清晰动线', '冷暖对比'], scenes: ['秩序客厅', '功能厨房', '理性卧室'],
  },
  {
    id: 'mint', order: 'E', name: '薄荷居所', english: 'MINT SANCTUARY',
    summary: '轻盈薄荷绿与圆润界面，让空间创作像一次放松的呼吸。',
    tags: ['低饱和绿', '柔软圆角', '轻盈治愈'], image: '/prototypes/zen.jpg', resultImage: '/prototypes/noir-living.jpg', secondaryImage: '/prototypes/cloud.jpg',
    accent: '#ff8f70', accentInk: '#263b34', surface: '#e7f2ec', ink: '#25463a', muted: '#6f8a7e', mode: 'light', layout: 'cards', font: 'sans', radius: '28px',
    headline: '给日常，', accentLine: '一点轻盈。', subline: '用柔和颜色、植物和自然光，搭一间可以慢下来的家。',
    prompt: '薄荷绿与米白色客厅，圆润家具，柔软织物，大量绿植与清晨自然光',
    styles: ['治愈自然', '柔软极简', '清新北欧'], keywords: ['圆润家具', '绿色植物', '清晨柔光'], scenes: ['轻盈客厅', '绿意角落', '柔软卧室'],
  },
  {
    id: 'zen', order: 'F', name: '东方留白', english: 'EASTERN STILLNESS',
    summary: '以留白、木石和一束光，呈现安静而有呼吸感的东方空间。',
    tags: ['东方美学', '宋体排版', '克制留白'], image: '/prototypes/zen.jpg', resultImage: '/prototypes/cloud.jpg', secondaryImage: '/prototypes/warm-living.jpg',
    accent: '#a44632', accentInk: '#fffaf0', surface: '#f2efe6', ink: '#292923', muted: '#7c786b', mode: 'light', layout: 'minimal', font: 'serif', radius: '2px',
    headline: '少一分雕饰，', accentLine: '多一分心境。', subline: '从材质、光影与留白里，找到适合当代生活的东方表达。',
    prompt: '当代东方客厅，米白墙面，深色木格栅，亚麻沙发，留白与柔和侧光',
    styles: ['当代东方', '禅意极简', '自然侘寂'], keywords: ['木格栅', '手工陶器', '柔和侧光'], scenes: ['静心客厅', '茶室一角', '素净卧室'],
  },
  {
    id: 'bauhaus', order: 'G', name: '包豪斯', english: 'BAUHAUS LIVING',
    summary: '原色、几何和粗字体碰撞，把首页变成一张有态度的现代海报。',
    tags: ['原色碰撞', '几何构成', '海报排版'], image: '/prototypes/gallery-living.jpg', resultImage: '/prototypes/gallery-detail.jpg', secondaryImage: '/prototypes/noir-detail.jpg',
    accent: '#e84b35', accentInk: '#ffffff', surface: '#f1eee4', ink: '#171717', muted: '#6c6a63', mode: 'light', layout: 'grid', font: 'sans', radius: '0px',
    headline: '形式追随功能，', accentLine: '想象不必保守。', subline: '用鲜明色彩和几何秩序，创造不累赘也不无聊的空间。',
    prompt: '包豪斯风格客厅，红黄蓝原色点缀，几何家具，镀铬材质，功能主义布局',
    styles: ['经典包豪斯', '几何现代', '原色构成'], keywords: ['原色点缀', '几何家具', '镀铬材质'], scenes: ['构成客厅', '几何餐厨', '功能书房'],
  },
  {
    id: 'paris', order: 'H', name: '法式日常', english: 'PARISIAN QUOTIDIEN',
    summary: '酒红、奶油白与优雅衬线，让空间像一封来自巴黎的日常来信。',
    tags: ['法式优雅', '酒红点缀', '古典细节'], image: '/prototypes/paris.jpg', resultImage: '/prototypes/silver.jpg', secondaryImage: '/prototypes/deco.jpg',
    accent: '#8c3540', accentInk: '#fff8ef', surface: '#f4efe8', ink: '#402f2d', muted: '#8a7770', mode: 'light', layout: 'luxury', font: 'serif', radius: '4px',
    headline: '把浪漫，', accentLine: '过成日常。', subline: '不必繁复，一点线条、一件旧物，就能留住法式的松弛。',
    prompt: '轻法式公寓客厅，奶油色墙面，古典石膏线，酒红单椅，自然柔光',
    styles: ['轻法式', '巴黎公寓', '现代古典'], keywords: ['石膏线', '复古单椅', '黄铜细节'], scenes: ['浪漫客厅', '优雅浴室', '街景餐厅'],
  },
  {
    id: 'retreat', order: 'I', name: '森系野奢', english: 'ORGANIC RETREAT',
    summary: '深林绿与天然材质形成沉浸画布，像住进一间隐秘的山林居所。',
    tags: ['深林绿', '天然材质', '度假氛围'], image: '/prototypes/botanical.jpg', resultImage: '/prototypes/zen.jpg', secondaryImage: '/prototypes/warm-bedroom.jpg',
    accent: '#d6a85f', accentInk: '#1c281e', surface: '#17231b', ink: '#f2eee2', muted: '#a1ab9d', mode: 'dark', layout: 'poster', font: 'serif', radius: '6px',
    headline: '离开喧嚣，', accentLine: '住回自然。', subline: '让木材、石材与窗外绿意，成为空间里真正的主角。',
    prompt: '山林度假木屋客厅，深色原木，天然石材，壁炉，落地窗外的森林景观',
    styles: ['自然野奢', '山林木屋', '有机度假'], keywords: ['天然石材', '温暖壁炉', '森林景观'], scenes: ['林景客厅', '木屋餐厅', '自然庭院'],
  },
  {
    id: 'cyber', order: 'J', name: '霓虹未来', english: 'NEON HABITAT',
    summary: '高对比终端界面与荧光操作，呈现面向未来的空间实验体验。',
    tags: ['荧光青绿', '终端界面', '未来实验'], image: '/prototypes/noir-living.jpg', resultImage: '/prototypes/loft.jpg', secondaryImage: '/prototypes/silver.jpg',
    accent: '#71f6d2', accentInk: '#0d1715', surface: '#0d1117', ink: '#edf6f5', muted: '#829b9b', mode: 'dark', layout: 'grid', font: 'mono', radius: '0px',
    headline: '下一代居所，', accentLine: '现在开始渲染。', subline: '突破现实材质的边界，把光线、功能与想象重新编程。',
    prompt: '未来主义客厅，深色基底，青绿色线性灯光，金属材质，简洁科技家具',
    styles: ['未来极简', '科技住宅', '霓虹工业'], keywords: ['线性灯光', '液态金属', '智能家具'], scenes: ['未来客厅', '沉浸卧室', '科技卫浴'],
  },
  {
    id: 'mediterranean', order: 'K', name: '彩色地中海', english: 'MEDITERRANEAN DAYS',
    summary: '海蓝、陶土与拱门元素，带来明亮、松弛的假日居住感。',
    tags: ['海岸蓝', '陶土橙', '假日氛围'], image: '/prototypes/coastal.jpg', resultImage: '/prototypes/gallery-detail.jpg', secondaryImage: '/prototypes/warm-living.jpg',
    accent: '#e66f47', accentInk: '#fffaf0', surface: '#f7e8d0', ink: '#174c63', muted: '#798b8b', mode: 'light', layout: 'split', font: 'serif', radius: '20px',
    headline: '把海风，', accentLine: '留在家中。', subline: '明亮的白、日晒的陶土，还有永不着急的午后。',
    prompt: '地中海风格客厅，白色灰泥墙，陶土地砖，海蓝色织物，拱门与明亮日光',
    styles: ['地中海', '海岸度假', '南欧乡村'], keywords: ['白色灰泥', '陶土地砖', '拱形门洞'], scenes: ['海风客厅', '陶土餐厨', '假日露台'],
  },
  {
    id: 'japandi', order: 'L', name: '日式北欧', english: 'JAPANDI BALANCE',
    summary: '日式的克制与北欧的舒适叠加，用安静界面突出材质和功能。',
    tags: ['浅木色', '功能美学', '安静克制'], image: '/prototypes/cloud.jpg', resultImage: '/prototypes/warm-living.jpg', secondaryImage: '/prototypes/zen.jpg',
    accent: '#7c8b6a', accentInk: '#ffffff', surface: '#eeeae1', ink: '#35372f', muted: '#828276', mode: 'light', layout: 'minimal', font: 'sans', radius: '2px',
    headline: '刚刚好的家，', accentLine: '刚刚好的生活。', subline: '不追逐潮流，让每一件物品都有位置，也都有意义。',
    prompt: 'Japandi 客厅，浅橡木家具，米灰织物，纸质吊灯，简洁收纳与自然光',
    styles: ['Japandi', '日式极简', '温暖北欧'], keywords: ['浅橡木', '纸质吊灯', '隐藏收纳'], scenes: ['平衡客厅', '简洁餐厅', '安静书房'],
  },
  {
    id: 'loft', order: 'M', name: '工业 Loft', english: 'RAW LOFT CULTURE',
    summary: '混凝土灰、结构黑和施工橙，把粗犷材质转化为利落工具界面。',
    tags: ['混凝土灰', '结构线条', '施工橙'], image: '/prototypes/loft.jpg', resultImage: '/prototypes/deco.jpg', secondaryImage: '/prototypes/noir-detail.jpg',
    accent: '#e86237', accentInk: '#ffffff', surface: '#d8d5cf', ink: '#262626', muted: '#6f6d69', mode: 'light', layout: 'split', font: 'mono', radius: '0px',
    headline: '保留粗粝，', accentLine: '重塑日常。', subline: '看见结构的原本样子，也看见工业空间的舒适可能。',
    prompt: '工业 Loft 公寓，清水混凝土，黑色金属框架，皮革家具，温暖木材平衡',
    styles: ['工业 Loft', '都市复古', '粗野主义'], keywords: ['清水混凝土', '黑色金属', '复古皮革'], scenes: ['挑高客厅', '开放卧室', '工业书房'],
  },
  {
    id: 'cloud', order: 'N', name: '奶油云朵', english: 'SOFT CLOUD HOME',
    summary: '奶油色、柔焦图片和柔软圆角，营造轻松亲近的创作体验。',
    tags: ['奶油色', '柔焦影像', '亲和圆角'], image: '/prototypes/cloud.jpg', resultImage: '/prototypes/vintage.jpg', secondaryImage: '/prototypes/zen.jpg',
    accent: '#d7a1a6', accentInk: '#443536', surface: '#f6f0e8', ink: '#51463f', muted: '#96877d', mode: 'light', layout: 'cards', font: 'serif', radius: '32px',
    headline: '住进一朵，', accentLine: '柔软的云。', subline: '圆润家具、轻盈织物，让家成为最舒服的避风港。',
    prompt: '奶油色客厅，云朵沙发，圆润边角，柔软羊毛地毯，漫射自然光',
    styles: ['奶油风', '柔软极简', '温柔复古'], keywords: ['云朵沙发', '羊毛地毯', '漫射柔光'], scenes: ['云朵客厅', '奶油卧室', '柔软阅读角'],
  },
  {
    id: 'deco', order: 'O', name: '黑金装饰', english: 'MODERN ART DECO',
    summary: '黑金对比、对称布局与精致线条，呈现更具仪式感的空间提案。',
    tags: ['黑金配色', '装饰艺术', '对称仪式'], image: '/prototypes/deco.jpg', resultImage: '/prototypes/silver.jpg', secondaryImage: '/prototypes/loft.jpg',
    accent: '#c6a15b', accentInk: '#191813', surface: '#171713', ink: '#f3e9d2', muted: '#a69d88', mode: 'dark', layout: 'luxury', font: 'serif', radius: '0px',
    headline: '经典之上，', accentLine: '再造华丽。', subline: '以现代尺度重述装饰艺术，让精致保留分寸。',
    prompt: '现代 Art Deco 客厅，黑色墙面，黄铜线条，丝绒沙发，大理石与对称布局',
    styles: ['现代 Deco', '黑金轻奢', '新古典'], keywords: ['黄铜线条', '丝绒材质', '对称构图'], scenes: ['华丽客厅', '精致卫浴', '仪式餐厅'],
  },
  {
    id: 'nordic', order: 'P', name: '北欧晨光', english: 'NORDIC MORNING',
    summary: '雾蓝背景、明黄操作与清爽布局，像一束准确的晨光。',
    tags: ['清爽雾蓝', '明黄点缀', '实用主义'], image: '/prototypes/nordic.jpg', resultImage: '/prototypes/warm-living.jpg', secondaryImage: '/prototypes/gallery-living.jpg',
    accent: '#f2c94c', accentInk: '#263b43', surface: '#eaf1f3', ink: '#29434e', muted: '#748991', mode: 'light', layout: 'cards', font: 'sans', radius: '18px',
    headline: '让清晨，', accentLine: '决定家的颜色。', subline: '清爽、实用、明亮，把每一天的开始设计得更好。',
    prompt: '北欧晨光公寓，白与雾蓝色调，浅木家具，明黄色小件点缀，明亮自然光',
    styles: ['现代北欧', '清新实用', '色彩北欧'], keywords: ['浅木家具', '明黄点缀', '充足日光'], scenes: ['晨光厨房', '清爽客厅', '实用餐厅'],
  },
  {
    id: 'vintage', order: 'Q', name: '新复古', english: 'NEW VINTAGE SOUL',
    summary: '旧木、橄榄绿与焦糖色，以杂志化排版承接有故事的日常。',
    tags: ['焦糖棕', '复古家具', '故事感'], image: '/prototypes/vintage.jpg', resultImage: '/prototypes/warm-living.jpg', secondaryImage: '/prototypes/deco.jpg',
    accent: '#bc633f', accentInk: '#fff9ed', surface: '#eee4cf', ink: '#48352b', muted: '#887567', mode: 'light', layout: 'editorial', font: 'serif', radius: '8px',
    headline: '让旧时光，', accentLine: '长出新生活。', subline: '一件中古家具、一种熟悉颜色，足以让家有故事。',
    prompt: '新复古客厅，焦糖色皮革，橄榄绿墙面，中古木家具，黄铜台灯与旧地毯',
    styles: ['中古现代', '法式复古', '折衷复古'], keywords: ['中古家具', '焦糖皮革', '黄铜台灯'], scenes: ['故事客厅', '复古书房', '旧物餐厅'],
  },
  {
    id: 'silver', order: 'R', name: '银色实验', english: 'SILVER FUTURE LAB',
    summary: '冷银、石墨与精密网格，塑造像未来产品一样的空间工作台。',
    tags: ['冷银金属', '精密网格', '实验工具'], image: '/prototypes/silver.jpg', resultImage: '/prototypes/deco.jpg', secondaryImage: '/prototypes/loft.jpg',
    accent: '#b9c7d6', accentInk: '#17191b', surface: '#17191b', ink: '#eef0f2', muted: '#939ba3', mode: 'dark', layout: 'grid', font: 'mono', radius: '4px',
    headline: '减去温度，', accentLine: '放大精度。', subline: '用金属、玻璃和准确比例，探索更冷静的空间表达。',
    prompt: '未来银色公寓，拉丝金属，灰色石材，玻璃隔断，冷静精准的线条与灯光',
    styles: ['未来冷银', '精密极简', '现代工业'], keywords: ['拉丝金属', '玻璃隔断', '冷白光'], scenes: ['银色卫浴', '未来客厅', '精密厨房'],
  },
  {
    id: 'botanical', order: 'S', name: '植物秘境', english: 'BOTANICAL HIDEAWAY',
    summary: '浓密绿意与大幅场景影像，打造像温室一样鲜活的空间体验。',
    tags: ['浓密绿意', '鲜活自然', '沉浸影像'], image: '/prototypes/botanical.jpg', resultImage: '/prototypes/noir-living.jpg', secondaryImage: '/prototypes/zen.jpg',
    accent: '#b5d84f', accentInk: '#142016', surface: '#10241b', ink: '#eff3e8', muted: '#99aa9b', mode: 'dark', layout: 'poster', font: 'sans', radius: '12px',
    headline: '不止摆放绿植，', accentLine: '让生活长在自然里。', subline: '把日光、通风与植物一起设计，而不是最后的装饰。',
    prompt: '植物温室感客厅，大量热带植物，深绿色墙面，藤编家具，斑驳自然日光',
    styles: ['植物温室', '热带自然', '绿色波西米亚'], keywords: ['热带植物', '藤编家具', '斑驳日光'], scenes: ['温室客厅', '绿荫庭院', '植物阅读角'],
  },
  {
    id: 'eclectic', order: 'T', name: '折衷艺廊', english: 'ECLECTIC ART HOUSE',
    summary: '艺术海报式配色与自由网格，让不同年代和风格在一个家里共存。',
    tags: ['艺术配色', '自由混搭', '收藏感'], image: '/prototypes/vintage.jpg', resultImage: '/prototypes/cloud.jpg', secondaryImage: '/prototypes/gallery-detail.jpg',
    accent: '#ef6a67', accentInk: '#fffaf5', surface: '#f3e7dd', ink: '#3a2940', muted: '#8e7b86', mode: 'light', layout: 'editorial', font: 'serif', radius: '24px',
    headline: '不必统一，', accentLine: '喜欢就是风格。', subline: '把旅行、收藏和不同年代的喜欢，自由放进同一个空间。',
    prompt: '折衷艺术客厅，复古与现代家具混搭，珊瑚色点缀，艺术挂画和丰富收藏',
    styles: ['折衷主义', '艺术混搭', '收藏家风'], keywords: ['艺术挂画', '自由混搭', '珊瑚色点缀'], scenes: ['艺术客厅', '收藏书房', '混搭餐厅'],
  },
] as const

export const prototypeThemes = [...corePrototypeThemes, ...extendedPrototypeThemes] as const

export type PrototypeId = (typeof prototypeThemes)[number]['id']
export type ExtendedPrototypeId = (typeof extendedPrototypeThemes)[number]['id']
export type ExtendedPrototypeTheme = (typeof extendedPrototypeThemes)[number]

export function isExtendedPrototypeId(value: unknown): value is ExtendedPrototypeId {
  return typeof value === 'string' && extendedPrototypeThemes.some(theme => theme.id === value)
}

export function getExtendedPrototypeTheme(id: ExtendedPrototypeId) {
  return extendedPrototypeThemes.find(theme => theme.id === id)!
}

export function isPrototypeId(value: unknown): value is PrototypeId {
  return typeof value === 'string' && prototypeThemes.some(theme => theme.id === value)
}

export function getPrototypeTheme(id: PrototypeId) {
  return prototypeThemes.find(theme => theme.id === id)!
}

export const prototypeInspirations = [
  {
    title: '午后客厅',
    subtitle: '原木 · 米白 · 柔光',
    prompt: '朝南的客厅，原木家具，米白墙面，午后的光落在地板上',
  },
  {
    title: '静谧卧室',
    subtitle: '亚麻 · 弧形 · 自然',
    prompt: '安静的卧室，亚麻床品，浅木色地板，柔和晨光，少量绿植',
  },
  {
    title: '开放餐厨',
    subtitle: '石材 · 秩序 · 通透',
    prompt: '现代开放式餐厨，深灰石材，木质细节，大面积自然采光',
  },
] as const
