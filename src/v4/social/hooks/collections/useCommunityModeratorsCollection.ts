import { CommunityRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';
import useSDK from '~/v4/core/hooks/useSDK';
import { MemberRoles } from '~/v4/social/constants/memberRoles';

const { COMMUNITY_MODERATOR } = MemberRoles;

export default function useCommunityModeratorsCollection({
  communityId,
  shouldCall = true,
}: {
  communityId?: string;
  shouldCall?: boolean;
}) {
  const { isVisitorOrBot } = useSDK();
  const { items, ...rest } = useLiveCollection({
    fetcher: CommunityRepository.Membership.getMembers,
    params: {
      communityId: communityId as string,
      roles: [COMMUNITY_MODERATOR],
      limit: 20,
    },
    shouldCall: !!communityId && shouldCall && !isVisitorOrBot,
  });

  return {
    moderators: items,
    ...rest,
  };
}
