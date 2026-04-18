# My Start Blog

一个基于 `Vue 3 + Vite + TypeScript + Markdown` 的个人技术博客项目。  
定位是「Blog 精华输出 + Notes 速查笔记 + Projects 项目沉淀」。

## 功能特性

- 首页聚合：Blog / Notes / Projects 预览
- 博客与笔记分离：`type: blog` 与 `type: note`
- 文章详情页：自动目录、目录高亮、关联文章/项目、语雀/GitHub 外链
- Notes 专题页：`/notes/topics`，按拼音首字母分组所有 topic
- 主题切换：亮色/暗色模式切换
- 主题色切换：侧栏 Color 圆点切换强调色，并联动链接/高亮色
- AI 摘要弹窗：可通过 OpenAI 兼容接口或后端代理生成总结

## 技术栈

- Vue 3
- Vue Router 4
- Vite 5
- TypeScript
- marked + DOMPurify（Markdown 渲染与净化）

## 快速开始

```bash
npm install
npm run dev
```

本地开发默认地址：`http://localhost:5173`

## 构建与预览

```bash
npm run build
npm run preview
```

说明：`npm run build` 会先执行 `tsc --noEmit` 进行类型检查。

## 环境变量（AI 摘要）

可参考根目录 `.env.example`。

方式一（推荐）：走后端代理

```env
VITE_AI_SUMMARY_ENDPOINT=/api/ai-summary
```

方式二：前端直连 OpenAI 兼容接口（生产环境不推荐）

```env
VITE_AI_BASE_URL=https://api.openai.com/v1
VITE_AI_MODEL=gpt-4o-mini
VITE_AI_API_KEY=your_api_key
```

## 内容管理（Markdown）

文章放在 `src/pages/*.md`，文件名即路由 `slug`。  
例如：`src/pages/react-hooks-core-practice-guide.md` -> `/article/react-hooks-core-practice-guide`

建议 frontmatter 模板：

```md
---
title: React Hooks 核心概念与实践指南
date: 2026-04-18
updated: 2026-04-18
type: note
tags: [React, Hooks, 性能优化]
summary:
  - 核心结论 1
  - 核心结论 2
pattern: cheatsheet
yuque: https://www.yuque.com/xxx/yyy/zzz
github: https://github.com/xxx/yyy
related_articles: [another-article-slug]
related_projects: [my-start-blog]
excerpt: 一句话摘要（可选）
---
```

字段说明：

- `type`: `blog` 或 `note`
- `tags`: 用于检索、筛选和 topics 聚合
- `pattern`: 笔记形态标签，如 `cheatsheet` / `checklist`
- `related_articles`: 关联文章 slug 列表
- `related_projects`: 关联项目关键字（用于匹配项目卡片）

## 路由说明

- `/` 首页
- `/blog` 博客列表
- `/notes` 笔记列表
- `/notes/topics` 主题总览（按首字母）
- `/article/:slug` 文章详情
- `/projects` 项目页
- `/about` 关于页
- `/resume` 简历页

## 目录结构

```text
.
├─ src/
│  ├─ assets/         # 图片与静态资源
│  ├─ components/     # 组件（如 AI 摘要弹窗）
│  ├─ data/           # 本地数据（项目卡片等）
│  ├─ pages/          # Markdown 文章
│  ├─ router/         # 路由配置
│  ├─ utils/          # Markdown 解析、AI 摘要等
│  └─ views/          # 页面视图
├─ .env.example
├─ package.json
└─ vite.config.ts
```

## 部署建议

- 推荐平台：Vercel / Netlify / GitHub Pages（静态托管）
- 构建命令：`npm run build`
- 输出目录：`dist`

## License

MIT

