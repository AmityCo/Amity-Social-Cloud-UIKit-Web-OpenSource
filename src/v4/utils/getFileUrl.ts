export const getFileUrl = (post: Amity.Post<'video' | 'clip'>) => {
  if (post.dataType === 'video') {
    return post.getVideoInfo()?.fileUrl;
  } else if (post.dataType === 'clip') {
    return post.getClipInfo()?.fileUrl;
  }
  return undefined;
};
