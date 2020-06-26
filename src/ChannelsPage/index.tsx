import React from 'react';
import useLiveObject from '../hooks/useLiveObject';
import styled from 'styled-components';

import EkoClient, {
  MessageRepository,
  ChannelRepository,
  ChannelMembershipRepository,
  EkoChannelType,
  EkoConnectionStatus,
  _changeSDKDefaultConfig,
} from 'eko-sdk';

const ChannelsListContainer = styled.div`
  background-color: white;
  border: 1px solid black;
  padding: 16px;
  width: 360px;
  text-align: center;
`;

// Instantiate Channel Repository
const channelRepo = new ChannelRepository();

const ChannelsList = () => {
  const channels = useLiveObject(() => channelRepo.allChannels(), []);

  return (
    <ChannelsListContainer>
      {channels.map(channel => (
        <div key={channel.channelId}>{channel.channelId}</div>
      ))}
    </ChannelsListContainer>
  );
};

export default ChannelsList;
