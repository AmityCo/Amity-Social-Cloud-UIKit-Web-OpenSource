import { PostDataType } from '@amityco/js-sdk';
import * as ImageItem from './ImageItem';
import * as VideoItem from './VideoItem';
import * as StreamItem from './StreamItem';

export const GalleryThumbnails = {
  [PostDataType.ImagePost]: ImageItem.Thumbnail,
  [PostDataType.VideoPost]: VideoItem.Thumbnail,
  [PostDataType.LivestreamPost]: StreamItem.Thumbnail,
};

export const GalleryItems = {
  [PostDataType.ImagePost]: ImageItem.Item,
  [PostDataType.VideoPost]: VideoItem.Item,
  [PostDataType.LivestreamPost]: StreamItem.Item,
};
