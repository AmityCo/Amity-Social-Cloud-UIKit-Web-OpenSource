import { CommunityRepository, UserRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';
import useCommunity from '~/social/hooks/useCommunity';

export type MentionUser = Amity.Membership<'community'> | Amity.User;

export const useMentionUsers = ({
  displayName,
  limit = 10,
  targetType,
  targetId,
}: {
  displayName: string;
  limit?: number;
  targetType: Amity.PostTargetType;
  targetId: string;
}) => {
  const community = useCommunity(targetType === 'community' ? targetId : undefined);

  const fetcher =
    targetType === 'community' && community && !community.isPublic
      ? CommunityRepository.Membership.getMembers
      : UserRepository.getUsers;

  const params =
    targetType === 'community' && community && !community.isPublic
      ? ({
          communityId: targetId,
          displayName,
          limit,
        } as Amity.SearchCommunityMemberLiveCollection)
      : ({ displayName, limit } as Amity.UserLiveCollection);

  const { items, ...rest } = useLiveCollection<
    Amity.Membership<'community'> | Amity.User,
    Amity.SearchCommunityMemberLiveCollection | Amity.UserLiveCollection
  >({
    fetcher: fetcher as any,
    params,
    shouldCall:
      (targetType === 'community' && !!community) ||
      targetType === 'user' ||
      targetType === 'story',
  });

  return {
    mentionUsers: items.map((item) => {
      if ('user' in item) return item.user;
      return item;
    }),
    ...rest,
  };
};
