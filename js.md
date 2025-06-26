# var 声明变量，到底有什么历史包袱？

1. 变量提升
   在声明前访问，不会报错 值为 undefined，产生 bug(相同作用域，不同作用域会直接报错)
2. 无视块级作用域
   在 if 块内的变量和 for 循环的变量**会**泄露到外部，
3. 对全局对象污染
   var 在全局作用域声明会成为 window 的属性
4. 同一作用域中可以重复声明

# let 和 const 如何解决这些问题?

1. 暂时性死区
   声明前无法访问
2. 有块级作用域
   在 if 块内的变量和 for 循环的变量**不会**泄露到外部
3. let/const 不会成为 window 属性
4. 同一作用域内不能重复声明
5. 区别
   let 可以重新赋值/const 保证变量引用的不变性

# 什么是“暂时性死区(TDZ)"？

1. 是什么
使用 let 和 const 声明的变量在代码块（作用域）开始到变量实际声明位置之间的一段区域。在这段区域内，这些变量虽然在作用域中已经“存在”，但你无法访问它们。

2. let const 也会有变量提升，值为undefined。但是不同的是let const 不能够访问


# 讲讲数据类型

有原始类型和对象类型
原始类型：string number boolean undefined null symbol bigInt
对象类型: object:object/array/function/Date/RegExp/Map/Set

# 值类型 vS 引用类型

| 表格 | 值类型 | 引用类型 |
|-------|-------|-------|
| 存储地址 | 存储在栈中 | 存储在堆中 |
| 怎么访问 | 直接访问存储变量的值 | 存储是地址，通过地址去堆中找 |
| 怎么赋值 | 赋值相当于拷贝这只值 | 将引用地址复制 |
| 怎么比较 | 存储的值比较 | 引用地址的比较 |

# typeof

typeof 是一元操作符，返回操作数类型的字符串表示

```js

typeof {a:1} //object
typeof [1,2,3] //object
typeof new Date() //object

//特别
typeof null //object
typeof function() //function ts
```

# typeof null 为什么返回"object"?

1. 历史遗留 bug
2. js 早期中，null 的底层表示 null 指针
3. 对象的类型标签恰好也是 0，typeof 错误地将其识别为对象
4. 直接使用 === 判断 null

# 如何准确判断一个值是数组？
1@
1. 使用 Array.isArray()，是数组会返回 Boolean 的 true
2. 最精确的
   Object.prototype.toString.call(),返回操作符用字符串表示
3. Array.prototype.isPrototypeOf(obj)
   利用 isPrototypeOfO 方法，判定 Array 是不是在 obj 的原型链中，如果是，则返回 true,否则 false。


# ===

1. 值类型：比较值是否相等
2. 引用类型：比较引用/地址是否相等

```js
console.log(100 === 100); //true
console.log({} === {}); //false 两个独立堆空间
```

# 为什么要拷贝

1. 避免意外的副作用
   修改副本时，不污染原始数据
2. 实现状态的不可变性
   React/Vue 等框架的核心机制
3. 隔离数据
   创建完全独立的数据快照

# 深拷贝和浅拷贝的区别?

1. 性能
   浅拷贝：快，开销小。深拷贝：慢，开销大，需要遍历所有节点。
2. **浅拷贝**
   创建一个新对象
   复制原始对象的第一层属性
   如果属性是值类型，复制值
   如果属性是引用类型，复制内存地址
3. **深拷贝**
   创建一个新对象
   递归地复制所有层级的属性
   所有引用类型属性都会被皮重新创建
   新旧对象完全独立，互不干扰

# 浅拷贝

1. object.assign()

```js
const ori = { a: 1, b: { c: 2 } };
const copy = Object.assign({},ori)
shallowCopy.a = 10;//修改第一层
shallowCopy.b.c = 20;//修改嵌套对象
console.log(original.a);//1（未受影响）
console.log(original.b.c) ;//20（受到影响！）
```

2. ...扩展运算符（es6）

```js
const ori = { a: 1, b: { c: 2 } };
const copy = {...ori}
shallowCopy.a = 10;//修改第一层
shallowCopy.b.c = 20;//修改嵌套对象
console. log(original.a);//1（未受影响）
8console. log(original.b.c) ;//20（受到影响！）
```

# 深拷贝

1. JSON.parse(JSon.stringify())
   **优点：**
   极简，一行代码
   处理纯 JSON 数据时很方便
   **缺点：**
   忽略 undefined
   忽略 Symbol
   忽略 Function
   Date 对象会变成字符串
   无法处理循环引用月（会报错）
2. structuredclone()
   **优点：**
   内置的全局函数，无需引库
   专为深拷贝设计，性能好
   支持循环引|用
   支持多种复杂类型(Date,RegExp,Map,Set)
   **缺点：**
   无法拷贝函数(Function)
   无法拷贝 Error 对象/Dom 节点
