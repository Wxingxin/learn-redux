#

```text
MongoDB数据库
     ↑
Model（模型）👈 由 Schema（结构）创建
     ↑
Schema（定义数据结构和约束）
     ↑
Mongoose 连接（connect）
```

#

链接

```js
// --- 数据库连接 ---
const mongoose = require("mongoose");
const DB_URI = "mongodb://localhost:27017/gmini"; // 你的 MongoDB 连接URI
mongoose
  .connect(DB_URI)
  .then(() => console.log("MongoDB 连接成功！"))
  .catch((err) => console.error("MongoDB 连接失败：", err));
```

数据模型 (Schema)

```js
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  age: Number,
  createAt: {
    type: Date,
    default: Date.now,
  },
});
```

### Model

```js
const User = mongoose.model("User", userSchema);
```

User 变量是一个 Mongoose Model（模型）
Mongoose 会在 MongoDB 中**自动创建**一个名为 users 的集合（注意自动小写+s）

1. 它代表了 MongoDB 数据库中的 users 集合
2. 它提供了与这个集合交互的所有静态方法，比如 User.find()（查找所有用户）、User.findOne()（查找一个用户）、User.updateOne()（更新一个用户）、User.deleteOne()（删除一个用户）等等。
3. 它也是一个构造函数，用于创建新的用户文档实例。

```js
const newUser = new User({
  name: "Alice",
  age: 22,
  email: "alice@example.com",
});
```

1. **类比**：
   如果 User 是“用户工厂”，那么 newUser 就是工厂生产出来的一个具体的“用户产品”（如果 User 是一个“用户类”，那么 newUser 就是这个类的一个“具体对象/实例”）
2. **职责**：
   newUser 代表了内存中一个即将要存入数据库的**单个用户文档**。
   它包含了这个用户的具体数据（例如 name: 'Alice', age: 22）。
   它继承了 User Model 上定义的 Schema 属性和方法（比如你可以在 newUser 上调用 newUser.save()）。

# 与 mongobd 交互

### 存入 mongodb

1. 当你创建了 newUser 这个文档实例之后，它仅仅存在于你应用程序的内存中。它还**没有被写入到 MongoDB 数据库**。
2. `await newUser.save()` 是什么？

newUser.save() 方法是 newUser 这个文档实例特有的方法。它的作用是：
根据 User Model 关联的 userSchema 定义，对 newUser 实例中的数据进行验证（例如，name 和 email 是否存在且符合类型）。
如果数据验证通过，它会将 newUser 这个内存中的文档实例持久化（保存）到 MongoDB 数据库的 users 集合中。
await 关键字表示这是一个异步操作，程序会暂停执行直到保存操作完成（成功或失败）。

