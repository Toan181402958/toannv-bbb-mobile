import Module from './module';
import { store } from '../../../store/redux/store';
import {
  addPad,
  removePad,
  editPad,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/pads';

const PADS_TOPIC = 'pads';

export class PadsModule extends Module {
  constructor(messageSender) {
    super(PADS_TOPIC, messageSender);
  }

  _add(msgObj) {
    return store.dispatch(
      addPad({
        padObject: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removePad({
          padObject: msgObj,
        })
      );
    }

    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editPad({
        padObject: msgObj,
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
