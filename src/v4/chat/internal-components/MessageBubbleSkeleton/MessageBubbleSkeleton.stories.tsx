import React from 'react';
import { MessageBubbleSkeleton } from './MessageBubbleSkeleton';

export default {
  title: 'v4-chat/internal-components/MessageBubbleSkeleton',
};

const SampleMessageBubbleSkeleton = () => {
  return (
    <div
      style={{
        height: '100%',
        background: 'black',
        maxWidth: '450px',
        margin: 'auto',

        position: 'relative',
      }}
    >
      <div
        style={{
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column-reverse',
          overflow: 'scroll',
          gap: '0.5rem',
          width: '100%',
          boxSizing: 'border-box',
          position: 'absolute',
          bottom: 0,
          padding: '2rem 1rem',
        }}
      >
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <MessageBubbleSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export const MessageBubbleSkeletonStory = {
  render: () => <SampleMessageBubbleSkeleton />,
  name: 'MessageBubbleSkeleton',
};
