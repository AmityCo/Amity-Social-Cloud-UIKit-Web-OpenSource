import React, { useState, useEffect } from 'react';
import { ChannelRepository } from 'eko-sdk';

import { withCustomization } from '../hoks/customization';
import useLiveObject from '../hooks/useLiveObject';
import Channel from '../Channel';
import ChannelItem from '../ChannelItem';

import { ChannelsPageContainer, ChannelsListContainer } from './styles';

const channelRepo = new ChannelRepository();

const ChannelsPage = () => {
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

export default withCustomization(ChannelsPage);
