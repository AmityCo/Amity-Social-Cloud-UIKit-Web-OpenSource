export const isTextPost = (post?: Amity.Post | null): post is Amity.Post<'text'> => {
  if (post && post.data && typeof post.data !== 'string' && 'text' in post.data) return true;
  return false;
};

export const isStreamPost = (post?: Amity.Post | null): post is Amity.Post<'liveStream'> => {
  return !!(post && post.data && typeof post.data !== 'string' && 'streamId' in post.data);
};

export const isFilePost = (post?: Amity.Post | null): post is Amity.Post<'file'> => {
  return !!(post && post.data && typeof post.data !== 'string' && 'fileId' in post.data);
};

export const isImagePost = (post?: Amity.Post | null): post is Amity.Post<'image'> => {
  return !!(
    post &&
    post.data &&
    typeof post.data !== 'string' &&
    'fileId' in post.data &&
    post.dataType === 'image'
  );
};

export const isVideoPost = (post?: Amity.Post | null): post is Amity.Post<'video'> => {
  return !!(post && post.data && typeof post.data !== 'string' && 'videoFileId' in post.data);
};

export const isPollPost = (post?: Amity.Post | null): post is Amity.Post<'poll'> => {
  return !!(post && post.data && typeof post.data !== 'string' && 'pollId' in post.data);
};
