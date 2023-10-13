import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { FormattedMessage } from 'react-intl';

import ChatItem from '~/chat/components/ChatItem';
import customizableComponent from '~/core/hocs/customization';
import useChannelsList from '~/chat/hooks/useChannelsList';

import {
  CreateNewChatIcon,
  RecentContainerSmall,
  RecentHeader,
  RecentHeaderLabel,
  InfiniteScrollContainer,
} from './styles';

const RecentChatBottom = ({ onChannelSelect, onAddNewChannelClick, selectedChannelId }) => {
  const [channels, hasMore, loadMore] = useChannelsList();
  const [showFull, setShowFull] = useState(false);
  return (
    <RecentContainerSmall onClick={() => setShowFull((prev) => !prev)} style={showFull ? {height: '100%'} : {}}>
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
    </RecentContainerSmall>
  );
};

export default customizableComponent('RecentChat', RecentChatBottom);
