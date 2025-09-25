import Module from './module';
import {
  addMeeting,
  removeMeeting,
  editMeeting,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/meeting';
import { store } from '../../../store/redux/store';

const MEETING_TOPIC = 'meetings';

export class MeetingModule extends Module {
  constructor(messageSender) {
    super(MEETING_TOPIC, messageSender);
  }

  _add(msgObj) {
    return store.dispatch(
      addMeeting({
        meetingObject: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removeMeeting({
          meetingObject: msgObj,
        })
      );
    }

    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editMeeting({
        meetingObject: msgObj,
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
