import { useEffect, useState } from 'react';
import { Client as ASCClient } from '@amityco/ts-sdk';

const useConnectionState = (initialStatus = undefined) => {
  const [isOnline, setIsOnline] = useState(
    initialStatus === undefined ? window.navigator.onLine ?? ASCClient.isConnected : initialStatus,
  );

  // Monitor with native connection status from browser,
  // because SDK is a bit delay to update session state sometime connection is disconnect already,
  // but session still struck in established state
  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true));
    return window.removeEventListener('online', () => setIsOnline(true));
  }, []);

  useEffect(() => {
    window.addEventListener('offline', () => setIsOnline(false));
    return window.removeEventListener('offline', () => setIsOnline(false));
  }, []);

  useEffect(() => {
    return ASCClient.onSessionStateChange(() => {
      setIsOnline(ASCClient.isConnected());
    });
  }, []);

  return isOnline;
};

export default useConnectionState;
