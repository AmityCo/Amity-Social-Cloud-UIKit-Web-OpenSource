import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { FormattedMessage } from 'react-intl';

import ChatItem from '~/chat/components/ChatItem';
import customizableComponent from '~/core/hocs/customization';
import useChannelsList from '~/chat/hooks/useChannelsList';

import {
  CreateNewChatIcon,
  RecentContainer,
  RecentHeader,
  RecentHeaderLabel,
  InfiniteScrollContainer,
} from './styles';

const RecentChat = ({ onChannelSelect, onAddNewChannelClick, selectedChannelId = 0}) => {
  const [channels, hasMore, loadMore] = useChannelsList();

  console.log(`RecentChat invoked selectedChannelId: ${selectedChannelId}`);

  return (
    <RecentContainer>
      <RecentHeader>
        <RecentHeaderLabel>
          <FormattedMessage id="chat.chats" />
        </RecentHeaderLabel>
        {/* this component work only with Callback and User selector on Eko Side, during Personal Mode 
        development selector was not add as there is not specific suitable design for UI Kit.
        Need to be done internaly by ASC when needed. */}
        <CreateNewChatIcon
          data-qa-anchor="chat-create-chat-button"
          onClick={onAddNewChannelClick}
        />
      </RecentHeader>
      <InfiniteScrollContainer data-qa-anchor="chat-list">
        <InfiniteScroll
          initialLoad={false}
          hasMore={hasMore}
          loadMore={loadMore}
          useWindow={false}
          // TODO: REMOVE when SDK Provide filter by membership
          threshold={1}
          loader={hasMore && <span key={0}>Loading...</span>}
        >
          {Array.isArray(channels) &&
            channels.map((channel) => (
              <ChatItem
                key={channel.channelId}
                channel={channel}
                isSelected={selectedChannelId === channel.channelId}
                onSelect={onChannelSelect}
              />
            ))}
        </InfiniteScroll>
      </InfiniteScrollContainer>
    </RecentContainer>
  );
};

export default customizableComponent('RecentChat', RecentChat);
