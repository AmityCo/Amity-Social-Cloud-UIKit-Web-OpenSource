import React from 'react';
import { MessageReactionPicker } from '.';

export default {
  title: 'V4/MessageReactionPicker',
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

export const liveChatMessageReactionPicker = {
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
        <MessageReactionPicker message={message} onSelectReaction={() => {}} />
      </div>
    </div>
  ),
  name: 'MessageReactionPicker',
};
