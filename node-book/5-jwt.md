`npm install express mongoose bcryptjs jsonwebtoken dotenv`

```js
project/
│
├── server.js
├── config/
│   └── db.js         // 数据库连接
├── models/
│   └── User.js       // 用户模型
├── routes/
│   └── auth.js       // 路由
└── middleware/
    └── auth.js       // JWT 认证中间件
```

### 配置基础环境

```js
PORT=5000
MONGO_URI=mongodb://localhost:27017/login
JWT_SECRET=your_jwt_secret_key
```

### 配置 express 链接 mongodb

```js
//db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 配置用户模型

```js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
```

###

```js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
```

`const token = req.header('Authorization')?.split(' ')[1]`

1. `req.header("Authorization")`
   这是 Express 提供的方式，用来从请求头中获取名为 "Authorization" 的字段。

例如客户端发送的请求头中可能包含：

```makefile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

2. ?.split(" ")
   这使用了可选链操作符（?.），它的含义是：如果 req.header("Authorization") 存在，就继续执行 .split(" ")，否则返回 undefined

3. .split(" ")[1]
   split(" ") 会把字符串按空格切成数组：

```js
"Bearer eyJhbGciOiJIUzI1NiIsInR...".split(" ");
// 结果: ["Bearer", "eyJhbGciOiJIUzI1NiIsInR..."]
```

4.  最终提取的
    这段代码是为了从下面这样的请求头中提取出 JWT：

```js
Authorization: Bearer <token>
```

提取完的 token 就可以用来做 JWT 的验证，例如用 jwt.verify()。

### const decoded = jwt.verify(token, process.env.JWT_SECRET);

| 部分                     | 含义                                  |
| ------------------------ | ------------------------------------- |
| `jwt.verify()`           | 验证并解码 token                      |
| `token`                  | 从客户端请求头拿到的 JWT              |
| `process.env.JWT_SECRET` | 加密用的私钥，必须与签发 token 时一致 |
| `decoded`                | 解码后的对象（payload）               |

1. jwt.verify(token, secretOrPublicKey)
   来自于 jsonwebtoken 库（通常通过 const jwt = require("jsonwebtoken") 引入）。

用来“验证”JWT 是否有效（是否被篡改、是否过期）。

参数：
token：客户端传来的 JWT，通常放在请求头的 Authorization: Bearer <token> 中。

process.env.JWT_SECRET：你的密钥（secret key），用于验证签名是否正确。签名验证成功才能信任这个 token 的内容。

返回值：
如果 token 合法且未过期，返回的是被签发时的 payload（通常是你在 jwt.sign() 时传入的对象）

### req.user = decoded.user OR req.user = decoded

提取查看
`console.log(decoded)`

| 写法                      | 适用场景                            |
| ------------------------- | ----------------------------------- |
| `req.user = decoded`      | JWT 里直接存的是用户对象            |
| `req.user = decoded.user` | JWT 里是 `{ user: {...} }` 这种结构 |

# routes/auth.js

### register

这段代码是使用 Express + MongoDB + JWT 实现的**注册接口**。它的主要流程是：

1. **检查用户是否存在**
2. **加密用户密码**
3. **保存用户信息**
4. **生成 JWT 并返回给客户端**

下面逐行解释：

---

```js
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
```

- 注册接口的 POST 路由。
- 从请求体中解构出 `username` 和 `password` 字段。

---

```js
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: "User already exists" });
```

- 在数据库中查找是否有相同用户名的用户。
- 如果已经存在，就返回 400 状态码和错误提示。

---

```js
const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash(password, salt);
```

- 使用 bcrypt 生成盐（加密时的“干扰因子”）。
- 对密码进行加盐哈希处理，防止明文密码泄露。

---

```js
user = new User({ username, password: hashed });
await user.save();
```

- 创建新用户对象，并将加密后的密码存入。
- 保存到 MongoDB 数据库中。

---

```js
const payload = { user: { id: user.id } };
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: "1h",
});
```

- 创建 JWT 的负载（payload），只包含用户的 id。
- 使用 `jwt.sign()` 对其进行加密，使用的是 `.env` 中的密钥 `JWT_SECRET`。
- 设置过期时间为 1 小时。

---

```js
res.json({ token });
```

- 向客户端返回生成好的 token，客户端保存后续请求可用。

---

```js
  } catch (err) {
    res.status(500).send("Server error");
  }
});
```

- 如果中间出错（比如数据库故障等），返回 500 错误。

### routes/auth.js

    1. 客户端发送 `username` 和 `password` 到 `/login`
    2. 服务端验证用户是否存在
    3. 若存在则校验密码是否匹配
    4. 若验证成功则生成 JWT token
    5. 返回 token 给客户端

---

##### 🚪 路由定义

```js
router.post("/login", async (req, res) => {
```

- 定义了一个 POST 路由 `/login`。
- 使用 `async` 函数，因为后面有异步数据库操作。

---

###### 📦 提取用户输入

```js
const { username, password } = req.body;
```

- 从请求体中解构出用户名和密码。
- 前提是请求头中 `Content-Type: application/json` 并正确使用了中间件 `express.json()`。

---

###### 🔍 检查用户是否存在

```js
const user = await User.findOne({ username });
if (!user) return res.status(400).json({ msg: "Invalid Credentials" });
```

- 使用 Mongoose 查询数据库中是否存在该用户名的用户。
- 若不存在，返回 400 状态码，并提示 **"Invalid Credentials（无效凭证）"**。

---

###### 🔐 验证密码是否正确

```js
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });
```

- `bcrypt.compare` 将用户输入的明文密码与数据库中存储的加密密码进行比较。
- 若不匹配，仍返回 "Invalid Credentials"，避免泄露用户名或密码错误的具体信息。

---

###### 🪪 生成 JWT 令牌

```js
const payload = { user: { id: user.id } };
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: "1h",
});
```

- 构造一个包含用户 id 的 `payload`。
- 使用密钥（保存在 `.env` 文件中的 `JWT_SECRET`）生成签名的 JWT。
- `expiresIn: "1h"` 表示该 token 有效期为 1 小时。

---

###### 📤 返回 token 给客户端

```js
res.json({ token });
```

- 将 token 返回给前端，后续前端在请求受保护资源时应在请求头中带上该 token（通常在 `Authorization` 字段中）。

---

###### ⚠️ 错误处理

```js
} catch (err) {
  res.status(500).send("Server error");
}
```

- 捕捉整个流程中的异常，防止服务崩溃。
- 返回 500 状态码表示服务器内部错误。
