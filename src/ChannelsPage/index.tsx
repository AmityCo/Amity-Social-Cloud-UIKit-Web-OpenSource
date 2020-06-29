import React, { useState, useEffect } from 'react';
import EkoClient, {
  MessageRepository,
  ChannelRepository,
  ChannelMembershipRepository,
  EkoChannelType,
  EkoConnectionStatus,
  _changeSDKDefaultConfig,
} from 'eko-sdk';

import { withCustomization } from '../hoks/customization';

import useLiveObject from '../hooks/useLiveObject';
import Channel from '../Channel';

import { ChannelsPageContainer, ChannelsListContainer, ChannelItemContainer } from './styles';

const channelRepo = new ChannelRepository();

const ChannelItem = ({ channelId, selected, onSelect }) => (
  <ChannelItemContainer onClick={() => onSelect(channelId)} selected={selected}>
    {channelId}
  </ChannelItemContainer>
);

const ChannelsList = () => {
  const [currentChannelId, setCurrenChannelId] = useState(null);

  const channels = useLiveObject(() => channelRepo.allChannels(), []);

  return (
    <ChannelsPageContainer>
      <ChannelsListContainer>
        {channels.map(channel => (
          <ChannelItem
            selected={currentChannelId === channel.channelId}
            onSelect={setCurrenChannelId}
            key={channel.channelId}
            {...channel}
          />
        ))}
      </ChannelsListContainer>
      {currentChannelId && <Channel key={currentChannelId} channelId={currentChannelId} />}
    </ChannelsPageContainer>
  );
};

export default withCustomization(ChannelsList);
