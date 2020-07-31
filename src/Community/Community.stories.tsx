import React, { useEffect } from 'react';
import EkoClient, { ChannelRepository, _changeSDKDefaultConfig } from 'eko-sdk';

import Community from './index';
import UiKitProvider from '../UiKitProvider';

export default {
  title: 'Community',
};

export const CommunityHome = () => <Community />;
