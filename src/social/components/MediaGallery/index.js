import { PostDataType } from '@amityco/js-sdk';
import React, { memo, useState } from 'react';
import EmptyState from '~/core/components/EmptyState';
import customizableComponent from '~/core/hocs/customization';
import LoadMore from '~/social/components/LoadMore';
import GalleryContent from '~/social/components/post/GalleryContent';
import * as VideoItem from '~/social/components/post/GalleryContent/VideoItem';
import * as StreamItem from '~/social/components/post/GalleryContent/StreamItem';
import useMediaGallery from '~/social/hooks/useMediaGallery';
import { EmptyIcons, EmptyText, RECORDS_PER_PAGE, tabs } from './constants';
import { MediaGalleryContainer, Tabs } from './styles';

const thumbnailRenderers = {
  [PostDataType.VideoPost]: (props) => <VideoItem.Thumbnail {...props} showVideoDuration />,
  [PostDataType.LivestreamPost]: (props) => (
    <StreamItem.Thumbnail {...props} showLivestreamTitle showVideoDuration />
  ),
};

const MediaGallery = ({ targetId, targetType }) => {
  const [activeTab, setActiveTab] = useState(PostDataType.ImagePost);

  const [posts, hasMore, loadMore, loading, loadingMore] = useMediaGallery({
    targetId,
    targetType,
    dataType: activeTab,
    limit: RECORDS_PER_PAGE,
  });

  return (
    <MediaGalleryContainer>
      <Tabs activeTab={activeTab} tabs={tabs} onChange={setActiveTab} />

      {(loading || loadingMore || posts.length > 0) && (
        <LoadMore hasMore={hasMore} loadMore={loadMore} className="load-more no-border">
          <GalleryContent
            items={posts}
            loading={loading}
            loadingMore={loadingMore}
            showCounter={false}
            truncate={false}
            thumbnailRenderers={thumbnailRenderers}
          />
        </LoadMore>
      )}

      {!loading && !loadingMore && posts.length === 0 && (
        <EmptyState icon={EmptyIcons[activeTab]} title={EmptyText[activeTab]} />
      )}
    </MediaGalleryContainer>
  );
};

export default memo(customizableComponent('MediaGallery', MediaGallery));
