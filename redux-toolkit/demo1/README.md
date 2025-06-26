`yarn add @reduxjs/toolkit react-redux`
`yarn add axios`

# ReduxToolkit（RTK）是什么

1. －官方推荐编写 Redux 逻辑的方式，是一套工具的集合集，简化书写方式
2. 简化 store 的配置方式
3. 内置 immer 支持可变式状态修改
4. 内置 thunk 更好的异步创建

# react-redux-用来链接 Redux 和 React 组件的中间件

1. redux ----react-redux----(get state)->react component
2. redux <----react-redux----(updata state)--react component

# provider redux to react

```js
//redux
import store from "./store/index.js";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
```

```js
const counterStore = {
  // 1. name 属性：就是你传入的 name 值
  name: "counter",

  // 2. actions 属性：一个包含所有 action creator 函数的对象
  actions: {
    increment: function increment(payload) {
      // 这是一个自动生成的函数，当你调用它时
      // 它会返回一个 action 对象，例如：{ type: 'counter/increment', payload: undefined }
      // 如果你的 reducer 接受 payload，这里就会有
    },
    decrement: function decrement(payload) {
      // 类似 increment，返回 { type: 'counter/decrement', payload: undefined }
    },
  },

  // 3. reducer 属性：一个标准的 Redux reducer 函数
  reducer: function counterReducer(state = { count: 0 }, action) {
    // 这是一个标准的 Redux reducer 函数
    // 它会根据 action.type 来更新 state
    // 内部会处理 Immer 的逻辑，让你在 reducers 中“直接修改” state
    switch (action.type) {
      case "counter/increment":
        return {
          ...state,
          count: state.count + 1,
        };
      case "counter/decrement":
        return {
          ...state,
          count: state.count - 1,
        };
      default:
        return state;
    }
  },

  // 4. caseReducers 属性（内部使用，一般不直接访问）
  // 包含了你原始定义的 reducer 函数，但它们没有 action type 前缀
  // 供内部 reducer 属性使用
  caseReducers: {
    increment(state) {
      // 这个就是你原始定义的 increment 函数
      state.count = state.count + 1;
    },
    decrement(state) {
      // 这个就是你原始定义的 decrement 函数
      state.count = state.count - 1;
    },
  },

  // 5. getInitialState 方法（通常用于测试或特定场景）
  getInitialState: function getInitialState() {
    return {
      count: 0,
    };
  },
};
```

# 在组件中数据显式

```js
//component
const {count} = useSelector(state => state.counter)


// 整个 Redux store 的状态树 (`state`)
{
  // counterStore 的状态
  counter: {
    count: 0
  },
  // channelStore 的状态
  channel: {
    count: 0 // 如果 channelStore 也有一个名为 count 的属性
    // 或者 channelStore 的其他属性，例如：
    // name: '默认频道',
    // subscribers: 100
  },
  // ... 其他任何你可能有的 Redux 切片
}
```

```js
const { count } = useSelector((state) => state.counter);
//get dispatch function
const dispatch = useDispatch();
//使用 useDispatch 钩子来获取 dispatch 函数的引用。
//这个 dispatch 函数将被用于在用户交互时（例如点击按钮）发送 Redux action。
return (
  <div>
    <div>count : {count}</div>
    <button onClick={() => dispatch(increment())}>increment 1</button>

    <button
      onClick={() => {
        dispatch(decrement());
      }}
    >
      decrement 1
    </button>
  </div>
);
//当你调用 increment() 这个函数时，它会返回一个标准 Redux Action 对象。
//对于你的 counterStore，increment() 被调用后会返回这样一个简单的 JavaScript 对象：
// {
//   type: 'counter/increment'
// }

//当你调用 dispatch(actionObject) 时，你就是将刚刚由 increment() 创建的 Action 对象传递给 Redux Store。
```

