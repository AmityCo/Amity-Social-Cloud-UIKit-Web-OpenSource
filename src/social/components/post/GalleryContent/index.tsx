import React, { ReactNode, useMemo, useState } from 'react';

import GalleryGrid from '~/core/components/GalleryGrid';
import ImageGallery from '~/core/components/ImageGallery';
import Image from '~/core/components/Uploaders/Image';
import {
  PostWithSkeleton,
  ImageItem,
  VideoItem,
  LiveStreamItem,
  ImageThumbnail,
  VideoThumbnail,
  LiveStreamThumbnail,
} from './constants';
import { isLoadingItem } from '~/utils';
import { ImageSkeleton } from '~/core/components/Uploaders/Image/styles';

const useItems = <T extends PostWithSkeleton>({
  loading,
  loadingMore,
  items,
}: Pick<GalleryContentProps<T>, 'loading' | 'loadingMore' | 'items'>) => {
  const [index, setIndex] = useState<number | null>(null);

  const newItems = useMemo(() => {
    if (loading) {
      return new Array(6).fill({ skeleton: true });
    }

    if (loadingMore) {
      return [...(items || []), ...new Array(6).fill({ skeleton: true })];
    }

    return items;
  }, [items, loading, loadingMore]);

  return {
    newItems,
    index,
    setIndex,
  };
};

export interface GalleryContentProps<T extends PostWithSkeleton> {
  className?: string;
  items?: T[];
  loading?: boolean;
  loadingMore?: boolean;
  showCounter?: boolean;
  truncate?: boolean;
  renderVideoItem?: (item: Amity.Post<'video'>) => ReactNode;
  renderImageItem?: (item: Amity.Post<'image'>) => ReactNode;
  renderLiveStreamItem?: (item: Amity.Post<'liveStream'>) => ReactNode;
  renderVideoThumbnail?: (item: Amity.Post<'video'>) => ReactNode;
  renderImageThumbnail?: (item: Amity.Post<'image'>) => ReactNode;
  renderLiveStreamThumbnail?: (item: Amity.Post<'liveStream'>) => ReactNode;
  grid?: boolean;
}

const GalleryContent = <T extends PostWithSkeleton>({
  className,
  items = [],
  loading = false,
  loadingMore = false,
  showCounter = false,
  truncate = false,
  grid = false,
  renderVideoItem,
  renderImageItem,
  renderLiveStreamItem,
  renderVideoThumbnail,
  renderImageThumbnail,
  renderLiveStreamThumbnail,
}: GalleryContentProps<T>) => {
  const { newItems, index, setIndex } = useItems({
    loading,
    loadingMore,
    items,
  });

  const thumbnailRenderer = (item: PostWithSkeleton) => {
    switch (item.dataType) {
      case 'image':
        return renderImageThumbnail ? renderImageThumbnail(item) : <ImageThumbnail item={item} />;
      case 'video':
        return renderVideoThumbnail ? renderVideoThumbnail(item) : <VideoThumbnail item={item} />;
      case 'liveStream':
        return renderLiveStreamThumbnail ? (
          renderLiveStreamThumbnail(item)
        ) : (
          <LiveStreamThumbnail item={item} />
        );
      default:
        return null;
    }
  };

  const itemRenderer = (item: Amity.Post) => {
    switch (item.dataType) {
      case 'image':
        return renderImageItem ? renderImageItem(item) : <ImageItem item={item} />;
      case 'video':
        return renderVideoItem ? renderVideoItem(item) : <VideoItem item={item} />;
      case 'liveStream':
        return renderLiveStreamItem ? renderLiveStreamItem(item) : <LiveStreamItem item={item} />;
      default:
        return null;
    }
  };

  return (
    <>
      <GalleryGrid
        className={className}
        items={items}
        truncate={truncate}
        grid={grid}
        onClick={(i) => {
          if (!isLoadingItem(items[i])) {
            setIndex(i);
          }
        }}
        renderItem={(item: PostWithSkeleton) => {
          if (item.skeleton) return <ImageSkeleton />;
          return thumbnailRenderer(item);
        }}
      />

      {index !== null && (
        <ImageGallery
          index={index}
          items={newItems}
          showCounter={showCounter}
          onChange={(newIndex) => setIndex(newIndex)}
          renderItem={itemRenderer}
        />
      )}
    </>
  );
};

export default GalleryContent;
