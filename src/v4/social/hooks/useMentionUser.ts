import { CommunityRepository, UserRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';
import useCommunity from '~/social/hooks/useCommunity';

export type MentionUser = Amity.Membership<'community'> | Amity.User;

export const useMentionUsers = ({
  displayName,
  limit = 10,
  postTargetType,
  postTargetId,
}: {
  displayName: string;
  limit?: number;
  postTargetType: Amity.PostTargetType;
  postTargetId: string;
}) => {
  const community = useCommunity(postTargetType === 'community' ? postTargetId : undefined);

  const fetcher =
    postTargetType === 'community' && community && !community.isPublic
      ? CommunityRepository.Membership.getMembers
      : UserRepository.getUsers;

  const params =
    postTargetType === 'community' && community && !community.isPublic
      ? ({
          communityId: postTargetId,
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
    shouldCall: (postTargetType === 'community' && !!community) || postTargetType === 'user',
  });

  return {
    mentionUsers: items.map((item) => {
      if ('user' in item) return item.user;
      return item;
    }),
    ...rest,
  };
};
