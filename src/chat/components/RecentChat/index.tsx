import React, { useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FormattedMessage } from 'react-intl';

import ChatItem from '~/chat/components/ChatItem';

import {
  CreateNewChatIcon,
  RecentContainer,
  RecentHeader,
  RecentHeaderLabel,
  InfiniteScrollContainer,
} from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useChannelsCollection from '~/chat/hooks/collections/useChannelsCollection';
import { ChannelRepository, SubChannelRepository } from '@amityco/ts-sdk';

interface RecentChatProps {
  onChannelSelect?: (data: { channelId: string; type: string }) => void;
  onAddNewChannelClick: () => void;
  selectedChannelId?: string;
  membershipFilter?: 'all' | 'member' | 'notMember';
}

const RecentChat = ({
  onChannelSelect,
  onAddNewChannelClick,
  selectedChannelId,
  membershipFilter,
}: RecentChatProps) => {
  const { channels, hasMore, loadMore } = useChannelsCollection({
    membership: membershipFilter,
    sortBy: 'lastActivity',
    limit: 20,
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onClickChannel = async ({ channelId, type }: { channelId: string; type: string }) => {
    if (type !== 'conversation') {
      await ChannelRepository.joinChannel(channelId);
    }
    await SubChannelRepository.startReading(channelId);
  };

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
      <InfiniteScrollContainer ref={containerRef} data-qa-anchor="chat-list">
        {containerRef.current ? (
          <InfiniteScroll
            scrollableTarget={containerRef.current}
            scrollThreshold={0.7}
            hasMore={hasMore}
            next={loadMore}
            loader={hasMore && <span key={0}>Loading...</span>}
            dataLength={channels?.length || 0}
            height={containerRef.current.clientHeight}
          >
            {Array.isArray(channels) &&
              channels.map((channel) => (
                <ChatItem
                  key={channel.channelId}
                  channelId={channel.channelId}
                  isSelected={selectedChannelId === channel.channelId}
                  onSelect={(data) => {
                    onClickChannel(data);
                    onChannelSelect?.(data);
                  }}
                />
              ))}
          </InfiniteScroll>
        ) : null}
      </InfiniteScrollContainer>
    </RecentContainer>
  );
};

export default (props: RecentChatProps) => {
  const CustomComponentFn = useCustomComponent('RecentChat');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <RecentChat {...props} />;
};
