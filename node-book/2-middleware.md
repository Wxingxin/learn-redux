# 应用级中间件

### 特定中间件

```js
// 解析 JSON 格式的请求体
app.use(express.json());
// 解析 URL-encoded 格式的请求体（例如 HTML 表单提交）
app.use(express.urlencoded({ extended: true }));
```

### 通用中间件

```js
app.use((req, res, next) => {
  console.log(`${new Date()}`);
  next();
});
```

### 路径限制中间件

```js
app.use("/user/1", (req, res, next) => {
  console.log("user/i");
  next();
});
```

### 自定义应用级中间件

```js
// 这个中间件会记录每个请求的到达时间，并将其添加到请求对象上
// 然后将控制权传递给下一个中间件或路由处理函数
const requestLogger = (req, res, next) => {
  // 1. 执行任何代码：记录请求信息
  const requestTime = new Date();
  console.log(
    `[${requestTime.toLocaleString()}] 收到请求: ${req.method} ${req.url}`
  );

  // 2. 修改请求和响应对象：例如，将请求时间添加到 req 对象上
  req.requestTime = requestTime;

  // 3. 调用 next()：将控制权传递给管道中的下一个中间件或路由处理函数
  next();
};

// --- 使用自定义的应用级中间件 ---
// app.use() 方法将这个中间件应用到 Express 应用中
// 由于没有指定路径，它会对所有进入 Express 应用的请求生效（全局中间件）
app.use(requestLogger);
```

### 路由中间件

```bash
project/
├── routes/
│   ├── user.js
│   └── product.js
├── app.js
```

```js
//user.js
const express = require("express");
const router = express.Router();
// 中间件函数
function logTime(req, res, next) {
  console.log("Time:", Date.now());
  next(); // 别忘了调用 next()
}
// 应用于路由 /user
router.use("/user", logTime);
// 定义具体路由
router.get("/user", (req, res) => {
  res.send("User Home Page");
});
module.exports = router;

//index.js
const userRouter = require("./routes/user"); // 假设上面保存在 routes/user.js
app.use("/", userRouter);
```

### 使用中间件

```js
//一个中间件
function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).send("Access denied");
  }
}

router.get("/admin", isAdmin, (req, res) => {
  res.send("Admin page");
});

//二个中间件
router.get("/profile", [checkLogin, loadUserData], (req, res) => {
  res.send(`Welcome, ${req.user.name}`);
});
```

# 错误处理中间件

# 第三方中间件

### 基本使用

1. 安装响应的中间件

```bash
npm install <package-name>
# 或者
yarn add <package-name>
```

2. 在你的 Express 应用文件中使用 require() 或 import 语句导入已安装的中间件。

```js
const middlewareName = require("package-name");
```

3.

```js
app.use(middlewareName()); // 如果中间件是函数并需要初始化
app.use(middlewareName); // 如果中间件是一个可以直接使用的函数
```

### 常见的应用级中间件

###### morgan

1. 用途
   一个 HTTP 请求日志中间件，可以方便地记录所有进入服务器的请求信息，非常适合开发调试和生产监控。
2. 安装
   `npm install morgan`
3. 使用

```js
const morgan = require("morgan");
app.use(morgan("dev")); // 'dev' 是一种预定义的日志格式
```

###### helmet

1. 用途
   通过设置各种 HTTP 头部来帮助保护你的 Express 应用免受常见的 Web 漏洞（如 XSS、内容安全策略违规等）。
2. 安装
   `npm install helmet`
3. 使用

```js
const helmet = require("helmet");
app.use(helmet()); // 启用所有默认的头部保护
```

###### cors

1. 用途
   一个用于处理 CORS (Cross-Origin Resource Sharing) 的中间件。当你的前端应用和后端 API 不在同一个域名下时，就需要配置 CORS 允许跨域请求。
2. 安装
   `npm install cors`
3. 使用

```js
const cors = require("cors");
app.use(cors()); // 允许所有域名的跨域请求
// 或者配置特定来源：
// app.use(cors({ origin: 'http://localhost:8080' }));
```

###### dotenv

1. 用途
   从 .env 文件加载环境变量到 process.env。这对于管理敏感信息（如数据库连接字符串、API 密钥）和配置不同环境（开发、生产）非常有用。
2. 安装
   `npm install dotenv`
3. 使用

```js
require("dotenv").config(); // 尽早加载环境变量
// 现在可以通过 process.env.YOUR_VAR 访问 .env 文件中的变量
```

###### multer

1. 用途
   一个用于处理 multipart/form-data 类型数据的中间件，主要用于处理文件上传。
2. 安装
   `npm install multer`
3. 使用

```js
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // 设置文件上传的目标目录

app.post("/upload", upload.single("avatar"), (req, res) => {
  // req.file 包含上传的单个文件信息
  // req.body 包含其他表单字段
  res.send("文件上传成功！");
});
```
