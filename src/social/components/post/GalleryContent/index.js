import { PostDataType } from '@amityco/js-sdk';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import GalleryGrid from '~/core/components/GalleryGrid';
import ImageGallery from '~/core/components/ImageGallery';
import Image from '~/core/components/Uploaders/Image';
import Video from '~/core/components/Uploaders/Video';
import { VideoMessage, VideoThumbnail } from './styles';

const GalleryContent = ({ items }) => {
  const [index, setIndex] = useState(null);

  return (
    <>
      <GalleryGrid items={items} onClick={setIndex} truncate>
        {item => {
          if (!item) {
            return null;
          }

          if (item.dataType === PostDataType.ImagePost) {
            return <Image key={item.data.fileId} fileId={item.data.fileId} mediaFit="cover" />;
          }

          if (item.dataType === PostDataType.VideoPost) {
            return (
              <VideoThumbnail key={item.data.thumbnailFileId} fileId={item.data.thumbnailFileId} />
            );
          }

          return null;
        }}
      </GalleryGrid>

      {index !== null && (
        <ImageGallery index={index} items={items} onChange={setIndex}>
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
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default GalleryContent;
