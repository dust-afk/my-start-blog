---
title: React Router 6 核心功能详解
date: 2026-01-09
updated: 2026-04-18
type: blog
tags: [React Router, React, SPA, Frontend]
summary:
  - React Router 6 以 BrowserRouter、Routes、Route、Link 为核心，配合 hooks 使用。
  - 嵌套路由通过父子 Route + Outlet 实现布局复用和内容占位。
  - 参数体系分为路径参数、查询参数、状态参数，分别用 useParams/useSearchParams/useLocation 读取。
  - v6 不再提供 withRouter，类组件通常需要重构为函数式组件。
  - 通过 React.lazy 与 Suspense 可以对路由页面做懒加载，降低首屏包体积。
yuque: https://www.yuque.com/dust-gapgh/npmpha/ory2k60egfkxva9u
related_articles: [react-hooks-core-practice-guide, react-ecosystem-redux-hooks-react18-ssr]
related_projects: [react-rent-ui]
excerpt: 从创建流程到嵌套、参数传递与性能优化，完整梳理 React Router 6 的核心能力。
---

## 1. 基础创建流程
- **安装**：`npm install react-router-dom@6`
- **核心组件**：`BrowserRouter`、`Routes`、`Route`、`Link`
- **关键变化**：v6 更强调函数式组件 + hooks 的用法，弱化旧版依赖 `history` 对象的写法。

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  )
}
```

## 2. 嵌套路由机制
- **实现方式**：在父 `Route` 内定义子 `Route`，路径一般使用相对路径。
- **Outlet 作用**：父组件里的占位符，用于渲染当前匹配的子路由内容。

```tsx
import { Outlet, Route, Routes } from 'react-router-dom'

function DashboardLayout() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet />
    </div>
  )
}

function RouterConfig() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
```

## 3. 参数传递体系
- **路径参数**：`/users/:id`，使用 `useParams()` 获取。
- **查询参数**：`/search?q=react`，使用 `useSearchParams()` 获取。
- **状态参数**：通过 `Link` 的 `state` 传递，目标页用 `useLocation()` 获取。

```tsx
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'

function DetailPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const location = useLocation()

  return (
    <div>
      <p>id: {id}</p>
      <p>q: {searchParams.get('q')}</p>
      <p>from: {String(location.state?.from ?? '')}</p>
    </div>
  )
}

function EntryLink() {
  return <Link to="/users/42?q=react" state={{ from: 'home' }}>Go</Link>
}
```

## 4. 类组件兼容性
- **核心问题**：类组件不能直接使用 `useNavigate`、`useLocation`、`useParams` 等 hooks。
- **解决方案**：优先重构为函数式组件；v6 不再提供 `withRouter` 高阶组件。

在存量项目中，常见策略是先把路由相关容器组件迁移为函数式，再逐步下沉到业务组件。

## 5. 性能优化方案
- **懒加载实现**：`React.lazy()` + `Suspense` + 路由拆分。
- **优势**：减少初始包体积，提高首屏加载性能。

```tsx
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

const UserPage = lazy(() => import('./pages/UserPage'))
const SettingPage = lazy(() => import('./pages/SettingPage'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Routes>
        <Route path="/users" element={<UserPage />} />
        <Route path="/settings" element={<SettingPage />} />
      </Routes>
    </Suspense>
  )
}
```

## 6. 设计理念转变
React Router 6 的关键转变，是从“类组件生命周期 + 路由对象操作”的心智，转向“函数式组件 + hooks + 声明式路由配置”。  
这种模式更贴合现代 React 的数据驱动思路，代码结构通常也更简洁、可维护。
