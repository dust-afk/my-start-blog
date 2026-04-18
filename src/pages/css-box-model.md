---
title: CSS 盒模型速查
date: 2025-10-15
updated: 2026-04-18
type: blog
tags: [CSS, Box Model, Frontend]
summary:
  - `content-box` 下，`width/height` 只计算内容区。
  - `border-box` 更适合工程化布局，尺寸更可控。
  - 统一设置 `box-sizing` 能减少布局偏移问题。
  - 组件库开发建议从全局重置开始。
yuque: https://www.yuque.com/dust-notes/css/box-model
github: https://github.com/yourname/markdown-snippets/tree/main/css-box-model
related_articles: [css-BFC, hello-codex]
related_projects: [markdown-snippets]
excerpt: 5 分钟掌握 CSS 盒模型的计算规则和工程实践。
---

## 关键概念
`content-box` 是浏览器默认模式：元素实际占位 = `content + padding + border + margin`。

`border-box` 模式下，`width/height` 包含了 `padding + border`，更容易控制卡片、表单等组件宽度。

```css
/* 工程默认推荐 */
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

## 最小可运行代码
```html
<div class="card">hello box model</div>
```

```css
.card {
  width: 240px;
  padding: 16px;
  border: 2px solid #1f2937;
  background: #f8fafc;
}
```

运行后你可以快速验证：在 `border-box` 下，卡片始终保持 240px 总宽度。
