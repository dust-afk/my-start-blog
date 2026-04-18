export interface ProjectCard {
  year: number
  name: string
  stars: number
  description: string
  articleUrl?: string
  demoUrl?: string
  sourceUrl: string
}

export const projectCards: ProjectCard[] = [
  {
    year: 2026,
    name: 'Vue3实战商城后台',
    stars: 128,
    description: '基于Vue3的电商后台管理系统，集成商品管理、订单处理、数据统计等核心功能。',
    sourceUrl: 'https://github.com/dust/afk/vue3-commerce-admin'
  },
  {
    year: 2026,
    name: 'AI心理健康助手',
    stars: 203,
    description: 'AI驱动的心理健康支持平台，提供情绪分析、心理测评与个性化建议功能。',
    sourceUrl: 'https://github.com/dust/afk/ai-mental-health-assistant'
  },
  {
    year: 2025,
    name: '仿爱彼迎React项目',
    stars: 317,
    description: '高保真仿制Airbnb的React前端应用，重点实现房源搜索、地图展示与预订流程。',
    sourceUrl: 'https://github.com/dust/afk/react-airbnb-project'
  },
  {
    year: 2025,
    name: '个人博客项目',
    stars: 94,
    description: '个人技术博客平台，支持Markdown编辑、主题定制与响应式布局。',
    sourceUrl: 'https://github.com/dust/afk/personal-blog-project'
  },
  {
    year: 2024,
    name: '前端组件库',
    stars: 176,
    description: '可复用UI组件集合，为多个项目提供一致的设计语言与交互体验。',
    sourceUrl: 'https://github.com/dust/afk/component-library'
  },
  {
    year: 2023,
    name: '早期作品集',
    stars: 58,
    description: '初学阶段的作品集合，记录技术成长轨迹与项目重构历程。',
    sourceUrl: 'https://github.com/dust/afk/early-works'
  }

]
