import React from 'react';

import TextContent from './text';
import ImageContentList from './image';
import VideoContentList from './video';
import FileContentList from './file';
import File from '~/core/components/Uploaders/File';
import Image from '~/core/components/Uploaders/Image';
import Video from '~/core/components/Uploaders/Video';

const BASE_DATA_TYPE = ['image', 'video', 'file'] as const;
const TEXT_DATA_TYPE = ['text'] as const;
const ALL_DATA_TYPE = [...TEXT_DATA_TYPE, ...BASE_DATA_TYPE] as const;

type ItemsProps = {
  data: Array<unknown>;
  dataType: typeof BASE_DATA_TYPE[number];
  onRemoveChild: (postId: string) => void;
};

type ItemProps = {
  data: unknown;
  dataType: typeof BASE_DATA_TYPE[number];
  placeholder: string;
  onChangeText: (newValue: {
    text: string;
    plainText: string;
    lastMentionText?: string | undefined;
    mentions: {
      plainTextIndex: number;
      id: string;
      display: string;
    }[];
  }) => void;
  onRemoveChild: (postId: string) => void;
};

type TextItemProps = {
  data?: string | null;
  dataType: typeof TEXT_DATA_TYPE[number];
  placeholder?: string | null;
  onChangeText?: (newValue: {
    text: string;
    plainText: string;
    lastMentionText?: string | undefined;
    mentions: {
      plainTextIndex: number;
      id: string;
      display: string;
    }[];
  }) => void;
} & Pick<React.ComponentProps<typeof TextContent>, 'queryMentionees'>;

type Props = ItemsProps | ItemProps | TextItemProps;

function isTextProps(props: Props): props is TextItemProps {
  return TEXT_DATA_TYPE.includes((props as TextItemProps).dataType);
}

function isItemsProps(props: Props): props is ItemsProps {
  return Array.isArray(props.data);
}

const PostEditorContent = (props: Props) => {
  if (props.data == null) return null;

  if (isItemsProps(props)) {
    const { onRemoveChild, dataType, data, ...restProps } = props;
    switch (dataType) {
      case 'image':
        return <ImageContentList items={data} onRemove={onRemoveChild} {...restProps} />;
      case 'video':
        return <VideoContentList items={data} onRemove={onRemoveChild} {...restProps} />;
      case 'file':
        return <FileContentList items={data} onRemove={onRemoveChild} {...restProps} />;
      default:
        return null;
    }
  }

  if (isTextProps(props)) {
    const { placeholder, onChangeText, dataType, data, ...restProps } = props;
    return (
      <TextContent
        text={data}
        placeholder={placeholder || undefined}
        onChange={(newValue) => onChangeText?.(newValue)}
        {...restProps}
      />
    );
  }

  const { placeholder, onChangeText, dataType, onRemoveChild, data, ...restProps } = props;

  switch (dataType) {
    case 'image':
      return <Image {...restProps} />;
    case 'video':
      return <Video {...restProps} />;
    case 'file':
      return <File {...restProps} />;
    default:
      return null;
  }
};

export default PostEditorContent;
