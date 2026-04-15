---
title: AI Summary Demo
date: 2026-04-14
tags:
  - AI
  - Summary
  - Frontend
---

# AI Summary Demo

本文用于演示“AI 摘要”能力在博客页中的接入方式，核心关注点有三个：

- 摘要请求时机（用户主动触发）
- 摘要结果缓存（避免重复调用）
- 交互反馈（加载态、错误态、重试）

## Interaction Notes

建议在产品层做两层防护：

1. 对同一篇文章设置缓存键，减少重复请求
2. 对输出内容做 HTML 清洗，避免注入风险

> Demo 文章主要用于联调，不代表最终产品文案。
