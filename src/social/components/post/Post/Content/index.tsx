import React from 'react';

import TextContent from '~/social/components/post/TextContent';
import ImageContent from '~/social/components/post/ImageContent';
import VideoContent from '~/social/components/post/VideoContent';
import FileContent from '~/social/components/post/FileContent';
import LivestreamContent from '~/social/components/post/LivestreamContent';

interface PostContentProps {
  data?: any;
  dataType?: Amity.PostContentType;
  postMaxLines?: number;
  mentionees?: Amity.User[];
}

const PostContent = ({ data, dataType, postMaxLines, mentionees }: PostContentProps) => {
  if (!data) return null;
  if (!['text', 'image', 'video', 'file', 'liveStream'].includes(dataType || '')) {
    return null;
  }

  if (dataType === 'text') {
    return <TextContent {...data} postMaxLines={postMaxLines} mentionees={mentionees} />;
  }
  if (dataType === 'image') {
    return <ImageContent {...data} postMaxLines={postMaxLines} mentionees={mentionees} />;
  }
  if (dataType === 'video') {
    return <VideoContent {...data} postMaxLines={postMaxLines} mentionees={mentionees} />;
  }
  if (dataType === 'file') {
    return <FileContent {...data} postMaxLines={postMaxLines} mentionees={mentionees} />;
  }
  if (dataType === 'liveStream') {
    return <LivestreamContent {...data} postMaxLines={postMaxLines} mentionees={mentionees} />;
  }

  return null;
};

export default PostContent;
