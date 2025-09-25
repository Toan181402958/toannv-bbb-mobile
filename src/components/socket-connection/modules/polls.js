import Module from './module';
import { store } from '../../../store/redux/store';
import { setProfile } from '../../../store/redux/slices/wide-app/modal';
import {
  addPoll,
  removePoll,
  editPoll,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/polls';

const POLLS_TOPIC = 'polls';

export class PollsModule extends Module {
  constructor(messageSender) {
    super(POLLS_TOPIC, messageSender);
  }

  _add(msgObj) {
    store.dispatch(
      setProfile({
        profile: 'receive_poll',
        extraInfo: msgObj.fields,
      })
    );
    store.dispatch(
      addPoll({
        pollObject: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removePoll({
          pollObject: msgObj,
        })
      );
    }

    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editPoll({
        pollObject: msgObj,
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
