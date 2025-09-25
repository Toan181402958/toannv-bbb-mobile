import Module from './module';
import {
  addScreenshare,
  removeScreenshare,
  editScreenshare,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/screenshare';
import { store } from '../../../store/redux/store';

const SCREENSHARES_TOPIC = 'screenshare';

export class ScreenshareModule extends Module {
  constructor(messageSender) {
    super(SCREENSHARES_TOPIC, messageSender);
  }

  _add(msgObj) {
    return store.dispatch(
      addScreenshare({
        screenshareObject: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removeScreenshare({
          screenshareObject: msgObj,
        })
      );
    }

    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editScreenshare({
        screenshareObject: msgObj,
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
