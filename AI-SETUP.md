# AI 助手接入说明

## 功能位置
- 文章详情页：`/article/:slug`
- 按钮：`🤖 AI 助手总结`
- 功能：调用大模型生成摘要、关键点、关键词
- 缓存：同一篇文章在当前会话内会缓存结果，重复打开不重复请求

## 配置方式
支持两种模式，优先顺序如下：
1. `VITE_AI_SUMMARY_ENDPOINT`（推荐）
2. OpenAI 兼容直连（`VITE_AI_BASE_URL + VITE_AI_MODEL + VITE_AI_API_KEY`）

在项目根目录创建 `.env.local`：

```bash
# 方式一：后端代理（推荐）
VITE_AI_SUMMARY_ENDPOINT=/api/ai-summary

# 方式二：OpenAI兼容直连（生产不建议）
# VITE_AI_BASE_URL=https://api.openai.com/v1
# VITE_AI_MODEL=gpt-4o-mini
# VITE_AI_API_KEY=your_api_key
```

## 代理接口约定
当前前端会向 `VITE_AI_SUMMARY_ENDPOINT` 发送 POST：

```json
{
  "title": "文章标题",
  "content": "纯文本正文",
  "tags": ["tag1", "tag2"]
}
```

返回 JSON：

```json
{
  "summary": "一句到两句摘要",
  "bullets": ["关键点1", "关键点2", "关键点3"],
  "keywords": ["关键词1", "关键词2", "关键词3"]
}
```

## 注意事项
- 建议生产环境走后端代理，避免把 API Key 暴露在浏览器端。
- 文章纯文本会截断到约 12000 字符，避免请求过大。
- 当模型返回非 JSON 时，前端会尝试兜底解析并展示文本结果。
