import Module from './module';
import {
  addUsersSettings,
  removeUsersSettings,
  editUsersSettings,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/users-settings';
import { store } from '../../../store/redux/store';

const USERS_SETTINGS_TOPIC = 'users-settings';

export class UsersSettingsModule extends Module {
  constructor(messageSender) {
    super(USERS_SETTINGS_TOPIC, messageSender);
  }

  _add(msgObj) {
    return store.dispatch(
      addUsersSettings({
        usersSettingsObject: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removeUsersSettings({
          usersSettingsObject: msgObj,
        })
      );
    }

    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editUsersSettings({
        usersSettingsObject: msgObj,
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
