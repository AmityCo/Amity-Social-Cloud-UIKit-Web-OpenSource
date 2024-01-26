import React, { memo, useState } from 'react';
import EmptyState from '~/core/components/EmptyState';

import GalleryContent from '~/social/components/post/GalleryContent';
import * as VideoItem from '~/social/components/post/GalleryContent/VideoItem';
import * as StreamItem from '~/social/components/post/GalleryContent/StreamItem';
import { EmptyIcons, EmptyText, EnumContentType, RECORDS_PER_PAGE, tabs } from './constants';
import { MediaGalleryContainer, Tabs } from './styles';
import LoadMoreWrapper from '../LoadMoreWrapper';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useMediaCollection from '~/social/hooks/collections/useMediaCollection';

interface MediaGalleryProps {
  targetId?: string | null;
  targetType: string;
}

const MediaGallery = ({ targetId, targetType }: MediaGalleryProps) => {
  const [activeTab, setActiveTab] = useState<EnumContentType>(EnumContentType.Image);

  const { media, isLoading, hasMore, loadMore, loadMoreHasBeenCalled } = useMediaCollection({
    targetId: targetId || undefined,
    targetType,
    dataType: activeTab,
    limit: RECORDS_PER_PAGE,
  });

  return (
    <MediaGalleryContainer>
      <Tabs
        activeTab={activeTab}
        tabs={tabs}
        onChange={(newTab) => setActiveTab(newTab as EnumContentType)}
      />

      {(isLoading || loadMoreHasBeenCalled || media.length > 0) && (
        <LoadMoreWrapper
          hasMore={hasMore}
          loadMore={loadMore}
          className="load-more no-border"
          contentSlot={
            <GalleryContent
              items={media}
              loading={isLoading}
              loadingMore={loadMoreHasBeenCalled}
              renderVideoThumbnail={(item) => (
                <VideoItem.Thumbnail item={item} showPlayIcon showVideoDuration />
              )}
              renderLiveStreamThumbnail={(item) => (
                <StreamItem.Thumbnail
                  item={item}
                  showPlayIcon
                  showLivestreamTitle
                  showLivestreamRecordedBadge
                />
              )}
            />
          }
        />
      )}

      {!isLoading && !loadMoreHasBeenCalled && media.length === 0 && (
        <EmptyState icon={EmptyIcons[activeTab]} title={EmptyText[activeTab]} />
      )}
    </MediaGalleryContainer>
  );
};

export default memo((props: MediaGalleryProps) => {
  const CustomComponentFn = useCustomComponent<MediaGalleryProps>('MediaGallery');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <MediaGallery {...props} />;
});
