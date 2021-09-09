import { PostDataType } from '@amityco/js-sdk';
import React, { memo, useState } from 'react';
import EmptyState from '~/core/components/EmptyState';
import customizableComponent from '~/core/hocs/customization';
import LoadMore from '~/social/components/LoadMore';
import GalleryContent from '~/social/components/post/GalleryContent';
import useMediaGallery from '~/social/hooks/useMediaGallery';
import { EmptyIcons, EmptyText, RECORDS_PER_PAGE, tabs } from './constants';
import { MediaGalleryContainer, Tabs } from './styles';

function MediaGallery({ targetId, targetType }) {
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
            showVideoDuration
            truncate={false}
          />
        </LoadMore>
      )}

      {!loading && !loadingMore && posts.length === 0 && (
        <EmptyState icon={EmptyIcons[activeTab]} title={EmptyText[activeTab]} />
      )}
    </MediaGalleryContainer>
  );
}

export default memo(customizableComponent('MediaGallery', MediaGallery));
