import { store } from '../../../store/redux/store';
import Module from './module';
import {
  addGroupChat,
  editGroupChat,
  removeGroupChat,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/group-chat';

const GROUP_CHAT_TOPIC = 'group-chat';

export class GroupChatModule extends Module {
  constructor(messageSender) {
    super(GROUP_CHAT_TOPIC, messageSender);
  }

  _add(msgObj) {
    return store.dispatch(
      addGroupChat({
        groupChatObject: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removeGroupChat({
          groupChatObject: msgObj,
        })
      );
    }

    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editGroupChat({
        groupChatObject: msgObj,
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
