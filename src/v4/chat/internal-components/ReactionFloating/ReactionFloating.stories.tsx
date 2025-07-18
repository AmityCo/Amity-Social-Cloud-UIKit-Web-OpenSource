import React from 'react';
import { ReactionFloating } from './ReactionFloating';

export default {
  title: 'v4-chat/components/ReactionFloating',
};

export const ReactionFloatingComponent = {
  render: () => (
    <div
      style={{
        height: '100dvh',
        width: '500px',
        backgroundColor: 'black',
        position: 'relative',
      }}
    >
      <ReactionFloating />
    </div>
  ),
  name: 'ReactionFloating',
};
