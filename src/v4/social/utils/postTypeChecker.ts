export const isTextPost = (post?: Amity.Post | null): post is Amity.Post<'text'> => {
  if (
    post &&
    post.data &&
    typeof post.data !== 'string' &&
    ('text' in post.data || 'title' in post.data)
  )
    return true;
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

export const isClipPost = (post?: Amity.Post | null): post is Amity.Post<'clip'> => {
  return !!(post && post.data && typeof post.data !== 'string' && post.dataType === 'clip');
};

export const isEventPost = (post?: Amity.Post | null): post is Amity.Post<'event'> => {
  if (!post) return false;
  if (post.structureType === 'event') return true;
  if (post.dataType === 'event') return true;
  const childPost = post.childrenPosts?.[0];
  if (
    childPost?.dataType === 'event' &&
    childPost?.data &&
    typeof childPost.data !== 'string' &&
    'eventId' in childPost.data
  ) {
    return true;
  }
  return false;
};

export const getPostEventId = (post?: Amity.Post | null): string | undefined => {
  if (!post) return undefined;
  const childPost = post.childrenPosts?.[0];
  if (
    childPost?.data &&
    typeof childPost.data !== 'string' &&
    'eventId' in childPost.data &&
    typeof childPost.data.eventId === 'string'
  ) {
    return childPost.data.eventId;
  }
  if (post.data && typeof post.data !== 'string' && 'eventId' in post.data) {
    const eventId = (post.data as { eventId?: unknown }).eventId;
    if (typeof eventId === 'string') return eventId;
  }
  return undefined;
};
