import React from 'react';
import PropTypes from 'prop-types';
import { PostDataType } from '@amityco/js-sdk';

import TextContent from '~/social/components/post/TextContent';
import ImageContent from '~/social/components/post/ImageContent';
import FileContent from '~/social/components/post/FileContent';

const RENDERERS = {
  [PostDataType.TextPost]: TextContent,
  [PostDataType.ImagePost]: ImageContent,
  [PostDataType.FilePost]: FileContent,
};

const PostContent = ({ data, dataType, postMaxLines }) => {
  const Renderer = RENDERERS[dataType];
  if (!data || !Renderer) return null;

  return <Renderer {...data} postMaxLines={postMaxLines} />;
};

PostContent.propTypes = {
  data: PropTypes.object,
  dataType: PropTypes.oneOf(Object.values(PostDataType)),
  postMaxLines: PropTypes.number,
};

export default PostContent;
