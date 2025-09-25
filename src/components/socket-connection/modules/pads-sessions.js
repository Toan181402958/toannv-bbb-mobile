import Module from './module';
import {
  addPadSession,
  editPadSession,
  removePadSession,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/pads-sessions';
import { store } from '../../../store/redux/store';

const PADS_SESSIONS_TOPIC = 'pads-sessions';

export class PadsSessionsModule extends Module {
  constructor(messageSender) {
    super(PADS_SESSIONS_TOPIC, messageSender);
  }

  _add(msgObj) {
    return store.dispatch(
      addPadSession({
        padSessionObject: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removePadSession({
          padSessionObject: msgObj,
        })
      );
    }

    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editPadSession({
        padSessionObject: msgObj,
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
