import { CommunityRepository } from '@amityco/ts-sdk';
import useCommunitiesCollection from '~/v4/social/hooks/collections/useCommunitiesCollection';

// Communities tagged with this exact string are "pinned" — an admin-curated set
// featured at the top of Explore and auto-joined for every user. The tag is set
// server-side (via the community's `tags` field); the client only reads it.
export const EXPLORE_PINNED_TAG = 'explore-pinned';

const PINNED_COMMUNITIES_LIMIT = 10;

/**
 * Imperatively auto-join every pinned community the (signed-in) user is not
 * already a member of. One-shot: reads the first settled page of the pinned-tag
 * live collection, joins the `isJoined === false` communities, then detaches.
 *
 * Best-effort by design — individual join failures are swallowed. Use this from
 * non-React contexts that need the join to happen once (e.g. right after the
 * create-profile sign-up completes), separate from the Explore-tab effect.
 *
 * @returns the number of communities a join was initiated for (0 if none).
 */
export const joinPinnedCommunities = (): Promise<number> =>
  new Promise((resolve) => {
    let handled = false;
    // Assigned synchronously by getCommunities; the callback runs asynchronously
    // (after this returns), so referencing `unsubscribe` inside it is safe.
    const unsubscribe = CommunityRepository.getCommunities(
      { tags: [EXPLORE_PINNED_TAG], includeDeleted: false, limit: PINNED_COMMUNITIES_LIMIT },
      ({ data, loading, error }) => {
        if (loading || handled) return;
        handled = true;
        unsubscribe?.();
        if (error || !data?.length) return resolve(0);

        const toJoin = data.filter((community) => !community.isJoined);
        if (toJoin.length === 0) return resolve(0);

        Promise.all(
          toJoin.map((community) =>
            CommunityRepository.joinCommunity(community.communityId).then(
              () => true,
              () => false, // ignore individual failures (transient / permission)
            ),
          ),
        ).then((results) => resolve(results.filter(Boolean).length));
      },
    );
  });

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
