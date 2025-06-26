import { createSlice } from "@reduxjs/toolkit";

const counterStore = createSlice({
  name: "counter",
  //initial state
  initialState: {
    count: 0,
  },
  //change state function
  reducers: {
    increment(state) {
      state.count = state.count + 1;
    },
    decrement(state) {
      state.count = state.count - 1;
    },
    addToNumber(state,actions) {
      state.count = state.count + actions.payload
    }
  },
});

const { increment, decrement,addToNumber } = counterStore.actions;

const counterReducer = counterStore.reducer;

export { increment, decrement, addToNumber };
export default counterReducer;
