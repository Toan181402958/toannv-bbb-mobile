import Module from './module';
import {
  addGuestUser,
  removeGuestUser,
  editGuestUser,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/guest-users';
import { store } from '../../../store/redux/store';

const GUEST_USERS_TOPIC = 'guestUsers';

export class GuestUsersModule extends Module {
  constructor(messageSender) {
    super(GUEST_USERS_TOPIC, messageSender);
  }

  _add(msgObj) {
    return store.dispatch(
      addGuestUser({
        userObject: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removeGuestUser({
          userObject: msgObj,
        })
      );
    }

    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editGuestUser({
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
