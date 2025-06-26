import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios'


const channelStor = createSlice({
  name: 'channel',
  initialState: {
    channelList: [],
  },
  reducers: {
    setChannels(state, actions) {
      state.channelList = actions.payload;
    },
  },
});

const { setChannels } = channelStor.actions;

const fetchChannelList = () => {
  return async (dispatch) => {
    const res = await axios.get("http://geek.itheima.net/v1_0/channels");
    dispatch(setChannels(res.data.data.channels));
  };
};

export { fetchChannelList };

const reducer = channelStor.reducer;

export default reducer;
