import { createSlice } from "@reduxjs/toolkit";

const bearStore = createSlice({
  name: bear,
  initialState: {
    bear: 88,
    bearHome: 2022,
  },
  reducers: {
    incremantBears(state, actions) {
      state.bear = state.bear + actions.payload;
    },
  },
});

const  {incremantBears} = bearStore.actions
const bearReducers = bearStore.reducer

export {incremantBears}
export default bearReducers