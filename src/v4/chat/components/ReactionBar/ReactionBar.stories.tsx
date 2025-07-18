import React from 'react';
import { ReactionBar } from './ReactionBar';

export default {
  title: 'v4-chat/components/ReactionBar',
};

export const ReactionBarComponent = {
  render: () => (
    <div
      style={{
        height: '100px',
        width: '500px',
        backgroundColor: 'black',
      }}
    >
      <div
        style={{
          width: 'max-content',
          margin: 'auto',
        }}
      >
        <ReactionBar targetType="" targetId="" />
      </div>
    </div>
  ),
  name: 'ReactionBar',
};
