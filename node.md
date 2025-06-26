# 机制

### nodejs 是什么，有什么特点

1. nodejs 是一个基于 chrome v8 引擎的，开源的，跨平台的，JavaScript 运行时环境
2. 干什么:
   让 JavaScript 可以在服务端运行，脱离了浏览器环境
3. 特点:
   非阻塞 I/O 模型
   事件驱动
   轻量高效

### node 为什么是多线程的

node 的设计思想是利用事件循环和非阻塞 I/O 来实现高并发，而不是利用多线程 v8 引擎本身也是单线程的

### nodejs 的优点和缺点

1. 优点:
   适合 I/O 密集型应用
   处理高并发场景更佳
2. 缺点:
   不适合 cpu 密集型应用
   只运行单核 cpu，不能充分利用 cpu
   可靠性低，中间有崩溃，整个系统将会崩溃

### node 的非阻塞 I/O 是什么

1. 是什么:
   当 node 执行 IO 操作时（文件读取，网络请求等）程序不会等待结果返回，而是立即返回并执行其他程序，
   等到处理完成通过回调函数返或 Promi 回结果
2. 好处:
   提高了程序的吞吐量和响应速度

# 功能和作用

### 是什么回调地狱，怎么解决

1. 回调地狱:
   当多个相互依赖的异步操作时，会形成层层嵌套的回调函数，代码难以开发和维护
2. 怎么解决:
   Promise: 使用 .then().catch() 链式调用，将异步操作扁平化。
   Async/Await: 基于 Promise，以同步的方式编写异步代码，代码可读性更高。

### nodejs 有几种定时器

setTimeout
setInterval
setImmediate

### Buffer 作用

二进制处理

### node.js 中的缓冲区是什么？如何使用缓冲区处理二进制数据

1. 缓冲区用于处理二进制数据的临时储存区
2. 使用 Buffer 创建和操作缓冲区
3. 缓冲区可以做什么:
   处理文件读取
   网络通信
   加密解密操作

### 什么是中间件，如何使用

1. 中间件是在请求和响应之间执行的函数，用于处理 HTTP 的请求和响应
2. 在 node 中使用 express 等 web 框架使用
3. 中间件可以干什么:
   处理身份验证
   日志记录
   错误处理等任务

# 其他 部署相关

### 什么是包管理器

1. 包管理工具是用于管理和安装各种软件包（库，框架，工具）的工具
2. nodejs 中最常见的包管理工具是 npm
3. npm 作用:
   在项目中安装，更新，删除依赖项
   发布，共享自己的软件包

### npm insatall vs npm ci

1. npm install:
   会根据` package.json` 中的依赖范围（例如 ^1.0.0）安装最新兼容版本。
   如果存在 `package-lock.json` 会优先按照其中记录的版本安装。
   会更新 `package-lock.json`。
2. npm ci (clean install):
   必须在有 `package-lock.json` 的项目中使用。
   会精确地安装 `package-lock.json` 中指定的版本，而不是根据 package.json 的范围。
   如果 `package-lock.json` 与 package.json 不一致，会报错。
   安装前会删除 `node_modules` 目录，确保一个干净的安装。

### nodejs 一般怎么部署上线

1. 单机适合 PM2(适合中小项目，用户量不大)
2. docker

k8OcZMudQJd2lQQs
