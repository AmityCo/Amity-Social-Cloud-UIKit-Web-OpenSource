/**
 * Comment count of a post as this session sees it.
 *
 * `post.commentsCount` is the figure from the last server response; the SDK does
 * not change it when the logged-in user adds or deletes a comment, so a count
 * read from it stays stale until the post is fetched again. The SDK keeps the
 * live figure behind `getLocalCommentCount()`: the server count plus the
 * comments created and deleted since.
 *
 * Falls back to `commentsCount` for a post object that carries no SDK helpers.
 */
export const getPostCommentCount = (post?: Amity.Post | null): number =>
  post?.getLocalCommentCount?.() ?? post?.commentsCount ?? 0;
