import { PostDataType } from '@amityco/js-sdk';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { EmptyImageGallery, EmptyLivestreamGallery, EmptyVideoGallery } from '~/icons';

export const RECORDS_PER_PAGE = 21;

export const tabs = [
  { value: PostDataType.ImagePost, label: <FormattedMessage id="tabs.images" /> },
  { value: PostDataType.VideoPost, label: <FormattedMessage id="tabs.videos" /> },
  { value: PostDataType.LivestreamPost, label: <FormattedMessage id="tabs.livestreams" /> },
];

export const EmptyIcons = {
  [PostDataType.ImagePost]: <EmptyImageGallery />,
  [PostDataType.VideoPost]: <EmptyVideoGallery />,
  [PostDataType.LivestreamPost]: <EmptyLivestreamGallery />,
};

export const EmptyText = {
  [PostDataType.ImagePost]: <FormattedMessage id="mediaGallery.images.empty" />,
  [PostDataType.VideoPost]: <FormattedMessage id="mediaGallery.videos.empty" />,
  [PostDataType.LivestreamPost]: <FormattedMessage id="mediaGallery.livestreams.empty" />,
};
