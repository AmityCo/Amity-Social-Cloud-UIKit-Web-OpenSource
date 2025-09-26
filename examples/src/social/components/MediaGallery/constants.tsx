import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { EmptyImageGallery, EmptyLivestreamGallery, EmptyVideoGallery } from '~/icons';
import useMediaCollection from '~/social/hooks/collections/useMediaCollection';

export const RECORDS_PER_PAGE = 21;

export const enum EnumContentType {
  Image = 'image',
  Video = 'video',
  LiveStream = 'liveStream',
}

export const tabs = [
  { value: EnumContentType.Image, label: <FormattedMessage id="tabs.images" /> },
  { value: EnumContentType.Video, label: <FormattedMessage id="tabs.videos" /> },
  { value: EnumContentType.LiveStream, label: <FormattedMessage id="tabs.liveStreams" /> },
];

export const EmptyIcons: Partial<
  Record<Parameters<typeof useMediaCollection>[0]['dataType'], ReactNode>
> = {
  [EnumContentType.Image]: <EmptyImageGallery />,
  [EnumContentType.Video]: <EmptyVideoGallery />,
  [EnumContentType.LiveStream]: <EmptyLivestreamGallery />,
};

export const EmptyText: Partial<
  Record<Parameters<typeof useMediaCollection>[0]['dataType'], ReactNode>
> = {
  [EnumContentType.Image]: <FormattedMessage id="mediaGallery.images.empty" />,
  [EnumContentType.Video]: <FormattedMessage id="mediaGallery.videos.empty" />,
  [EnumContentType.LiveStream]: <FormattedMessage id="mediaGallery.liveStreams.empty" />,
};
