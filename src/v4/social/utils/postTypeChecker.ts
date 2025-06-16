export const isTextPost = (post?: Amity.Post | null): post is Amity.Post<'text'> => {
  if (post && post.data && typeof post.data !== 'string' && 'text' in post.data) return true;
  return false;
};

export const isStreamPost = (post?: Amity.Post | null): post is Amity.Post<'liveStream'> => {
  return !!(post && post.data && typeof post.data !== 'string' && 'streamId' in post.data);
};
