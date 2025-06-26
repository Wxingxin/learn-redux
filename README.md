# learn-redux

learn redux and redux-toolkit

# state

是什么？ Store 是 Redux 应用中存储所有**状态（State）**的单一对象。它是整个应用状态的“单一真相之源”。一个 Redux 应用通常只有一个 Store。

# Action (描述“发生了什么”的普通对象)

1. 是什么？
   Action 是一个普通的 JavaScript 对象，它描述了应用程序中发生了什么事情。它是你与 Store 沟通的唯一方式。
2. 作用：
   带有 type 属性，这个 type 通常是一个字符串常量，用于描述 Action 的类型（例如：'ADD_TODO'、'USER_LOGGED_IN'）。
   可以包含 payload（负载），即需要随 Action 传递的数据（例如：添加待办事项的文本内容、用户登录后的用户信息）。

# Reducer (纯函数，根据 Action 改变状态)

1. 是什么？
   Reducer 是一个纯函数，它接收当前的 State 和一个 Action 作为参数，然后返回一个新的 State。
2. 作用：
   唯一能够修改 Redux Store 中状态的地方。
   根据接收到的 Action 类型，决定如何更新状态。
   纯函数原则：
   在给定相同的输入（State 和 Action）时，永远返回相同的输出。
   不产生任何副作用（Side Effects），例如不修改外部变量、不进行网络请求、不修改原始的 State 对象（而是返回一个新的 State 对象）。

# react-redux (连接 React 组件与 Redux Store)
是什么？ 这是一个官方的 React 绑定库，用于将 Redux Store 连接到 React 组件。
作用：
Provider 组件：包裹整个 React 应用，使 Store 对所有子组件可用。
useSelector 钩子：在函数组件中从 Store 中提取状态。
useDispatch 钩子：在函数组件中获取 dispatch 函数来派发 Action。