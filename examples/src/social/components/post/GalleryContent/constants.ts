export { Item as ImageItem, Thumbnail as ImageThumbnail } from './ImageItem';
export { Item as VideoItem, Thumbnail as VideoThumbnail } from './VideoItem';
export { Item as LiveStreamItem, Thumbnail as LiveStreamThumbnail } from './StreamItem';

export type PostWithSkeleton<T extends Amity.PostContentType = any> = Amity.Post<T> & {
  skeleton?: boolean;
};
