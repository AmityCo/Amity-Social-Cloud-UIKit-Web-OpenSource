import React from 'react';

import { ReactionButton } from './ReactionButton';

export default {
  title: 'v4-social/elements/ReactionButton',
};

export const ReactionButtonStory = {
  render: () => {
    return (
      <div style={{ height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'end' }}>
        <ReactionButton myReactions={[]} onReactionClick={() => {}} reactionsCount={0} />
      </div>
    );
  },

  name: 'ReactionButton',
};
