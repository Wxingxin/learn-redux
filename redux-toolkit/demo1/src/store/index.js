import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./modules/counterStore";
import channelReducer from './modules/channelStore'


//create root store
const store = configureStore({
  reducer:{
    counter: counterReducer,
    channel: channelReducer
  }
})

export default store