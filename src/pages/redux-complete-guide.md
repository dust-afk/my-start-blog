---
title: Redux完整学习指南
date: 2026-04-18
updated: 2026-04-18
type: blog
tags: [Redux, Redux Toolkit, React, State Management]
summary:
  - Redux 的 reducer 必须保持纯函数，异步逻辑应交给中间件或 RTK Query。
  - combineReducers 让状态按模块拆分，提升维护性、测试性和协作效率。
  - Redux Toolkit 是官方推荐方案，核心 API 包括 createSlice/createAsyncThunk/configureStore。
  - 相比原始 Redux，RTK 显著减少样板代码并默认提供最佳实践。
yuque: https://www.yuque.com/dust-gapgh/npmpha/afkchy3hgrx1dd9r
related_articles: [react-ecosystem-redux-hooks-react18-ssr, react-ui-library-and-state-management-guide]
related_projects: [react-rent-ui, vue-admin-lite]
excerpt: 一篇从异步、reducer 拆分到 RTK 的完整上手指南，帮助你建立 Redux 的工程化认知。
---

## 重点内容概括

### 1. Redux异步操作
- **核心原则**：reducer 必须是纯函数，不能直接执行异步逻辑。
- **实现方案**：使用 `redux-thunk` 中间件或 `RTK Query`。
- **关键区别**：同步操作立即执行且可预测，异步操作通常有 `pending / fulfilled / rejected` 三个阶段。

### 2. Reducer拆分机制
- **实现方式**：使用 `combineReducers` 合并多个 reducer。
- **设计原理**：状态树模块化，遵循单一职责原则。
- **主要优势**：易于维护、便于测试、支持团队协作。

### 3. Redux Toolkit（RTK）
- **定位**：官方推荐的开发工具包，用于简化 Redux 开发。
- **核心 API**：`createSlice`、`createAsyncThunk`、`configureStore` 等。
- **核心优势**：减少样板代码、自动处理不可变性、内置最佳实践。

### 4. 使用流程对比
- **原始 Redux**：步骤繁琐，代码量大，需要手动处理不可变性。
- **RTK 方式**：流程简化，代码更简洁，是官方推荐的标准做法。

## Redux异步操作实战要点
在 Redux 中，异步请求不要写进 reducer，而是放到 action creator 或 thunk 中处理。  
推荐思路是：UI 触发 action -> thunk 发请求 -> 根据结果 dispatch 成功或失败 action -> reducer 只负责更新状态。

```ts
// 伪代码：createAsyncThunk 的典型模式
const fetchUser = createAsyncThunk('user/fetch', async (id: string) => {
  const response = await api.getUser(id)
  return response.data
})
```

## Reducer拆分与状态组织
当业务增长后，把所有状态写在一个 reducer 里会快速失控。  
更合理的方式是按业务域拆分：`user`、`posts`、`settings` 等，再通过 `combineReducers` 统一挂到根状态。

```ts
const rootReducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
  settings: settingsReducer
})
```

## RTK推荐最小模板
RTK 可以作为默认起手式：`configureStore + createSlice + createAsyncThunk`。  
它既减少模板代码，也降低了手动维护不可变更新时的出错概率。

```ts
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment(state) {
      state.value += 1
    }
  }
})
```

## 小结
Redux 的关键不是“会写 API”，而是理解状态流转边界：  
- 同步与异步分层  
- reducer 按职责拆分  
- 默认使用 RTK 作为工程基线  

掌握这三点后，复杂前端状态管理会清晰很多。
