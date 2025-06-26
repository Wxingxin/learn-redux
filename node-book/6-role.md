

`npm install express express-session connect-mongo mongoose bcrypt`

在 **用户角色（User Roles）授权（Authorization）** 的系统中，不管是否使用 JWT，核心的工作流程大致相同。以下是一个典型的流程图和详细说明：

---

### 🔁 用户角色授权的完整工作流程

#### 步骤 1：用户注册（或由管理员创建）

* 用户提供注册信息（如用户名、密码、角色等）。
* 服务器将用户保存到数据库，并为其分配一个角色：

  * 常见角色有：`admin`、`editor`、`user`、`guest` 等。
* 示例数据库结构：

  ```js
  {
    username: "alice",
    password: "hashed_password",
    role: "admin"
  }
  ```

---

#### 步骤 2：用户登录

* 用户输入用户名和密码进行登录。
* 服务器验证凭证（如 bcrypt 验证密码）。
* 登录成功后：

  * 如果使用 JWT：生成包含角色的 token。
  * 如果不用 JWT：创建 Session，并在 Session 中保存角色信息。

---

#### 步骤 3：发起受限请求（如访问 /admin 页面）

* 用户尝试访问一个需要特定权限的资源。
* 系统读取当前用户的身份信息（从 token/session 中提取）：

  * 是否登录？
  * 角色是 `admin` 吗？

---

#### 步骤 4：角色权限判断（核心）

* 后端中间件或控制器进行角色判断：

  ```js
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: "Access denied" });
  }
  ```
* 根据角色做出以下决策：

  * ✅ 如果角色符合：允许访问。
  * ❌ 如果不符合：返回 403 Forbidden。

---

#### 步骤 5：资源返回或拒绝

* 如果授权成功，返回数据或页面。
* 如果失败，返回错误信息。

---

### ✅ 示例（基于 Session 的角色授权中间件）

```js
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).send("Not logged in");
    }
    if (req.session.user.role !== role) {
      return res.status(403).send("Access denied");
    }
    next();
  };
}

// 用法
app.get("/admin", requireRole("admin"), (req, res) => {
  res.send("Welcome Admin");
});
```

---

### 🧠 总结

| 步骤    | 说明                          |
| ----- | --------------------------- |
| 注册/创建 | 设置角色，如 `"user"`、`"admin"` 等 |
| 登录验证  | 检查用户名密码，并保留角色信息             |
| 请求访问  | 用户尝试访问受限资源                  |
| 检查权限  | 后端判断当前角色是否有权限               |
| 返回结果  | 有权限 → 允许；无权限 → 拒绝           |

如需，我可以给你提供完整的示例代码（带数据库、Session 登录和角色控制）。需要吗？

----------------------------------

不使用 JWT（JSON Web Token）实现简单的用户角色授权，你可以使用 **Session（会话）+ Cookie** 的方式，这种方式常用于传统 Web 应用。下面是一个完整的示例，演示如何使用 Express、MongoDB、Session 和角色字段来控制访问权限。

---

### 🧱 技术栈

* Express
* express-session
* connect-mongo（将 session 存入 MongoDB）
* MongoDB + mongoose

---

### 📦 安装依赖

```bash
npm install express express-session connect-mongo mongoose bcrypt
```

---

### 📁 项目结构（简单示意）

```
project/
├── server.js
├── models/
│   └── User.js
└── routes/
    └── auth.js
```

---

### 🔐 User 模型（models/User.js）

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
});

module.exports = mongoose.model("User", userSchema);
```

---

### 🔄 认证 & 授权中间件

```js
// middlewares/auth.js
exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.status(401).json({ msg: "Not logged in" });
};

exports.isAdmin = (req, res, next) => {
  if (req.session.user?.role === "admin") return next();
  res.status(403).json({ msg: "Forbidden: Admins only" });
};
```

---

### 🔑 路由：注册 / 登录 / 获取数据（routes/auth.js）

```js
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// 注册
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ msg: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed, role });
  await user.save();
  res.json({ msg: "Registered" });
});

// 登录
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ msg: "No such user" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  req.session.user = { id: user._id, role: user.role };
  res.json({ msg: "Logged in", role: user.role });
});

// 登出
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ msg: "Logged out" });
});

module.exports = router;
```

---

### 🧠 使用中间件进行权限控制（server.js）

```js
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const authRoutes = require("./routes/auth");
const { isAuthenticated, isAdmin } = require("./middlewares/auth");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/roleAuth");

app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/roleAuth" }),
  cookie: { maxAge: 3600000 }
}));

app.use("/auth", authRoutes);

// 👤 普通用户和管理员都可访问
app.get("/profile", isAuthenticated, (req, res) => {
  res.json({ msg: "User Profile", user: req.session.user });
});

// 🔒 只有管理员可访问
app.get("/admin", isAuthenticated, isAdmin, (req, res) => {
  res.json({ msg: "Admin Panel" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

---

### 🧪 测试流程

1. **注册普通用户**（POST `/auth/register`）：

   ```json
   {
     "username": "user1",
     "password": "123456",
     "role": "user"
   }
   ```

2. **注册管理员用户**（POST `/auth/register`）：

   ```json
   {
     "username": "admin",
     "password": "123456",
     "role": "admin"
   }
   ```

3. **登录后访问 `/profile` 与 `/admin`**，普通用户访问 `/admin` 会被拒绝。

---

需要我用这个代码做一个更完整的界面或功能扩展吗？
                                                          