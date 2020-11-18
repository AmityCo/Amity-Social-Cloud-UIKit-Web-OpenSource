import React from 'react';
import PropTypes from 'prop-types';
import { EkoPostDataType } from 'eko-sdk';

import TextContent from './text';
import ImageContentList from './image';
import FileContentList from './file';
import File from '~/core/components/Uploaders/File';
import Image from '~/core/components/Uploaders/Image';

const RENDERERS = {
  [EkoPostDataType.TextPost]: TextContent,
  [EkoPostDataType.ImagePost]: Image,
  [EkoPostDataType.FilePost]: File,
};

const LIST_RENDERERS = {
  [EkoPostDataType.ImagePost]: ImageContentList,
  [EkoPostDataType.FilePost]: FileContentList,
};

const PostEditorContent = ({ data, dataType, onChangeText, onRemoveChild, placeholder }) => {
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
    />
  );
};

PostEditorContent.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  dataType: PropTypes.oneOf(Object.values(EkoPostDataType)),
  onChangeText: PropTypes.func,
  onRemoveChild: PropTypes.func,
  placeholder: PropTypes.string,
};

export default PostEditorContent;
