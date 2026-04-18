export type ProjectDetail = {
  overview: string
  techStack: string
  responsibilities: string
  results: string
}

export const projectTagsMap: string[][] = [
  ['Vue3', 'Element Plus', '管理系统'],
  ['React', 'Hooks', '响应式布局'],
  ['Vue.js', 'Node.js', '博客平台']
]

export const projectDetails: ProjectDetail[] = [
  {
    overview: `全栈前端开发工程师，专注中后台系统建设，熟练掌握 Vue3 生态与工程化实践。
熟悉 Element Plus 组件库，具备良好的 UI 交互设计与性能优化能力。
注重代码可维护性与团队协作规范，能独立完成需求分析、开发与交付。`,
    techStack: `核心框架：Vue3、Pinia（状态管理）
UI 库：Element Plus（表单、表格、弹窗等组件深度定制）
构建工具：Vite（快速构建与热更新）、ESLint + Prettier（代码规范）
其他：Axios（封装统一请求拦截/错误处理）、Vue Router（动态路由 + 权限路由）、WebSocket（实时数据推送可选）
辅助工具：Git、VS Code、Postman、Chrome DevTools 性能分析`,
    responsibilities: `主导商城后台核心模块（商品管理、订单管理、用户管理、数据统计）的页面与组件开发；
设计并实现基于角色的权限控制系统（RBAC），通过动态路由 + 指令权限控制（如 v-permission）保障操作边界安全；
采用 Composition API 重构业务逻辑，提升组件复用性与可测试性；
推动性能优化：虚拟滚动（长列表）、懒加载、防抖节流、计算属性缓存、减少不必要的响应式依赖。`,
    results: `完成 15+ 核心功能页面开发，支持日均 2000+ 后台操作，系统响应时间平均降低 40%；
实现细粒度权限控制，覆盖 8 类角色、30+ 操作权限点，零越权访问事故；
商品管理页支持批量导入/导出、SKU 多规格编辑，操作效率提升 60%；
数据统计模块集成 ECharts 可视化图表，支持按日/周/月维度动态切换，支撑运营决策；`
  },
  {
    overview: `前端开发工程师，专注 React 生态与用户体验驱动的 Web 应用开发；
熟悉 Airbnb 类平台核心交互逻辑（房源展示、筛选排序、预订流程），具备产品思维；
擅长构建高性能、高可用的响应式前端系统，注重可访问性与跨端一致性。`,
    techStack: `核心框架：React 18（函数组件 + Hooks）、React Router v6（路由守卫与动态加载）
状态管理：Context API + useReducer / 自定义 Hook 封装（轻量级状态流，避免过度依赖 Redux）
UI 与布局：Tailwind CSS（原子化样式 + 响应式断点）、Framer Motion（交互动画）
性能优化：React.memo / useMemo / useCallback、代码分割（lazy + Suspense）、图片懒加载（loading="lazy"）
工具链：Vite（极速构建）、ESLint + Prettier、Jest + React Testing Library（单元测试）`,
    responsibilities: `主导房源列表页、详情页、搜索筛选页等核心模块开发，实现基于地理位置、价格、房型等多维度筛选；
使用 Context API 构建全局状态（如用户登录态、筛选条件、收藏状态），确保跨组件数据一致性；
设计并实现全响应式布局：适配手机（320px+）、平板、桌面端，采用移动优先策略 + Flex/Grid + Tailwind 断点；
优化首屏加载性能：骨架屏 + 预加载关键资源 + 图片 WebP 格式转换，LCP 降低至 1.8s 内；
提升交互流畅度：滚动节流防抖、虚拟列表（长房源列表）、过渡动画平滑衔接。`,
    results: `实现 95%+ 页面在移动端触控友好（点击热区 ≥ 44×44px，手势操作支持滑动切换图片）；
首屏加载时间从 4.2s 优化至 1.6s（提升 62%），Google Lighthouse 性能评分达 92+；
房源搜索筛选响应时间 ≤ 300ms（后端接口联调 + 前端缓存策略），用户筛选流失率下降 35%；`
  },
  {
    overview: `全栈开发实践者，具备从前端交互到后端服务、部署运维的完整项目闭环能力；
熟悉内容型平台（如博客、资讯站）的核心业务逻辑与用户体验设计；
注重代码质量与系统稳定性，追求简洁、可维护、易扩展的技术方案。`,
    techStack: `前端：Vue 3、Vue Router、Vuex / Pinia、Axios、Element UI / Ant Design Vue
数据库：MongoDB（文档存储，适配文章结构）或 MySQL（关系型，支持分类/标签关联）`,
    responsibilities: `开发前台核心页面：首页（文章列表+分页）、文章详情页（富文本渲染）、分类/标签归档页、搜索页；
实现后台管理系统：支持文章增删改查、分类管理、用户权限控制（管理员/编辑角色）、Markdown 编辑器集成；`,
    results: `前台首屏加载时间优化至 1.4s（图片懒加载 + 关键 CSS 内联 + 静态资源 CDN 加速）；`
  }
]

export const emptyProjectDetail: ProjectDetail = {
  overview: '待填写',
  techStack: '待填写',
  responsibilities: '待填写',
  results: '待填写'
}
