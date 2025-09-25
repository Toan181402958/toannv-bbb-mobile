import Module from './module';
import { store } from '../../../store/redux/store';
import {
  addSlide,
  removeSlide,
  editSlide,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/slides';

const SLIDES_TOPIC = 'slides';

export class SlidesModule extends Module {
  constructor(messageSender) {
    super(SLIDES_TOPIC, messageSender);
  }

  _add(msgObj) {
    // return store.dispatch(
    //   addSlide({
    //     slideObject: msgObj,
    //   })
    // );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      // return store.dispatch(
      //   removeSlide({
      //     slideObject: msgObj,
      //   })
      // );
    }

    return false;
  }

  _update(msgObj) {
    // return store.dispatch(
    //   editSlide({
    //     slideObject: msgObj,
    //   })
    // );
  }

  _subscriptionStateChanged(newState) {
    return store.dispatch(readyStateChanged(newState));
  }

  _cleanupStaleData(subscriptionId) {
    return store.dispatch(cleanupStaleData(subscriptionId));
  }
}
