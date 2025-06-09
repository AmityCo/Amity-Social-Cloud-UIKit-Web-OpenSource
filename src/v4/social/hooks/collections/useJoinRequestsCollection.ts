import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export default function useJoinRequestsCollection({
  community,
  status,
  shouldCall = true,
}: {
  community: Amity.Community;
  status: Amity.JoinRequestStatus;
  shouldCall?: boolean;
}) {
  const { items, ...rest } = useLiveCollection({
    fetcher: community.getJoinRequests,
    params: {
      communityId: community.communityId,
      type: 'communityJoinRequest',
      targetType: 'community',
      limit: 20,
      status,
    },
    shouldCall,
  });

  return {
    items,
    ...rest,
  };
}
