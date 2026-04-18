---
title: 博客架构最小实现（Vue + Markdown）
date: 2026-04-16
updated: 2026-04-18
type: blog
tags: [Vue, Markdown, Architecture]
summary:
  - 博客只保留精华内容，降低首屏和维护成本。
  - 语雀承接长文细节，GitHub 承接完整可运行项目。
  - 本地 Markdown 用 frontmatter 描述摘要、标签和外链。
  - 页面层只做渲染，不在运行时做复杂内容编排。
yuque: https://www.yuque.com/dust-notes/blog/minimal-architecture
github: https://github.com/yourname/my-start-blog
related_articles: [ai-summary-demo, css-box-model, css-BFC]
related_projects: [my-start-blog]
excerpt: 这篇文章给出“博客精华层 + 语雀细节层 + GitHub交付层”的最小落地方案。
---

## 关键概念
本地文章建议只写三件事：结论、代码、索引。复杂推导不要放在博客正文里。

```yaml
# frontmatter 示例
summary:
  - 核心结论 1
  - 核心结论 2
yuque: https://www.yuque.com/...
github: https://github.com/...
```

## 最小可运行代码
```ts
import { parseFrontmatter } from '@/utils/markdown'

const { meta, body } = parseFrontmatter(markdown)
console.log(meta.summary, meta.yuque, meta.github, body)
```

当解析层稳定后，你可以非常低成本地新增文章和索引页。
