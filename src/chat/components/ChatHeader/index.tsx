import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ChannelRepository } from '@amityco/ts-sdk';

import UserAvatar from '~/chat/components/UserAvatar';
import { backgroundImage as userBackgroundImage } from '~/icons/User';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';
import useChatInfo from '~/chat/hooks/useChatInfo';

import {
  ChatHeaderContainer,
  DetailsIcon,
  Channel,
  ChannelInfo,
  ChannelName,
  MemberCount,
} from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

type ChatHeaderProps = {
  channelId: string;
  onChatDetailsClick: () => void;
  shouldShowChatDetails: boolean;
};

const ChatHeader = ({ channelId, onChatDetailsClick, shouldShowChatDetails }: ChatHeaderProps) => {
  const [channel, setChannel] = useState<Amity.Channel | null>(null);
  const unsubscribeChannel = useRef<() => void>(() => {});
  useEffect(() => {
    async function run() {
      const unsubscribe = await ChannelRepository.getChannel(channelId, (response) => {
        setChannel(response.data);
      });
      unsubscribeChannel.current = unsubscribe;
    }
    run();

    return () => {
      unsubscribeChannel.current();
    };
  }, [channelId]);
  const { chatName, chatAvatar } = useChatInfo({ channel });

  return (
    <ChatHeaderContainer data-qa-anchor="chat-header">
      <Channel>
        <UserAvatar
          avatarUrl={chatAvatar || undefined}
          defaultImage={
            channel?.memberCount && channel.memberCount > 2
              ? communityBackgroundImage
              : userBackgroundImage
          }
        />
        <ChannelInfo data-qa-anchor="chat-header-channel-info">
          <ChannelName data-qa-anchor="chat-header-channel-info-channel-name">
            {chatName}
          </ChannelName>
          <MemberCount data-qa-anchor="chat-header-channel-info-member-count">
            <FormattedMessage id="chat.members.count" values={{ count: channel?.memberCount }} />
          </MemberCount>
        </ChannelInfo>
      </Channel>
      {!shouldShowChatDetails && <DetailsIcon onClick={onChatDetailsClick} />}
    </ChatHeaderContainer>
  );
};

export default (props: ChatHeaderProps) => {
  const CustomComponentFn = useCustomComponent<ChatHeaderProps>('ChatHeader');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <ChatHeader {...props} />;
};
