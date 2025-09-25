import Module from './module';
import { store } from '../../../store/redux/store';
import {
  addPresentation,
  removePresentation,
  editPresentation,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/presentations';

const PRESENTATION_TOPIC = 'presentations';

export class PresentationsModule extends Module {
  constructor(messageSender) {
    super(PRESENTATION_TOPIC, messageSender);
  }

  _add(msgObj) {
    return store.dispatch(
      addPresentation({
        presentationObject: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removePresentation({
          presentationObject: msgObj,
        })
      );
    }

    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editPresentation({
        presentationObject: msgObj,
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
