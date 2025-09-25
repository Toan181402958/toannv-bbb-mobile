import Module from './module';
import {
  addVideoStream,
  removeVideoStream,
  editVideoStream,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/video-streams';
import { store } from '../../../store/redux/store';

const VIDEO_STREAMS_TOPIC = 'video-streams';

export class VideoStreamsModule extends Module {
  constructor(messageSender) {
    super(VIDEO_STREAMS_TOPIC, messageSender);
  }

  _add(msgObj) {
    return store.dispatch(
      addVideoStream({
        videoStreamObject: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removeVideoStream({
          videoStreamObject: msgObj,
        })
      );
    }

    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editVideoStream({
        videoStreamObject: msgObj,
      })
    );
  }

  _subscriptionStateChanged(newState) {
    return store.dispatch(readyStateChanged(newState));
  }

  _cleanupStaleData(subscriptionId) {
    return store.dispatch(cleanupStaleData(subscriptionId));
  }
}
