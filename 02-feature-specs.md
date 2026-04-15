# 功能模块清单

## （1）首页展示模块（HomeView）
- 响应式顶部导航栏（Logo + 首页/博客/简历链接，移动端汉堡菜单）
- 基本信息区：圆形头像、姓名、个人标语、社交链接（GitHub, Twitter）
- GitHub 活跃度卡片：显示 mock 数据（如“最近 30 天提交：120 次”）
- [待办] 粒子背景（后续用 tsParticles 实现）

## （2）博客文章模块
- 文章列表页（/blog）：
  - 从 `/public/posts/` 加载所有 .md 文件列表
  - 展示标题、日期、标签、摘要（前 100 字）
  - 标签筛选按钮（点击过滤）
- 文章详情页（/blog/:slug）：
  - 通过 `fetch(/posts/${slug}.md)` 获取内容
  - 用 marked + DOMPurify 渲染 Markdown
  - 代码块自动高亮（highlight.js）
  - “AI 总结”按钮：点击弹出对话框，显示 mock 摘要

## （3）个人简历模块（/resume）
- 两个版本切换：“简洁版” / “详细版”
- 使用 `<component :is="currentResume" />` 动态切换
- 每个版本是一个独立 Vue 组件（ResumeSimple.vue, ResumeDetailed.vue）
- 包含教育背景、工作经历、技能等 mock 内容

## 公共要求
- 路由 404 处理（友好提示 + 返回首页按钮）
- 移动端菜单适配（WindiCSS 响应式）
- 页面加载骨架屏（可选）
- SEO 基础 meta 标签（通过 router afterEach 设置 document.title）
- 暗色模式切换按钮（保存到 localStorage）