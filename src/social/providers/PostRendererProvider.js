import { PostDataType } from '@amityco/js-sdk';
import React, { createContext, useContext, useMemo } from 'react';
import DefaultPostRenderer from '~/social/components/post/Post/DefaultPostRenderer';

const defaultValue = {
  [PostDataType.TextPost]: DefaultPostRenderer,
  [PostDataType.ImagePost]: DefaultPostRenderer,
  [PostDataType.VideoPost]: DefaultPostRenderer,
  [PostDataType.FilePost]: DefaultPostRenderer,
  [PostDataType.LivestreamPost]: DefaultPostRenderer,
  [PostDataType.PollPost]: DefaultPostRenderer,
};

export const PostRendererContext = createContext(defaultValue);

export const usePostRenderer = () => useContext(PostRendererContext);

export default ({ children, postRenderers }) => {
  const value = useMemo(() => ({ ...postRenderers, ...defaultValue }), [postRenderers]);

  return <PostRendererContext.Provider value={value}>{children}</PostRendererContext.Provider>;
};