3. 自己手写拷贝

# 数组

1. 迭代方法: forEach, map, filter, reduce..
2. 修改原数组 (Mutator): push, pop, Splice..
3. 返回新数组 (Non-mutating): slice, Concat

# map()

1. 核心功能：转换数组，创建新数组
2. 返回值：一个等长的新数组
3. 改变原数组?:否(Non-mutating)

# forEach()

# map vs forEach

1.  map:返回一个新数组
    forEach:返回 undefined

2.  map:用于数据转换
    forEach:用于执行无返回值的操作

3.  map 可以链式调用:arr.map(...).filter(...)
    forEach 不可以

# filter()

1. 核心功能：筛选数组，创建新数组
2. 返回值：一个新的、长度不定的数组
3. 改变原数组？：否(Non-mutating)

```js
const words = ["spray", "limit", "elite", "exuberant", "dest"];
const result = words.filter((word) => word.length > 6);
console.log(result); // 输出: ["euberant", "destruction"]
```

# reduce()

1. 核心功能：汇总/累加数组元素
2. 结果:返回单个汇总值（The"Reducer"）
3. 改变原数组?:否 (Non-mutating)

# reduce() 不提供 initialValue

1. accumulator 初始值为数组第一个元素
2. 遍历从数组第二个元素（index：1）开始
3. 注意：对空数组调用会抛出 TypeError!

# splice()

1. splice（）:数组的“手术刀
2. 核心功能:原地修改数组 (增 /删 /改)
3. 返回值：被删除元素的数组
4. 改变原数组？：是(Mutator Method)

```js
const months = ["Jan", "March", "April", "June"];
//在索引l1的位置，删除0个元素，插入‘Feb
months.splice(1, 0, "Feb");
console.log(months);
```

# slice()

# 对象遍历 no

# ===

1. 是什么
   严格相等运算符
2. 起作用
   不进行类型转换
   类型和值都相等的时候才返回 true
3. 相比 `==` 的好处
   从源头避免了不确定性

# ==

1. 字符串 数字
   `clg(99 == '88) //true`
2. 布尔值 数字

```js
// true 被隐式转换为数字 1
console.log(true == 1); // true
// false 被隐式转换为数字 0
console.log(false == 0); // true
```

3. null undefined

```js
console.log(null == undefined); // true
```

4. 对象 初始值

```js
// 1.[1】 调用内部 ToPrimitive 方法，转换为"1"
//2.字符串"1"与数字1比较
//3.字符串“1"转换为数字1
// 4.1 ==1，结果为 true4
console.log([1] == 1); // true
```

# NaN

1. NaN 不等于任何值，包括自己

```js
clg(NaN == NaN); //false
clg(NaN === NaN); //false
```

2. 检查方式
   Number.isNan()

# 什么是 this

一个关键字，一个特殊的对象引用
运行时绑定 (Runtime Binding)
在函数被调用时才确定
由函数的调用方式（Call-site）决定

# new 关键字做了什么？

1. 创建一个全新的空对象{}
2. 新对象的原型链接到构造函数的 prototype
3. 新创建的空对象作为this的值，并执行构造函数
4. 如果构造函数返回一个对象，则返回该对象。否则，返回新创建的对象。

```js
function Person(name) {
  // 1.this={；（隐式）
  this.name = name;
  // 2。return this；（隐式）
  const alice = new Person("Alice");
  console.log(alice.name); // "Alice"
}
```

# 箭头函数在 this

1. 没有自己的 this 绑定，去上层作用域找 this 使用
2. 在写出时 this 的指向就确定了
3. 不能被 call,apply,bind 修改

# code this

```js
const myTimer = {
  secodes: 0,
  start() {
    setTimeout(function () {
      console.log(this.secodes++);
    }, 1000);
  },
};
myTimer.start(); //NaN
```

```js
//1
setTimeout(() => {
  console.log(this.secodes++);
}, 1000);
//2
setTimeout(
  function () {
    console.log(this.secodes++);
  }.bind(this),
  1000
);
```

# 什么是闭包

闭包是函数与其词法环境的组合
可以将函数与外部环境“打包

```js
//返回的匿名函数形成了一个闭包
function makeGreeter() {

  return function(kame) {
    console. log(greeting ++ name +'!');
  }
  }


// fragment
// 当 makeGreeter（）执行完毕后，理论上它的作用域应该销毁
const sayHello = makeGreeter('Hello'); // [10]
const sayHey = makeGreeter('Hey');//[11]

//fragment
//但是，sayHello 和 sayHey （闭包）仍然能访问 ‘greetir
sayHello（'Alice'）; // [15] 输出： Hello,Alice！
sayHey('Bob');// [16] 输出： Hey， Bo
```

makeGreeter 返回一个内部函数
内部函数记住了 makeGreeter 作用域的
greeting
sayHello,sayHey 是被暴露的内部函数
·它们形成了闭包，访问并保持了各自的 greeting 值

