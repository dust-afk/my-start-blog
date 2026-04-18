---
title: JavaScript核心概念速查笔记
date: 2026-04-18
updated: 2026-04-18
type: note
pattern: cheatsheet
tags: [JavaScript, this绑定, 浏览器原理, V8引擎, 渲染优化]
summary:
  - this绑定规则：默认、隐式、显式、new，优先级依次递增，箭头函数无this
  - 浏览器渲染：HTML解析→CSSOM→RenderTree→Layout→Paint→Composite，理解回流重绘
  - V8执行：Parser→Ignition→TurboFan，热点函数JIT优化，分代GC算法
  - defer异步下载顺序执行不阻塞解析，async异步下载执行不保证顺序
  - transform/opacity触发合成层利用GPU加速，但过多图层影响性能
yuque: https://www.yuque.com/dust-gapgh/npmpha/mxnye7109950zy7m
related_articles: [react-hooks-core-practice-guide, react-ecosystem-redux-hooks-react18-ssr]
related_projects: [my-start-blog]
excerpt: 一篇聚焦this绑定、浏览器渲染流程、V8执行机制与性能优化的JavaScript速查笔记。
---

# JavaScript核心概念速查笔记

## 🔗 快速导航
- [一、this绑定机制](#一this绑定机制)
- [二、浏览器渲染原理](#二浏览器渲染原理)
- [三、V8引擎执行机制](#三v8引擎执行机制)

---

## 一、this绑定机制

### 1.1 四种绑定规则 ⭐⭐⭐
| 规则 | 触发条件 | this指向 | 是否可被覆盖 |
|------|----------|----------|--------------|
| 默认绑定 | 独立调用 `foo()` | 非严格：window；严格：undefined | — |
| 隐式绑定 | `obj.method()` | obj | 赋值后丢失（→ 默认绑定） |
| 显示绑定 | `fn.call(obj)` / `bind(obj)` | obj | bind硬绑定不可改（除非new） |
| new绑定 | `new Fn()` | 新创建的对象 | 优先级最高 |

```javascript
// 高频陷阱：箭头函数无this
function Foo() {
  this.val = 42;
}
Foo.prototype.getVal = () => this.val; // ❌ 箭头函数 → this是全局！

const f = new Foo();
console.log(f.getVal()); // undefined（不是42！）

// 正确写法
Foo.prototype.getVal = function() { return this.val; };
```

---

## 二、浏览器渲染原理

### 2.1 渲染流程 ⭐⭐⭐
**输入URL → DNS查询 → TCP连接 → HTTP请求 → HTML解析 → CSSOM构建 → RenderTree → Layout → Paint → Composite**

### 2.2 渲染优化 ⭐⭐⭐
| 操作 | 是否回流 | 是否重绘 | 优化建议 |
|------|----------|----------|----------|
| `element.style.color = 'red'` | ❌ | ✅ | 安全 |
| `element.style.width = '100px'` | ✅ | ✅ | 避免频繁修改 |
| `element.offsetLeft` | ✅（强制回流） | ✅ | 缓存结果：`const w = el.offsetWidth` |

### 2.3 defer vs async ⭐⭐⭐
| 属性 | 下载时机 | 执行时机 | 是否阻塞HTML解析 | 顺序保证 |
|------|----------|----------|------------------|----------|
| 无属性 | 立即下载 | 下载完立即执行 | ✅ 阻塞 | ✅ 顺序执行 |
| defer | 立即下载 | DOMContentLoaded前（按顺序） | ❌ 不阻塞 | ✅ 顺序执行 |
| async | 立即下载 | 下载完立即执行（不保证顺序） | ❌ 不阻塞 | ❌ 无顺序 |

---

## 三、V8引擎执行机制

### 3.1 V8执行流程 ⭐⭐
**Parser (AST) → Ignition (字节码) → TurboFan (JIT优化)**

- **热点函数**：被多次调用的函数 → V8将其标记为"hot"，触发TurboFan优化为机器码

### 3.2 V8核心模块 ⭐⭐
| 模块 | 职责 |
|------|------|
| Orinoco | 垃圾回收（GC）：分代回收（新生代：Scavenge；老生代：Mark-Sweep/Mark-Compact） |
| Ignition + TurboFan | 执行引擎（字节码 + JIT优化） |
| Builtins | 内置函数的原生实现（C++编写） |

### 3.3 合成层(Composite) ⭐⭐
**何时创建新合成图层**：
- `position: fixed`
- `transform: translateZ(0)`
- `will-change: transform`
- `opacity < 1`
- `filter` / `backdrop-filter`

> ⚠️ 风险：过多合成图层 → 内存暴涨，推荐使用`transform/opacity`替代`top/left`触发合成层