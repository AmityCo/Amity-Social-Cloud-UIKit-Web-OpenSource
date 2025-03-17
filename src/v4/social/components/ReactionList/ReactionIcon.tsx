import { AmityReactionType } from '~/v4/core/providers/CustomReactionProvider';
import React from 'react';

export const ReactionIcon = ({
  reactionConfigItem,
  className,
}: {
  reactionConfigItem: AmityReactionType;
  className: string;
}) => {
  return (
    <img
      data-testid="reaction_image_view"
      key={reactionConfigItem.name}
      src={reactionConfigItem.image}
      alt={reactionConfigItem.name}
      className={className}
    />
  );
};
