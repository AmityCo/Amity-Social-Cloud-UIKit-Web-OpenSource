import React from 'react';

import { CommentButton } from './CommentButton';

export default {
  title: 'v4-social/elements/CommentButton',
};

export const CommentButtonStory = {
  render: () => {
    return (
      <div style={{ height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'end' }}>
        <CommentButton />
      </div>
    );
  },

  name: 'CommentButton',
};
