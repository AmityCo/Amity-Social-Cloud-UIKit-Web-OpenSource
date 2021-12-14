import React from 'react';
import PropTypes from 'prop-types';
import { PostDataType } from '@amityco/js-sdk';

import TextContent from './text';
import ImageContentList from './image';
import VideoContentList from './video';
import FileContentList from './file';
import File from '~/core/components/Uploaders/File';
import Image from '~/core/components/Uploaders/Image';
import Video from '~/core/components/Uploaders/Video';

const RENDERERS = {
  [PostDataType.TextPost]: TextContent,
  [PostDataType.ImagePost]: Image,
  [PostDataType.VideoPost]: Video,
  [PostDataType.FilePost]: File,
};

const LIST_RENDERERS = {
  [PostDataType.ImagePost]: ImageContentList,
  [PostDataType.VideoPost]: VideoContentList,
  [PostDataType.FilePost]: FileContentList,
};

const PostEditorContent = ({
  data,
  dataType,
  onChangeText,
  onRemoveChild,
  placeholder,
  ...props
}) => {
  const isList = Array.isArray(data);
  const Renderer = (isList ? LIST_RENDERERS : RENDERERS)[dataType];
  if (!data || !Renderer) return null;

  const dataProps = isList ? { items: data } : data;

  return (
    <Renderer
      {...dataProps}
      onChangeText={onChangeText}
      onRemove={onRemoveChild}
      placeholder={placeholder}
      {...props}
    />
  );
};

PostEditorContent.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  dataType: PropTypes.oneOf(Object.values(PostDataType)),
  onChangeText: PropTypes.func,
  onRemoveChild: PropTypes.func,
  placeholder: PropTypes.string,
};

export default PostEditorContent;
