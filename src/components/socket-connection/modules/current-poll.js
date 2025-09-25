import Module from './module';
import { store } from '../../../store/redux/store';
import {
  addCurrentPoll,
  editCurrentPoll,
  removeCurrentPoll,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/current-poll';

const CURRENT_POLL_TOPIC = 'current-poll';

export class CurrentPollModule extends Module {
  constructor(messageSender) {
    super(CURRENT_POLL_TOPIC, messageSender);
  }

  // TODO FIX THIS
  onConnected() {
    this.topics.forEach((topic) => {
      this.subscribeToCollection(
        topic,
        store.getState().currentPollCollection.secretPoll,
        true
      );
    });
  }

  _add(msgObj) {
    return store.dispatch(
      addCurrentPoll({
        currentPollObject: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removeCurrentPoll({
          currentPollObject: msgObj,
        })
      );
    }

    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editCurrentPoll({
        currentPollObject: msgObj,
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
