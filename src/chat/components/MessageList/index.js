import React, { useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { FileRepository, ImageSize } from '@amityco/js-sdk';

import MessageComponent from '~/chat/components/Message';

import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';
import useMessagesList from '~/chat/hooks/useMessagesList';

import { InfiniteScrollContainer, MessageListContainer } from './styles';

const MessageList = ({ client, channelId }) => {
  const containerRef = useRef();
  const [messages, hasMore, loadMore] = useMessagesList(channelId);

  const getAvatar = ({ user: { avatarCustomUrl, avatarFile, avatarFileId } }) => {
    if (avatarCustomUrl) return avatarCustomUrl;
    if (avatarFile) return avatarFile;
    if (avatarFileId) {
      return FileRepository.getFileUrlById({
        fileId: avatarFileId,
        imageSize: ImageSize.Small,
      });
    }

    return null;
  };

  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      element.scrollIntoView(false);
    }
  }, [messages, containerRef]);

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
        <MessageListContainer ref={containerRef}>
          {messages.map((message, i) => {
            const nextMessage = messages[i + 1];
            const isConsequent = nextMessage && nextMessage.userId === message.userId;
            const isIncoming = message.userId !== client.currentUserId;

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
                containerRef={containerRef}
              />
            );
          })}
        </MessageListContainer>
      </InfiniteScroll>
    </InfiniteScrollContainer>
  );
};

export default withSDK(customizableComponent('MessageList', MessageList));
