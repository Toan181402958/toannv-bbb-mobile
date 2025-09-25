// import MeetingClientSettings from '../../types/meetingClientSettings';
import meetingClientSettingsInitialValues from './initial-values/meetingClientSettings';
import createUseLocalState from './createUseLocalState';

const initialMeetingSeetings = meetingClientSettingsInitialValues;
const [useMeetingSettings, setMeetingSettings] = createUseLocalState(
  initialMeetingSeetings
);

export default useMeetingSettings;
export { setMeetingSettings };
