import Module from './module';
import { store } from '../../../store/redux/store';
import {
  addUploadedFile,
  editUploadedFile,
  removeUploadedFile,
  readyStateChanged,
  cleanupStaleData,
} from '../../../store/redux/slices/uploaded-file';

const UPLOADED_FILE_TOPIC = 'uploaded-file';

export class UploadedFileModule extends Module {
  constructor(messageSender) {
    super(UPLOADED_FILE_TOPIC, messageSender);
  }

  _add(msgObj) {
    store.dispatch(
      addUploadedFile({
        uploadedFileObj: msgObj,
      })
    );
  }

  _remove(msgObj) {
    if (!this._ignoreDeletions) {
      return store.dispatch(
        removeUploadedFile({
          uploadedFileObj: msgObj,
        })
      );
    }
    return false;
  }

  _update(msgObj) {
    return store.dispatch(
      editUploadedFile({
        uploadedFileObj: msgObj,
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
