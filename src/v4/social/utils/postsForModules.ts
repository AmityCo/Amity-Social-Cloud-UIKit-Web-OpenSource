/**
 * Which posts a feed may draw, given what the customer bought.
 *
 * Kept apart from the hook, and importing nothing from the provider, for the
 * reason `navigationTargets` is: anything reaching into CustomizationProvider
 * pulls the SDK and the component tree in behind it, and a suite that only
 * wants to know which posts survive could not import it.
 */

/** The child a poll post carries its poll in. */
const POLL_CHILDREN = ['poll'];
/**
 * Both spellings, because the codebase disagrees with itself about which one a
 * livestream child carries: PostContent, PostMenu and LiveStreamContent read
 * `room`, while `social/utils` and `useCommunityPostPermission` read
 * `liveStream`. Checking one was enough to let a livestream post through.
 */
const LIVESTREAM_CHILDREN = ['room', 'liveStream'];

export type FeedModuleState = { isPollEnabled: boolean; isLiveEnabled: boolean };

const carries = (post: Amity.Post, dataTypes: string[]) =>
  dataTypes.includes(post.dataType) ||
  (post.childrenPosts ?? []).some((child) => child && dataTypes.includes(child.dataType));

export const postsForModules = (
  posts: Amity.Post[],
  { isPollEnabled, isLiveEnabled }: FeedModuleState,
): Amity.Post[] => {
  // Identity when there is nothing to take out: the feeds hand this to a memo,
  // and a fresh array every render would redraw the list for nothing.
  if (isPollEnabled && isLiveEnabled) return posts;

  return posts.filter((post) => {
    if (!isPollEnabled && carries(post, POLL_CHILDREN)) return false;
    if (!isLiveEnabled && carries(post, LIVESTREAM_CHILDREN)) return false;

    return true;
  });
};
