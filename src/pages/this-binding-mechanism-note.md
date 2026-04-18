---
title: JS this绑定规则技术速查笔记
date: 2026-04-18
updated: 2026-04-18
type: note
pattern: cheatsheet
tags: [JavaScript, this绑定, 执行上下文, 作用域, 箭头函数, bind, call, apply]
summary:
  - this绑定遵循优先级顺序：new > 显式 > 隐式 > 默认，bind创建硬绑定无法被call/apply覆盖。
  - 箭头函数无自身this，继承外层作用域，不可用new调用且不能改变绑定。
  - 隐式绑定易发生丢失，赋值后调用变为默认绑定，需特别注意。
  - 严格模式下默认绑定返回undefined而非全局对象。
yuque: https://www.yuque.com/dust-gapgh/npmpha/mxnye7109950zy7m
related_articles: [js-execution-context-cheatsheet, closure-memory-leak-solutions]
related_projects: [my-start-blog]
excerpt: 一篇聚焦this绑定规则、箭头函数特性与绑定陷阱的JavaScript速查笔记。
---

# JS this绑定规则技术速查笔记

## 🔗 快速导航
- [一、绑定规则优先级](#一绑定规则优先级)
- [二、箭头函数特殊性](#二箭头函数特殊性)
- [三、绑定陷阱与注意事项](#三绑定陷阱与注意事项)

---

## 一、绑定规则优先级

### 1.1 优先级排序 ⭐⭐⭐
| 优先级 | 规则 | 触发条件 | 示例 |
|--------|------|----------|------|
| **1️⃣ 最高** | **new 绑定** | `new Constructor()` | `this` 指向新创建对象 |
| **2️⃣ 高** | **显式绑定** | `call`/`apply`/`bind` | 强制指定 `this` 值 |
| **3️⃣ 中** | **隐式绑定** | `obj.method()` | `this` 指向调用对象 |
| **4️⃣ 最低** | **默认绑定** | 独立函数调用 | 非严格指向全局，严格为undefined |

### 1.2 绑定规则详解 ⭐⭐⭐

#### 1.2.1 默认绑定
```javascript
function foo() {
  console.log(this); // 非严格：window；严格：undefined
}
foo(); // 独立调用
```

#### 1.2.2 隐式绑定
```javascript
const obj = {
  name: "Alice",
  greet() { console.log(this.name); }
};
obj.greet(); // "Alice" → this = obj
```

#### 1.2.3 显式绑定
```javascript
function greet(greeting) {
  console.log(`${greeting}, I'm ${this.name}`);
}

const person = { name: "Bob" };
greet.call(person, "Hi");      // "Hi, I'm Bob"
greet.apply(person, ["Hello"]); // "Hello, I'm Bob"
const boundGreet = greet.bind(person, "Hey");
boundGreet(); // "Hey, I'm Bob"
```

#### 1.2.4 new 绑定
```javascript
function Person(name) {
  this.name = name; // this → 新对象
  // 若显式返回对象，会覆盖new行为
}
const p1 = new Person("Charlie");
```

---

## 二、箭头函数特殊性

### 2.1 核心特性 ⭐⭐⭐
- **无自身this**: 继承外层作用域的 `this`（词法绑定）
- **不可重新绑定**: 不能用 `call`/`apply`/`bind` 改变
- **不可作为构造函数**: 不能用 `new` 调用

### 2.2 箭头函数this查找 ⭐⭐
1. 查找定义位置的词法作用域
2. 向上逐层查找，直到最近的非箭头函数
3. 若顶层是全局作用域，指向全局对象（严格为undefined）

```javascript
const obj = {
  name: "Alice",
  greet: () => {
    console.log(this.name); // this = 全局，不是obj！
  },
  sayHi() {
    const inner = () => {
      console.log(this.name); // this = obj（继承sayHi的this）
    };
    inner();
  }
};
```

### 2.3 典型应用场景 ⭐⭐
- 回调函数中保持 `this` 上下文
- 避免 `that = this` 的hack写法
- 事件处理器中的上下文保持

---

## 三、绑定陷阱与注意事项

### 3.1 隐式丢失 ⭐⭐⭐
```javascript
const obj = { name: "Alice", greet() { console.log(this.name); } };
const fn = obj.greet;
fn(); // this = window/undefined（默认绑定！）
```

### 3.2 bind硬绑定 ⭐⭐
- `bind` 创建的硬绑定函数无法被后续 `call`/`apply` 改变
- 但 `new` 调用可以覆盖 `bind` 的绑定

```javascript
const obj1 = { name: "A" };
const obj2 = { name: "B" };
function foo() { console.log(this.name); }

const bound = foo.bind(obj1);
bound.call(obj2); // 仍输出 "A" —— bind是硬绑定！
```

### 3.3 null/undefined处理 ⭐⭐
- 非严格模式下，`null`/`undefined` 作为 `thisArg` 会被替换为全局对象
- 严格模式下保持原值

```javascript
function test() { console.log(this); }
test.call(null); // 非严格：window；严格：null
```

---

## 📚 面试高频题库

### Q1: 箭头函数和普通函数的this有什么区别？
> **A**: 箭头函数无自身this，继承外层作用域；普通函数根据调用方式确定this。

### Q2: bind函数创建的绑定函数可以被call/apply覆盖吗？
> **A**: 不可以，bind创建硬绑定；但new调用可以覆盖bind绑定。

### Q3: 隐式绑定什么情况下会发生丢失？
> **A**: 函数赋值给变量后再调用，或作为回调函数传入时发生丢失。

---

## 🏷️ 关键词标签
`#JavaScript` `#this绑定` `#执行上下文` `#作用域` `#箭头函数` `#bind` `#call` `#apply`