import { EkoPostDataType } from 'eko-sdk';
import React, { createContext, useContext, useMemo } from 'react';
import DefaultPostRenderer from '~/social/components/post/Post/DefaultPostRenderer';

const defaultValue = {
  [EkoPostDataType.TextPost]: DefaultPostRenderer,
  [EkoPostDataType.ImagePost]: DefaultPostRenderer,
  [EkoPostDataType.FilePost]: DefaultPostRenderer,
};

export const PostRendererContext = createContext(defaultValue);

export const usePostRenderer = () => useContext(PostRendererContext);

export default ({ children, postRenderers }) => {
  const value = useMemo(() => ({ ...defaultValue, ...postRenderers }), [postRenderers]);

  return <PostRendererContext.Provider value={value}>{children}</PostRendererContext.Provider>;
};
