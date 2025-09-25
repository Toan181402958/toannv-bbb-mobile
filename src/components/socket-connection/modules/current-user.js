import Module from './module';
import { store } from '../../../store/redux/store';
import {
  addCurrentUser,
  editCurrentUser,
  removeCurrentUser,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/current-user';

const CURRENT_USER_TOPIC = 'current-user';

export class CurrentUserModule extends Module {
  constructor(messageSender) {
    super(CURRENT_USER_TOPIC, messageSender);
  }

  _add(msgObj) {
    //inject userData to userSettings
    const customData = msgObj.fields.userdata;
    if (customData && Object.keys(customData).length > 0) {
      this.messageSender.makeCall('addUserSettings', [customData]);
    }
    return store.dispatch(
      addCurrentUser({
        currentUserObject: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removeCurrentUser({
          currentUserObject: msgObj,
        })
      );
    }

    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editCurrentUser({
        currentUserObject: msgObj,
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
