---
title: BFC 实战备忘
date: 2025-12-17
updated: 2026-04-18
type: blog
tags: [CSS, BFC, Layout]
summary:
  - BFC 可以隔离浮动影响，防止容器高度塌陷。
  - BFC 内外元素不会发生 `margin` 合并。
  - 常见触发方式是 `overflow: hidden/auto` 或 `display: flow-root`。
  - 现代项目优先使用 `flow-root`，语义更清晰。
yuque: https://www.yuque.com/dust-notes/css/bfc
github: https://github.com/yourname/markdown-snippets/tree/main/css-bfc
related_articles: [css-box-model, hello-codex]
related_projects: [markdown-snippets]
excerpt: 用最小示例解释 BFC 触发条件和两个高频应用场景。
---

## 关键概念
BFC（Block Formatting Context）是一个独立布局上下文。它的作用不是“炫技”，而是解决真实布局问题：
清除浮动、阻断 `margin` 折叠、控制内部排版边界。

```css
.container {
  display: flow-root;
}
```

## 最小可运行代码
```html
<div class="container">
  <div class="float-box"></div>
</div>
```

```css
.container {
  display: flow-root;
  border: 1px solid #cbd5e1;
}

.float-box {
  float: left;
  width: 120px;
  height: 80px;
  background: #93c5fd;
}
```

这个示例能直接验证：容器不会因为子元素浮动而塌陷。
