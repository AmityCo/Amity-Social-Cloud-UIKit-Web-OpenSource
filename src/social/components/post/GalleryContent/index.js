import { PostDataType } from '@amityco/js-sdk';
import React, { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import GalleryGrid from '~/core/components/GalleryGrid';
import ImageGallery from '~/core/components/ImageGallery';
import Image from '~/core/components/Uploaders/Image';
import Video from '~/core/components/Uploaders/Video';
import { VideoMessage, VideoThumbnail } from './styles';

const GalleryContent = ({
  items: itemsRaw = [],
  loading = false,
  loadingMore = false,
  showCounter = true,
  showVideoDuration = false,
  truncate = true,
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
        items={items}
        onClick={i => {
          if (!items[i].skeleton) {
            setIndex(i);
          }
        }}
        truncate={truncate}
      >
        {item => {
          if (!item) {
            return null;
          }

          if (item.skeleton) {
            return <Image loading />;
          }

          if (item.dataType === PostDataType.ImagePost) {
            return <Image key={item.data.fileId} fileId={item.data.fileId} mediaFit="cover" />;
          }

          if (item.dataType === PostDataType.VideoPost) {
            return (
              <VideoThumbnail
                key={item.data.thumbnailFileId}
                fileId={item.data.thumbnailFileId}
                videoFileId={showVideoDuration && item.data.videoFileId.original}
              />
            );
          }

          return null;
        }}
      </GalleryGrid>

      {index !== null && (
        <ImageGallery index={index} items={itemsRaw} onChange={setIndex} showCounter={showCounter}>
          {item => {
            if (!item) {
              return null;
            }

            if (item.dataType === PostDataType.ImagePost) {
              return (
                <Image
                  key={item.data.fileId}
                  fileId={item.data.fileId}
                  mediaFit="contain"
                  noBorder
                />
              );
            }

            if (item.dataType === PostDataType.VideoPost) {
              const fileId =
                item.data.videoFileId.high ||
                item.data.videoFileId.medium ||
                item.data.videoFileId.low;

              if (!fileId) {
                return (
                  <VideoMessage>
                    <FormattedMessage id="video.notReady" />
                  </VideoMessage>
                );
              }

              return (
                <Video
                  key={item.data.videoFileId.original}
                  fileId={fileId}
                  mediaFit="contain"
                  noBorder
                />
              );
            }

            return null;
          }}
        </ImageGallery>
      )}
    </>
  );
};

GalleryContent.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  loadingMore: PropTypes.bool,
  showCounter: PropTypes.bool,
  showVideoDuration: PropTypes.bool,
  truncate: PropTypes.bool,
};

export default GalleryContent;
