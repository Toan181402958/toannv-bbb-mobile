import Module from './module';
import {
  addUser,
  removeUser,
  editUser,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/users';
import { store } from '../../../store/redux/store';

const USERS_TOPIC = 'users';

export class UsersModule extends Module {
  constructor(messageSender) {
    super(USERS_TOPIC, messageSender);
  }

  _add(msgObj) {
    return store.dispatch(
      addUser({
        userObject: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removeUser({
          userObject: msgObj,
        })
      );
    }

    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editUser({
        userObject: msgObj,
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
