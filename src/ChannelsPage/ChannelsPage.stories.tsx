import React, { useEffect } from 'react';
import EkoClient, { ChannelRepository, _changeSDKDefaultConfig } from 'eko-sdk';

import ChannelsPage from './index';

export default {
  title: 'ChannelsPage',
};

_changeSDKDefaultConfig({
  ws: { endpoint: 'https://api.staging.ekomedia.technology' },
  http: { endpoint: 'https://api.staging.ekomedia.technology' },
});

// TODO do only once
try {
  // Connect to EkoClient with apiKey
  const client = new EkoClient({ apiKey: 'b3bee858328ef4344a308e4a5a091688d05fdee2be353a2b' });
  // Register Session with EkoClient with userId and display name
  client.registerSession({
    userId: 'Web-Test',
    displayName: 'Web-Test',
  });
} catch (e) {
  console.log(e);
}

export const Channels = () => <ChannelsPage theme="primary" />;
