import React from 'react';
import PropTypes from 'prop-types';
import { PostDataType } from '@amityco/js-sdk';

import GalleryContent from '~/social/components/post/GalleryContent';
import FileListContent from '~/social/components/post/FileListContent';

const RENDERERS = {
  [PostDataType.ImagePost]: GalleryContent,
  [PostDataType.VideoPost]: GalleryContent,
  [PostDataType.FilePost]: FileListContent,
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
    return <Renderer key={dataType} items={items} />;
  });
};

ChildrenContent.propTypes = {
  children: PropTypes.array.isRequired,
};

export default ChildrenContent;