# 为什么需要闭包

数据封装
私有变量
保持状态
“记住"外部函数环境
延迟执行
事件处理、异步回调

# 如何形成闭包

当一个内部函数
被暴露到其词法作用域之外时
闭包就形成了

# 闭包的注意事项

内存开销：
引用的外部变量会一直保存在内存
直到闭包被垃圾回收
捕获的是“引用"：
记住的是变量本身
变量值改变，闭包内访问到的也会改变
（除非使用技巧如 IFE/儿 et 创建新变量）

# 高阶函数[HOF]

接受一个函数作为参数
或者返回一个函数

# 柯里化

将多参数函数
转化为一系列只接受单一参数的函数
最终返回结果

# 节流

1. 核心：控制事件触发频率
2. 规定在一个时间段内事件最多触发一次。周期性执行
3. 搜索框实时建议 (输入频率很高，但需要周期检查)
4. 监听浏览器窗口变化 (resize)
5. 游戏中的射击按钮

# 防抖

1. 核心：控制事件触发时机
2. 事件触发后，延迟执行回调函数，如果在延迟时间内再次触发。则重新计时
3. 窗口大小修改（resize）：窗口停止拖动再渲染
4. 拖拽事件 (dragend)

# 为什么使用节流和防抖

1. 减少回调函数的执行次数
2. 降低 CPU、内存消耗
3. 减轻服务器请求压力
4. 提升用户体验

# 立即执行函数表达式(IIFE)

1. 需要是函数表达式，不能是函数声明
2. 为什么要有 IIFE
   创建独立作用域隔离内部变量和函数
   避免变量命名冲突和全局变量污染
3. 执行后有返回值
   如果函数没有明确 return，默认返回 undefined
   可以用一个变量存储

# 纯函数

1. 条件
   给定相同输入。总是返回相同输出
   执行过程中没有任何可观察的副作用
2. 副作用
   指函数执行时，除了返回显而易见的计算结果外。还对外部世界产生了可观察的影响
3. 常见的副作用
   修改全局/外部变量的状态
   l/O 操作：console.log,网络请求,文件读写
   修改传入的引 I 用类型参数(对象/数组）
   调用依赖外部不确定因素的函数（如
   Math.random(),Date.now())
   修改 DOM（在前端）

# 函数式编程

1. 是什么
   一种编程范式，强调使用纯函数
   避免改变状态和可变数据
   将计算视为数学函数的求值过程
2. 优点
   输入固定 → 输出固定。极大地提高代码的可预测性
   编写单元测试非常简单：只需断言输入与输出
   纯函数不依赖或修改外部状态。避免了共享状态带来的复杂同步问题
   天然适用于多线程或多进程环境
   更容易通过阅读代码来推导其行为和结果。减少心智负担

# 对 array object 如何避免修改参数

1. array
   使用展开运算符[...]
   使用 slice（）方法
   使用会返回新数组的内置方法(map,filter 等)
2. object
   使用展开运算符{···}
   使用 object.assign()
   还有深拷贝

# setTimeout setInterval

1. setTimeout(callback, delay, ...args)
   指定延迟(delay 毫秒)
   执行一次回调函数
   返回数字 ID，用于取消
2. setInterval(callback, delay, ...args)
   每隔指定间隔(delay 毫秒)
   重复执行回调函数
   返回数字 ID，用于取消
3. 延时显示元素
   动画效果
   周期性数据轮询
   构建异步逻辑

```js
function greet(name) {
  console.log(`Hello,${name}`);
}
const timerId = setTimeout(greet, 2000, "world");
// clearTimeout(timerId) 取消
```

# 什么是事件循环

1. 是什么
   JavaScript 执行异步的机制
2. 是浏览器和 node 提供的环境
   在主线程空闲时执行任务：处理任务队列：（宏任务）（微任务）
3. 解决什么问题
   单线程的阻塞问题：实现非阻塞 1/0（网络请求）（文件读写）
   保证用户界面响应性（DOM 更新）（事件监听）
   支持异步编程模型（Promise / async/ await）（setTimeout/fetch）

# 事件循环

它是一个持续运行的进程，负责监控调用站和任务队列，将队列中的任务移到调用站中执行

任务分宏任务和微任务

1. 执行同步代码直到调用栈清空
2. 执行所有微任务·清空微任务队列
3. 执行一个宏任务·从宏任务队列取第一个执行
4. 重复上述过程

# 宏任务 vs 微任务

1. **微任务**
   Promise.then() / .catch() / .finally()
   queueMicrotask()
   Mutationobserver 回调
   process.nextTick()(Node.js 特有，优先级高)
2. **宏任务**
   setTimeout()
   setInterval()
   DOM 事件
   I/O 操作完成回调
   UI 渲染 (绘制)
   setImmediate()(Node.js)

# typeof vs instanceof
