import useCommunity from '~/v4/social/hooks/objects/useCommunity';
import { useEvent } from '~/v4/social/features/events/hooks/useEvent';

export function useInteractionCommunity(community?: Amity.Community | null) {
  const eventId = community?.eventId;
  const { event } = useEvent({ eventId: eventId ?? '', shouldCall: !!eventId });
  const eventCommunityId = event?.targetCommunity?.communityId;
  const { community: eventCommunity } = useCommunity({
    communityId: eventCommunityId,
    shouldCall: !!eventCommunityId,
  });

  if (!eventId) return community;

  return eventCommunity ?? community;
}
