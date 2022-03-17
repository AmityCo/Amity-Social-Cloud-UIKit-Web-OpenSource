import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { FileRepository, ImageSize } from '@amityco/js-sdk';

import MessageComponent from '~/chat/components/Message';

import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';
import useMessagesList from '~/chat/hooks/useMessagesList';

import { InfiniteScrollContainer, MessageListContainer } from './styles';

const MessageList = ({ client, channelId }) => {
  const [messages, hasMore, loadMore] = useMessagesList(channelId);

  const { currentUserId } = client;

  const getAvatar = ({ user: { avatarCustomUrl, avatarFile, avatarFileId } }) => {
    if (avatarCustomUrl) return avatarCustomUrl;
    if (avatarFile) return avatarFile;
    if (avatarFileId) {
      return FileRepository.getFileUrlById({
        fileId: avatarFileId,
        imageSize: ImageSize.Medium,
      });
    }

    return null;
  };

  return (
    <InfiniteScrollContainer>
      <InfiniteScroll
        initialLoad={false}
        hasMore={hasMore}
        loadMore={loadMore}
        useWindow={false}
        loader={<span key={0}>Loading...</span>}
        isReverse
      >
        <MessageListContainer>
          {messages.map((message, i) => {
            const nextMessage = messages[i + 1];
            const isConsequent = nextMessage && nextMessage.userId === message.userId;
            const isIncoming = message.userId !== currentUserId;

            return (
              <MessageComponent
                key={message.messageId}
                data-qa-anchor="chat-message-list-message"
                avatar={getAvatar(message)}
                messageId={message.messageId}
                data={message.data}
                type={message.type}
                createdAt={message.createdAt}
                isDeleted={message.isDeleted}
                userDisplayName={message.user.displayName}
                isConsequent={isConsequent}
                isIncoming={isIncoming}
              />
            );
          })}
        </MessageListContainer>
      </InfiniteScroll>
    </InfiniteScrollContainer>
  );
};

export default withSDK(customizableComponent('MessageList', MessageList));
