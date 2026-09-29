import { postsForModules } from '~/v4/social/utils/postsForModules';

/**
 * The home feeds cannot ask the server to leave a module's posts out, so they
 * drop them on arrival. These are the rules that decides which.
 */
const post = (id: string, childTypes: string[] = [], dataType = 'text') =>
  ({
    postId: id,
    dataType,
    childrenPosts: childTypes.map((t, i) => ({ postId: `${id}-c${i}`, dataType: t })),
  }) as unknown as Amity.Post;

const ids = (posts: Amity.Post[]) => posts.map((p) => p.postId);

const ALL_ON = { isPollEnabled: true, isLiveEnabled: true };

const feed = [
  post('text-1'),
  post('image-1', ['image']),
  post('poll-1', ['poll']),
  post('live-1', ['room']),
  post('clip-1', ['clip']),
];

describe('postsForModules', () => {
  it('leaves the feed alone when both modules are on', () => {
    // Identity, not a copy: the feeds pass this straight to a memo, and a new
    // array every render would rerender the list for nothing.
    expect(postsForModules(feed, ALL_ON)).toBe(feed);
  });

  it('drops poll posts when Poll is off, and nothing else', () => {
    const kept = postsForModules(feed, { ...ALL_ON, isPollEnabled: false });

    expect(ids(kept)).toEqual(['text-1', 'image-1', 'live-1', 'clip-1']);
  });

  it('drops livestream posts when Live is off, and nothing else', () => {
    const kept = postsForModules(feed, { ...ALL_ON, isLiveEnabled: false });

    expect(ids(kept)).toEqual(['text-1', 'image-1', 'poll-1', 'clip-1']);
  });

  it('drops both when both are off', () => {
    const kept = postsForModules(feed, { isPollEnabled: false, isLiveEnabled: false });

    expect(ids(kept)).toEqual(['text-1', 'image-1', 'clip-1']);
  });

  it('reads the post itself as well as its children', () => {
    // A feed can hand back the child shape directly, so the type is checked in
    // both places rather than only on childrenPosts.
    const direct = [post('poll-direct', [], 'poll'), post('live-direct', [], 'room')];

    expect(postsForModules(direct, { ...ALL_ON, isPollEnabled: false })).toHaveLength(1);
    expect(postsForModules(direct, { ...ALL_ON, isLiveEnabled: false })).toHaveLength(1);
  });

  it('reads both spellings of a livestream child', () => {
    // PostContent and LiveStreamContent read `room`; social/utils and
    // useCommunityPostPermission read `liveStream`. Checking one let the other
    // through, which is how a livestream post reached a community feed.
    const both = [post('as-room', ['room']), post('as-livestream', ['liveStream'])];

    expect(postsForModules(both, { isPollEnabled: true, isLiveEnabled: false })).toHaveLength(0);
    expect(postsForModules(both, { isPollEnabled: true, isLiveEnabled: true })).toHaveLength(2);
  });

  it('survives a post with no children', () => {
    const bare = [{ postId: 'bare', dataType: 'text' } as unknown as Amity.Post];

    expect(ids(postsForModules(bare, { isPollEnabled: false, isLiveEnabled: false }))).toEqual([
      'bare',
    ]);
  });
});
