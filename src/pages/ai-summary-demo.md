---
title: AI 摘要接入复盘
date: 2026-04-14
updated: 2026-04-18
type: note
tags: [AI, Summary, Product]
pattern: checklist
summary:
  - 摘要应由用户主动触发，而不是默认强插。
  - 同文章摘要需要缓存，避免重复生成。
  - 输出必须经过 HTML 清洗再渲染。
  - 出错时要给出可重试入口。
yuque: https://www.yuque.com/dust-notes/ai/summary-integration
github: https://github.com/yourname/my-start-blog/tree/main/src/components
related_articles: [hello-codex, react-ecosystem-redux-hooks-react18-ssr]
related_projects: [my-start-blog]
excerpt: 一篇短复盘，记录 AI 摘要能力在博客中的接入取舍。
---

## 关键概念
AI 摘要是“辅助阅读”能力，不该替代正文。触发时机应让用户可控。

```ts
if (!userClicked) return
summary = await fetchSummary(postId)
```

## 最小可运行代码
```ts
const cache = new Map<string, string>()

export async function getSummary(postId: string) {
  if (cache.has(postId)) return cache.get(postId) as string
  const result = await requestSummary(postId)
  cache.set(postId, result)
  return result
}
```

这个实现足够小，但已经覆盖了缓存和重复请求问题。
