import React from 'react';
import PropTypes from 'prop-types';
import { PostDataType } from '@amityco/js-sdk';

import GalleryContent from '~/social/components/post/GalleryContent';
import FileListContent from '~/social/components/post/FileListContent';
import PollContent from '~/social/components/post/PollContent';

import * as StreamItem from '~/social/components/post/GalleryContent/StreamItem';
import * as VideoItem from '~/social/components/post/GalleryContent/VideoItem';
import { LivestreamRenderer } from './styles';

const RENDERERS = {
  [PostDataType.ImagePost]: GalleryContent,
  [PostDataType.VideoPost]: GalleryContent,
  [PostDataType.FilePost]: FileListContent,
  [PostDataType.PollPost]: PollContent,
  [PostDataType.LivestreamPost]: LivestreamRenderer,
};

const thumbnailRenderers = {
  [PostDataType.VideoPost]: props => (
    <VideoItem.Thumbnail {...props} showPlayIcon showVideoDuration />
  ),
  [PostDataType.LivestreamPost]: props => (
    <StreamItem.Thumbnail {...props} showPlayIcon showLivestreamRecordedBadge showVideoDuration />
  ),
};

const ChildrenContent = ({ children }) => {
  // group children by renderable dataType
  const groups = Object.keys(RENDERERS)
    .map(dataType => children.filter(child => child.dataType === dataType))
    .filter(items => items && !!items.length) // remove empty collections
    .reduce(
      (acc, items) => ({
        ...acc,
        [items[0].dataType]: items,
      }),
      {},
    ); // merge all

  if (!Object.keys(groups).length) return null;

  return Object.entries(groups).map(([dataType, items]) => {
    const Renderer = RENDERERS[dataType];
    return <Renderer key={dataType} items={items} thumbnailRenderers={thumbnailRenderers} />;
  });
};

ChildrenContent.propTypes = {
  children: PropTypes.array.isRequired,
};

export default ChildrenContent;
