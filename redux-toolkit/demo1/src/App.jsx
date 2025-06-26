import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import {
  decrement,
  increment,
  addToNumber,
} from "./store/modules/counterStore";
import { fetchChannelList } from "./store/modules/channelStore";

const App = () => {
  const { count } = useSelector((state) => state.counter);
  const { channelList } = useSelector((state) => state.channel);
  //get dispatch function
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchChannelList());
  }, [dispatch]);

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
      <button onClick={() => dispatch(addToNumber(10))}>increment 10</button>
      <ul>
        {channelList.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
