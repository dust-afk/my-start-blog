# 项目约束与技术规范

## 技术栈
- 语言：TypeScript（启用 strict 模式）
- 框架：Vue 3（组合式 API，使用 `<script setup>` 语法）
- 样式：WindiCSS（通过 CDN 引入，不安装构建插件）
- 构建工具：Vite（零配置，仅用于开发服务器和打包）
- 路由：Vue Router 4（必须使用）
- Markdown 渲染：marked + DOMPurify（运行时解析）
- 代码高亮：highlight.js（CDN 引入）

## 路由规范（Vue Router 4）
- 使用 `createRouter` + `createWebHistory`
- 路由定义文件：`/src/router/index.ts`
- 页面组件放在 `/src/views/`：
  - `HomeView.vue` → 路径 `/`
  - `BlogView.vue` → 路径 `/blog`
  - `ArticleView.vue` → 路径 `/blog/:slug`（动态路由）
  - `ResumeView.vue` → 路径 `/resume`
  - `NotFoundView.vue` → 路径 `/:pathMatch(.*)*`（404）
- 所有路由必须懒加载：`() => import('@/views/xxx.vue')`
- 支持路由元信息（meta）用于设置页面标题

## 项目结构
/src
  /components       → 可复用 UI 组件（如 AISummaryDialog.vue）
  /views            → 页面级组件（5 个基础视图）
  /pages            → 博客文章源（.md 文件，含 frontmatter）
  /utils            → 工具函数（markdown 解析、API 封装）
  /assets           → 静态资源（头像、图标）
  /router           → 路由配置
    └── index.ts
/public
  /posts            → 公开可访问的 .md 文件（供 fetch 加载）
index.html          → 引入 WindiCSS 和 highlight.js CDN

## 约束
- 不使用 Pinia/Vuex
- 不使用 Vite 插件处理 Markdown（全部运行时 fetch + parse）
- 支持响应式布局（WindiCSS 断点：sm, md, lg）
- 支持暗色模式（通过切换 html 的 class="dark" 实现）
- 所有 API 调用封装在 /utils 中，便于 mock 或替换