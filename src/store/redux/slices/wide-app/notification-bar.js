import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  isShow: false,
  profile: '',
  extraInfo: {},
  text: '',
};

const notificationBarSlice = createSlice({
  name: 'notificationBar',
  initialState,
  reducers: {
    show: (state) => {
      state.isShow = true;
    },
    hide: (state) => {
      state.isShow = false;
    },
    hideNotification: (state, action) => {
      if (!action.payload || action.payload === state.profile) {
        state.isShow = false;
        state.profile = '';
        state.extraInfo = {};
      }
    },

    // notification profiles
    setProfile: (state, action) => {
      switch (action.payload.profile) {
        case 'handsUp':
          state.isShow = true;
          state.profile = 'handsUp';
          state.text = 'mobileSdk.notificationBar.handsUp';
          state.extraInfo = action.payload.extraInfo;
          break;
        case 'recordingStarted':
          state.isShow = true;
          state.messageTitle = 'mobileSdk.notification.recordLabel';
          state.messageSubtitle = 'app.notification.recordingStart';
          state.icon = 'recording-stopped';
          break;
        case 'recordingStopped':
          state.isShow = true;
          state.messageTitle = 'mobileSdk.notification.recordLabel';
          state.messageSubtitle = 'app.notification.recordingPaused';
          state.icon = 'recording-stopped';
          break;
        default:
      }
    },
  },
});

const notificationQueue = [];
export const showNotificationWithTimeout = createAsyncThunk(
  'notificationBar/setProfile',
  async (params, thunkAPI) => {
    if (notificationQueue.length === 0) {
      notificationQueue.push(params.profile);
      while (notificationQueue.length !== 0) {
        params.profile = notificationQueue[0];
        thunkAPI.dispatch(setProfile({ profile: params.profile }));

        await new Promise((resolve) => setTimeout(resolve, 5000));
        notificationQueue.shift();
        thunkAPI.dispatch(hideNotification());
      }
    } else {
      notificationQueue.push(params.profile);
    }
  }
);

export const { show, hide, setProfile, hideNotification } =
  notificationBarSlice.actions;
export default notificationBarSlice.reducer;
