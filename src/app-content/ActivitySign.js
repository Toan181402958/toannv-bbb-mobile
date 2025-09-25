import React, { createContext, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import * as Keychain from 'react-native-keychain';
import ActivitySignQueries from '../components/custom-drawer/queries';

const ActivitySignContext = createContext();

export const ActivitySignProvider = ({ children }) => {
  const [dispatchSendActivitySign] = useMutation(
    ActivitySignQueries.USER_SEND_ACTIVITY_SIGN
  );

  useEffect(() => {
    const intervalTime = 20 * 60 * 1000;

    const executeMutation = async () => {
      await dispatchSendActivitySign();
      await Keychain.setGenericPassword('key', Date.now().toString(), {
        service: 'lastExecution',
      });
    };

    const startTimer = async () => {
      const creds = await Keychain.getGenericPassword({
        service: 'lastExecution',
      });
      const lastExecution = creds?.password ? Number(creds.password) : null;

      const now = Date.now();
      const timeSinceLastExecution = lastExecution
        ? now - lastExecution
        : intervalTime;

      if (timeSinceLastExecution >= intervalTime) {
        await executeMutation();
      }

      const interval = setInterval(
        executeMutation,
        intervalTime - (timeSinceLastExecution % intervalTime)
      );
      return () => clearInterval(interval);
    };

    startTimer();
  }, [dispatchSendActivitySign]);

  return (
    <ActivitySignContext.Provider value={{}}>
      {children}
    </ActivitySignContext.Provider>
  );
};
