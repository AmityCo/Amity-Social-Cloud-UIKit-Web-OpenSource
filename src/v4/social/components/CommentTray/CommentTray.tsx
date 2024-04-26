import React, { useState } from 'react';

import { CommentList } from '../../internal-components/CommentList';
import { MobileSheetComposeBarContainer } from '../../internal-components/StoryViewer/styles';
import { StoryCommentComposeBar } from '../../internal-components/StoryCommentComposeBar';

const REPLIES_PER_PAGE = 5;

interface CommentTrayProps {
  referenceType: Amity.CommentReferenceType;
  referenceId: string;
  community: Amity.Community;
  shouldAllowInteraction: boolean;
  shouldAllowCreation?: boolean;
}

export const CommentTray = ({
  referenceType,
  referenceId,
  community = {} as Amity.Community,
  shouldAllowInteraction = true,
  shouldAllowCreation = false,
}: CommentTrayProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyTo, setReplyTo] = useState<Amity.Comment | null>(null);

  const onClickReply = (comment: Amity.Comment) => {
    setIsReplying(true);
    setReplyTo(comment);
  };

  const onCancelReply = () => {
    setIsReplying(false);
    setReplyTo(null);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflowY: 'auto', flexGrow: 1 }}>
        <CommentList
          referenceId={referenceId}
          referenceType={referenceType}
          onClickReply={onClickReply}
          shouldAllowInteraction={shouldAllowInteraction}
          limit={REPLIES_PER_PAGE}
        />
      </div>
      <MobileSheetComposeBarContainer>
        <StoryCommentComposeBar
          communityId={community.communityId}
          referenceId={referenceId}
          referenceType={referenceType}
          isReplying={isReplying}
          replyTo={replyTo}
          isJoined={community.isJoined}
          shouldAllowCreation={shouldAllowCreation}
          onCancelReply={onCancelReply}
        />
      </MobileSheetComposeBarContainer>
    </div>
  );
};
