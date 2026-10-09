import { useMemo } from 'react';
import { useFeatureEnabled } from '~/v4/core/providers/CustomizationProvider';
import { postsForModules } from '~/v4/social/utils/postsForModules';

/**
 * Drops posts whose body belongs to a switched-off module.
 *
 * The home feeds cannot ask the server to leave them out. `getForYouFeed` takes
 * `LiveCollectionParams<Record<string, never>>` — no parameters at all — and
 * `getGlobalFeed`'s `dataTypes` union has no `text` in it, so naming the types
 * we do want would be the only way to exclude one and would drop every text
 * post with it. Both feeds therefore ask for everything and lose the posts
 * here.
 *
 * This removes the post; `PollContent`'s own gate removes the body. Both are
 * wanted: a feed elsewhere that keeps the post should still not draw a poll,
 * and a feed that can drop the post should not leave an empty card behind.
 * Livestream has no element id for its body at all — nothing in the tables
 * names a livestream post inside a feed — so for `live` this is the only thing
 * standing between a revoked module and the screen.
 *
 * Pagination is worth knowing about: a page of ten can arrive and leave two, so
 * the feed asks for the next page sooner. It does not stall, because the
 * sentinel stays in view and keeps firing, but a customer with Poll off scrolls
 * through more requests than one with it on.
 */
export const useModuleFilteredPosts = (posts: Amity.Post[]) => {
  const isPollEnabled = useFeatureEnabled('poll');
  const isLiveEnabled = useFeatureEnabled('live');

  return useMemo(
    () => postsForModules(posts, { isPollEnabled, isLiveEnabled }),
    [posts, isPollEnabled, isLiveEnabled],
  );
};

export default useModuleFilteredPosts;
