import useSDK from '~/core/hooks/useSDK';
import useSearchChannelUser from '~/v4/chat/hooks/collections/useSearchChannelUser';

const useCurrentUserChannelMembership = (channelId: Amity.Channel['channelId']) => {
  const { currentUserId } = useSDK();
  const { channelMembers, isLoading } = useSearchChannelUser(
    channelId,
    ['member', 'banned', 'muted'],
    currentUserId,
  );

  if (isLoading) return null;

  return channelMembers?.[0];
};

export default useCurrentUserChannelMembership;
