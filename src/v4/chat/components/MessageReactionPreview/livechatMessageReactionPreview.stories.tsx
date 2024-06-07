import React from 'react';
import { MessageReactionPreview } from './';

export default {
  title: 'V4/MessageReactionPreview',
};

const message = {
  reactions: {
    like: 1,
    angry: 2,
    haha: 3,
    wow: 4,
    sad: 5,
    heart: 6,
  },
  reactionsCount: 21,
  myReactions: ['grinning'],
};

export const liveChatMessageReactionPreview = {
  render: () => (
    <div
      style={{
        height: '100px',
        width: '500px',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          width: 'max-content',
          margin: 'auto',
        }}
      >
        <MessageReactionPreview message={message} />
      </div>
    </div>
  ),
  name: 'MessageReactionPreview',
};
