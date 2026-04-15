---
title: Hello Codex
date: 2026-04-15
tags:
  - Vue
  - Codex
  - Markdown
---

# Hello Codex

这是一篇用于演示的 Markdown 文章，目标是验证以下能力：

- 从 `src/pages` 读取文章
- 解析 frontmatter 元信息
- 在文章详情页按 HTML 安全渲染正文

## Why Markdown

Markdown 非常适合博客内容管理，原因是：

1. 文件可追踪，适合和 Git 一起使用
2. 写作体验轻量，不依赖后台系统
3. 可以通过脚本快速生成目录、标签和摘要

```ts
const slug = 'hello-codex'
console.log(`Now rendering: ${slug}`)
```

