---
title: React Hooks 核心概念与实践指南
date: 2026-03-18
updated: 2026-04-18
type: blog
tags: [React, Hooks, Performance, Frontend]
summary:
  - useState/useEffect/useMemo/useCallback/useRef/useContext 构成了函数组件开发的核心能力。
  - useEffect 需要根据依赖模式正确使用，并在必要时返回清理函数避免副作用泄漏。
  - useMemo 缓存计算结果，useCallback 缓存函数引用，二者都用于减少不必要重渲染。
  - 闭包陷阱常见于 effect 和异步回调，需通过依赖数组或 ref/callback 保证读取最新值。
  - Hooks 性能优化的重点是按需使用、依赖准确、避免过度优化。
yuque: https://www.yuque.com/dust-gapgh/npmpha/zafk59lg83p726xd
related_articles: [react-router-6-core-guide, react-ecosystem-redux-hooks-react18-ssr]
related_projects: [react-rent-ui]
excerpt: 从核心 Hooks 到闭包陷阱与性能优化，一篇梳理 React Hooks 实战心智模型的指南。
---

## 1. 核心 Hooks 总结
- **useState**：函数组件中的状态管理，替代类组件的 `this.setState`。
- **useEffect**：处理副作用（数据获取、订阅、DOM 操作），并支持清理机制。
- **useMemo**：缓存昂贵的计算结果，避免重复计算。
- **useCallback**：缓存函数引用，防止子组件不必要的重渲染。
- **useRef**：创建持久化引用，访问 DOM 元素或存储可变值。
- **useContext**：跨层级共享状态，避免 props 钻取。

```tsx
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount((v) => v + 1)}>{count}</button>
}
```

## 2. useEffect 使用模式
- **无依赖**：`useEffect(() => {})`，每次渲染后都执行。
- **空依赖**：`useEffect(() => {}, [])`，仅挂载时执行（接近 `componentDidMount`）。
- **有依赖**：`useEffect(() => {}, [deps])`，依赖变化时执行。
- **清理机制**：`return () => {}`，组件卸载或下次 effect 执行前触发。

```tsx
useEffect(() => {
  const timer = window.setInterval(() => {
    console.log('tick')
  }, 1000)

  return () => window.clearInterval(timer)
}, [])
```

## 3. useMemo vs useCallback
- **useMemo**：缓存“值”，适合昂贵计算结果。
- **useCallback**：缓存“函数”，适合传给子组件的回调。
- **共同目标**：减少不必要渲染与计算，提升性能稳定性。

```tsx
const total = useMemo(() => heavySum(list), [list])
const onSelect = useCallback((id: string) => setActiveId(id), [])
```

## 4. 闭包陷阱问题
- **核心问题**：effect 或异步回调捕获了旧状态，导致读取到过期值。
- **常见场景**：`setInterval`、事件监听、Promise 回调。
- **解决方案**：确保依赖数组完整，或使用 `useRef`/`useCallback` 访问最新值。

```tsx
const latestCount = useRef(count)
useEffect(() => {
  latestCount.current = count
}, [count])
```

## 5. 性能优化策略
- 合理使用 `useMemo` 和 `useCallback`，避免为“廉价计算”做过度缓存。
- 正确设置 `useEffect` 依赖项，防止副作用失控或内存泄漏。
- 识别闭包陷阱，确保异步逻辑读取的是最新状态。

## 小结
Hooks 的价值不只是 API 替换，而是让组件逻辑按“状态 + 副作用 + 复用”进行组织。  
当依赖关系清晰、性能优化有边界时，函数组件会更易维护、更易扩展。
