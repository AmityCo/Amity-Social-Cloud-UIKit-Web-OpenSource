import React, { useEffect } from 'react';
import { CustomRendererProps, RendererProps, Tester } from './types';

export const renderer = (props: CustomRendererProps) => {
  useEffect(() => {
    props.action('play');
  }, [props.story]);
  const Content = props.story.originalContent;
  return <Content {...props} />;
};

export const tester: Tester = (story) => {
  return {
    condition: !!story.content,
    priority: 2,
  };
};

export default {
  renderer,
  tester,
};
