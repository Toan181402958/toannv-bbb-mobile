import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';
import { store } from './store/redux/store';
// components
import InCallManagerController from './app-content/in-call-manager';
// import NotifeeController from './app-content/notifee';
import LocalesController from './app-content/locales';
import AppStatusBar from './components/status-bar';
import MainNavigator from './screens/main-navigator';
import { disconnectLiveKitRoom } from './services/livekit';
// inject stores
import { injectStore as injectStoreVM } from './services/webrtc/video-manager';
import { injectStore as injectStoreSM } from './services/webrtc/screenshare-manager';
import { injectStore as injectStoreAM } from './services/webrtc/audio-manager';
// constants
import './utils/locales/i18n';
import Colors from './constants/colors';

const injectStore = () => {
  injectStoreVM(store);
  injectStoreSM(store);
  injectStoreAM(store);
};

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.blueBackgroundColor,
  },
};

const leaveSessionFactory = (callback = () => {}) => {
  return () => {
    disconnectLiveKitRoom({ final: true });
    callback();
  };
};
const defaultJoinURL = () =>
  'https://office.sopen.vn/bigbluebutton/api/join?fullName=User+115343&meetingID=random-1202382&password=mp&redirect=true&checksum=906e6031c44bdde989669ce1319c6df8f6903b8c';

const App = (props) => {
  const { joinURL, defaultLanguage, onLeaveSession } = props;
  const _joinURL = joinURL || defaultJoinURL();
  const _onLeaveSession = leaveSessionFactory(onLeaveSession);

  useEffect(() => {
    injectStore();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer theme={MyTheme} independent>
        <OrientationLocker orientation={PORTRAIT} />
        <MainNavigator
          {...props}
          joinURL={_joinURL}
          onLeaveSession={_onLeaveSession}
        />
        <AppStatusBar />
        <InCallManagerController />
        <LocalesController defaultLanguage={defaultLanguage} />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
