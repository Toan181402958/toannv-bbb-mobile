import Module from './module';
import {
  addVoiceUser,
  removeVoiceUser,
  editVoiceUser,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/voice-users';
import { store } from '../../../store/redux/store';

const VOICE_USERS_TOPIC = 'voiceUsers';

export class VoiceUsersModule extends Module {
  constructor(messageSender) {
    super(VOICE_USERS_TOPIC, messageSender);
  }

  _add(msgObj) {
    return store.dispatch(
      addVoiceUser({
        voiceUserObject: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removeVoiceUser({
          voiceUserObject: msgObj,
        })
      );
    }

    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editVoiceUser({
        voiceUserObject: msgObj,
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
