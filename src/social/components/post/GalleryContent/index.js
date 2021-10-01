import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import GalleryGrid from '~/core/components/GalleryGrid';
import ImageGallery from '~/core/components/ImageGallery';
import Image from '~/core/components/Uploaders/Image';
import { GalleryItems, GalleryThumbnails } from './constants';

const GalleryContent = ({
  className,
  items: itemsRaw = [],
  loading = false,
  loadingMore = false,
  showCounter = true,
  truncate = true,
  thumbnailRenderers = GalleryThumbnails,
}) => {
  const [index, setIndex] = useState(null);

  const items = useMemo(() => {
    if (loading) {
      return new Array(6).fill({ skeleton: true });
    }

    if (loadingMore) {
      return [...itemsRaw, ...new Array(6).fill({ skeleton: true })];
    }

    return itemsRaw;
  }, [itemsRaw, loading, loadingMore]);

  return (
    <>
      <GalleryGrid
        className={className}
        items={items}
        onClick={i => {
          if (!items[i].skeleton) {
            setIndex(i);
          }
        }}
        truncate={truncate}
      >
        {item => {
          if (item.skeleton) {
            return <Image loading />;
          }

          const Component = { ...GalleryThumbnails, ...thumbnailRenderers }[item.dataType];

          if (!Component) {
            return null;
          }

          return <Component item={item} />;
        }}
      </GalleryGrid>

      {index !== null && (
        <ImageGallery index={index} items={itemsRaw} onChange={setIndex} showCounter={showCounter}>
          {item => {
            if (!item) {
              return null;
            }

            const Component = GalleryItems[item.dataType];

            if (!Component) {
              return null;
            }

            return <Component item={item} />;
          }}
        </ImageGallery>
      )}
    </>
  );
};

GalleryContent.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  loadingMore: PropTypes.bool,
  showCounter: PropTypes.bool,
  thumbnailRenderers: PropTypes.object,
  truncate: PropTypes.bool,
};

export default GalleryContent;
