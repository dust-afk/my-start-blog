---
title: JS执行原理技术速查笔记
date: 2026-04-18
updated: 2026-04-18
type: note
pattern: cheatsheet
tags: [JavaScript, 执行上下文, 闭包, 内存管理, V8, GC, 变量提升, 词法作用域]
summary:
  - 全局对象在浏览器与 Node.js 中不同，推荐使用 globalThis 统一访问。
  - 执行上下文包含词法环境、变量环境与 this 绑定，变量提升是高频考点。
  - V8 采用分代 GC，新生代 Scavenge，老生代 Mark-Sweep/Mark-Compact。
  - 闭包本身不等于泄漏，风险在于长期持有无用的大对象引用。
  - 隐藏类、内联缓存、TurboFan 是 V8 优化核心，结构频繁变化会触发去优化。
yuque: https://www.yuque.com/dust-gapgh/npmpha/mxnye7109950zy7m
related_articles: [react-hooks-core-practice-guide, react-ecosystem-redux-hooks-react18-ssr]
related_projects: [my-start-blog]
excerpt: 一篇聚焦全局对象、执行上下文、GC、闭包与 V8 优化机制的 JavaScript 速查笔记。
---

# JS执行原理技术速查笔记

## 🔗 快速导航
- [一、全局对象与执行流程](#一全局对象与执行流程)
- [二、内存管理与GC](#二内存管理与gc)
- [三、闭包机制](#三闭包机制)
- [四、V8优化技术](#四v8优化技术)

---

## 一、全局对象与执行流程

### 1.1 全局对象差异 ⭐⭐⭐
| 环境 | 全局对象 | `this` 指向 |
|------|----------|------------|
| 浏览器 | `window` | `window` (`this === window`) |
| Node.js | `global` | `undefined` (模块作用域) |
| 严格模式 | - | `undefined` |

> 💡 记忆技巧：推荐使用 `globalThis` 统一访问全局对象（ES2020 标准）

### 1.2 执行上下文 (Execution Context) ⭐⭐⭐
```javascript
// 执行上下文包含三个关键部分
{
  LexicalEnvironment: {...},      // 词法环境
  VariableEnvironment: {...},     // 变量环境
  ThisBinding: value              // this绑定
}
```

#### 1.2.1 变量提升 (Hoisting) ⭐⭐⭐
- **var声明**：声明提升但不初始化，初始值为 `undefined`
- **let/const声明**：存在**暂时性死区**(Temporal Dead Zone)，初始化前访问报错
- **函数声明**：完全提升，可在声明前调用

```javascript
console.log(a); // undefined (var提升)
var a = 1;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 2;
```

---

## 二、内存管理与GC

### 2.1 内存分区 ⭐⭐
| 分区 | 存储内容 | 特点 |
|------|----------|------|
| **栈 (Stack)** | 基础类型、执行上下文 | LIFO结构，访问速度快 |
| **堆 (Heap)** | 对象、闭包、函数 | 动态分配，访问相对慢 |

### 2.2 V8分代GC算法 ⭐⭐⭐
#### 2.2.1 新生代 (New Space)
- **算法**：Scavenge (复制算法)
- **大小**：默认 1~8MB
- **流程**：From空间 → To空间，存活对象晋升至老生代

#### 2.2.2 老生代 (Old Space)
- **算法**：Mark-Sweep + Mark-Compact
- **特点**：低频GC，处理长生命周期对象

#### 2.2.3 GC优化机制 ⭐⭐
- **增量标记**：将标记工作切片，避免长时间停顿
- **并发标记**：GC线程与JS主线程并行运行
- **闲时收集**：利用空闲时间执行轻量GC

---

## 三、闭包机制

### 3.1 闭包定义 ⭐⭐⭐
> **闭包 = 函数 + 其词法环境的引用**

**核心特征**：函数在其定义的作用域之外被调用时，仍能访问其外部变量

```javascript
function createCounter() {
  let count = 0; // 外部变量
  return function () {
    return ++count; // 闭包捕获count
  };
}
const inc = createCounter();
inc(); // 1 → count未被释放！
```

### 3.2 闭包内存流程 ⭐⭐
1. 外部函数执行 → 创建局部环境
2. 返回内部函数 → 函数对象的 `[[Environment]]` 指向外层环境
3. 只要内部函数存在，外部环境就不会被GC回收

### 3.3 闭包内存泄漏场景 ⭐⭐⭐
| 场景 | 原因 | 修复方案 |
|------|------|----------|
| 事件监听器未解绑 | DOM元素+闭包形成循环引用 | `removeEventListener` / `AbortController` |
| 定时器引用外部变量 | 闭包持有大对象 | `clearInterval` + 置null |
| 循环中创建闭包 | `var` 声明导致相同引用 | 改用 `let` 或 IIFE |

### 3.4 现代闭包替代方案 ⭐⭐
- **WeakMap/WeakSet**：键为弱引用，自动清理
- **模块私有变量**：ES Module天然闭包
- **Class私有字段**：`#field` 语法

---

## 四、V8优化技术

### 4.1 性能优化机制 ⭐⭐
| 技术 | 作用 | 示例 |
|------|------|------|
| **隐藏类 (Hidden Class)** | 加速属性访问 | 相同结构的对象共享Shape |
| **内联缓存 (IC)** | 缓存方法调用目标 | 避免重复查原型链 |
| **TurboFan JIT** | 热点函数编译为机器码 | 数值计算优化为SIMD指令 |

### 4.2 优化冲突 ⭐⭐
- **闭包与隐藏类冲突**：闭包中修改自由变量可能导致**去优化**(Deoptimization)
- **解决方案**：避免在闭包中频繁修改复杂对象结构

---

## 📚 面试高频题库

### Q1: 为什么var声明的变量会挂载到全局对象，而let/const不会？
> **A**：`var` 绑定在 Global Environment Record，而 `let/const` 绑定在 Global Lexical Environment（不可枚举、不可配置）。

### Q2: 闭包一定会导致内存泄漏吗？
> **A**：否。仅当无用的闭包长期持有大对象引用时才泄漏。合理使用闭包是安全的。

### Q3: 什么是“暂时性死区”(TDZ)？
> **A**：`let/const` 声明到初始化前的区域，访问会抛 `ReferenceError`，是词法作用域的严格体现。

---

## 🏷️ 关键词标签
`#JavaScript` `#执行上下文` `#闭包` `#内存管理` `#V8` `#GC` `#变量提升` `#词法作用域`
