# AI 协作与部署计划

## 开发阶段
- 主力：VS Code + Codex（生成基础结构、组件、工具函数）
- 辅助：Claude / 国产大模型（如通义千问、Kimi）
  - 用于：个性化文案润色、复杂逻辑解释、API 调用示例生成
  - 示例指令：“用 TypeScript 写一个函数，从 GitHub API 获取用户活跃度，并缓存到 localStorage”

## 测试策略
- 每完成一个组件，本地运行 `npm run dev` 验证
- 使用 Codex 的“流式输出”：先生成骨架，再逐步填充逻辑

## 部署
- 平台：Vercel
- 步骤：
  1. `git init && git add . && git commit -m "feat: initial blog"`
  2. 推送到 GitHub 仓库
  3. 在 Vercel 导入项目，自动检测 Vite → 部署
- 自定义域名（可选）：在 Vercel Settings 中绑定

## 后续扩展
- 接入真实 AI 总结 API（如 Claude API）
- 添加评论系统（Giscus）
- 实现粒子背景（tsParticles）