import useCommunitiesCollection from '~/v4/social/hooks/collections/useCommunitiesCollection';

// Communities tagged with this exact string are "pinned" — an admin-curated set
// featured at the top of Explore and auto-joined for every user. The tag is set
// server-side (via the community's `tags` field); the client only reads it.
export const EXPLORE_PINNED_TAG = 'explore-pinned';

const PINNED_COMMUNITIES_LIMIT = 10;

/**
 * Live collection of the pinned communities (tagged `explore-pinned`).
 *
 * Wraps the general communities collection with a `tags` filter — the
 * recommended/trending collections do not support `tags`, so we must use the
 * general `CommunityRepository.getCommunities` query form here. Returns the
 * standard collection shape so it composes with the other Explore sections.
 */
export const usePinnedCommunities = ({ shouldCall = true }: { shouldCall?: boolean } = {}) => {
  const { communities, isLoading, hasMore, loadMore, error, refresh } = useCommunitiesCollection({
    queryParams: {
      tags: [EXPLORE_PINNED_TAG],
      includeDeleted: false,
      limit: PINNED_COMMUNITIES_LIMIT,
    },
    shouldCall,
  });

  return {
    pinnedCommunities: communities,
    isLoading,
    hasMore,
    loadMore,
    error,
    refresh,
  };
};

export default usePinnedCommunities;
