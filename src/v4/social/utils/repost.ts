export type RepostMetadata = {
  repost?: {
    postId?: string;
    sourcePostId?: string;
    url?: string;
    createdAt?: string;
  };
};

export const getRepostedPostId = (post?: Amity.Post | null): string | null => {
  const metadata = post?.metadata as RepostMetadata | undefined;
  return metadata?.repost?.postId || null;
};

export const createRepostMetadata = (post: Amity.Post, url?: string): RepostMetadata => {
  const postId = getRepostedPostId(post) || post.postId;

  return {
    repost: {
      postId,
      sourcePostId: post.postId,
      url,
      createdAt: new Date().toISOString(),
    },
  };
};

export const createRepostText = (post: Amity.Post): string => {
  const displayName = post.creator?.displayName;
  return displayName ? `Reposted ${displayName}'s post` : 'Reposted a post';
};
