---
title: 盒子模型
date: 2026-04-15
tags:
  - CSS
  - Box Model
  - Frontend
---

## 盒子模型

### 标准盒子模型（浏览器默认盒子模型）

盒子的总宽度 = width + padding + border + margin  
盒子总高度 = height + padding + border + margin

总结：`width/height` 都只是内容高度（content），不包含 `padding` 和 `border`。

### IE 怪异盒子模型

盒子总宽度 = width + margin  
盒子总高度 = height + margin

总结：`width/height` 包含 `padding` 和 `border` 的值。

### box-sizing

`box-sizing: content-box | border-box | inherit`

- `content-box`：默认值，与标准盒子模型表现一致。
- `border-box`：与怪异盒子模型表现一致。
- `inherit`：`box-sizing` 属性值从父元素继承。
