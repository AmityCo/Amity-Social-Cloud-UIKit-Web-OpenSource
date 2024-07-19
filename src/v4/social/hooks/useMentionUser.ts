import { CommunityRepository, UserRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export type MentionUser = Amity.Membership<'community'> | Amity.User;

export const useMentionUsers = ({
  displayName,
  limit = 10,
  community,
}: {
  displayName: string;
  limit?: number;
  community?: Amity.Community;
}) => {
  const fetcher =
    community && !community.isPublic
      ? CommunityRepository.Membership.getMembers
      : UserRepository.getUsers;

  const params =
    community && !community.isPublic
      ? ({
          communityId: community.communityId,
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
  });

  return {
    mentionUsers: items.map((item) => {
      if ('user' in item) return item.user;
      return item;
    }),
    ...rest,
  };
};
