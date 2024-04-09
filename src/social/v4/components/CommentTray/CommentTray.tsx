import React from 'react';

import { CommentList } from '~/social/v4/internal-components/CommentList';
import { StoryCommentComposeBar } from '~/social/v4/internal-components/StoryCommentComposeBar';

import {
  MobileSheetComposeBarContainer,
  MobileSheetContent,
  MobileSheetScroller,
} from '~/social/v4/internal-components/StoryViewer/styles';
import { FormattedMessage } from 'react-intl';
import { useCustomization } from '~/social/v4/providers/CustomizationProvider';
import { BottomSheet } from '~/core/v4/components';
import {
  MobileSheetContainer,
  MobileSheetHeader,
  MobileSheetNestedBackDrop,
} from '~/core/v4/components/BottomSheet/styles';
import { useTheme } from 'styled-components';

const REPLIES_PER_PAGE = 5;

interface CommentTrayProps {
  referenceType: Amity.CommentReferenceType;
  referenceId: string;
  community: Amity.Community;
  shouldAllowInteraction: boolean;
  shouldAllowCreation: boolean;
  pageId: '*';
  storyId: string;
  commentId?: string;
  replyTo?: string;
  isReplying: boolean;
  isOpen: boolean;
  isJoined: boolean;
  limit?: number;
  onClose: () => void;
  onClickReply: (
    replyTo?: string,
    referenceType?: Amity.Comment['referenceType'],
    referenceId?: Amity.Comment['referenceId'],
    commentId?: Amity.Comment['commentId'],
  ) => void;
  onCancelReply: () => void;
}

export const CommentTray = ({
  referenceType,
  referenceId,
  community,
  shouldAllowInteraction = true,
  shouldAllowCreation = true,
  pageId = '*',
  storyId,
  commentId,
  replyTo,
  isReplying,
  limit = REPLIES_PER_PAGE,
  isOpen,
  isJoined,
  onClose,
  onClickReply,
  onCancelReply,
}: CommentTrayProps) => {
  const theme = useTheme();
  const componentId = 'comment_tray_component';
  const { getConfig, isExcluded } = useCustomization();
  const componentConfig = getConfig(`${pageId}/${componentId}/*`);
  const isComponentExcluded = isExcluded(`${pageId}/${componentId}/*`);

  const componentTheme =
    componentConfig?.component_theme?.light_theme || theme.v4.colors.primary.shade4;
  const primaryColor = componentTheme.primary_color || theme.v4.colors.primary.shade4;

  const rootId = 'asc-uikit-stories-viewer';

  if (isComponentExcluded) return null;

  return (
    <BottomSheet
      data-qa-anchor="comment_tray_component"
      isOpen={isOpen}
      onClose={onClose}
      rootId={rootId}
      mountPoint={document.getElementById(rootId) as HTMLElement}
      detent="full-height"
    >
      <MobileSheetContainer>
        <MobileSheetHeader
          style={{
            backgroundColor: primaryColor,
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
            borderBottom: 'none',
          }}
        />
        <MobileSheetHeader
          style={{
            backgroundColor: primaryColor,
          }}
        >
          <FormattedMessage id="storyViewer.commentSheet.title" />
        </MobileSheetHeader>
        <MobileSheetContent>
          <MobileSheetScroller>
            <CommentList
              referenceId={storyId}
              referenceType={referenceType}
              onClickReply={onClickReply}
              shouldAllowInteraction={shouldAllowInteraction}
              limit={limit}
              style={{
                backgroundColor: primaryColor,
              }}
            />
          </MobileSheetScroller>
        </MobileSheetContent>
        <MobileSheetComposeBarContainer>
          <StoryCommentComposeBar
            communityId={community.communityId}
            referenceId={referenceId}
            referenceType={referenceType}
            commentId={commentId}
            isReplying={isReplying}
            replyTo={replyTo}
            storyId={storyId}
            isJoined={isJoined}
            shouldAllowCreation={shouldAllowCreation}
            onCancelReply={onCancelReply}
            style={{
              backgroundColor: primaryColor,
            }}
          />
        </MobileSheetComposeBarContainer>
      </MobileSheetContainer>
      <MobileSheetNestedBackDrop onTap={onClose} />
    </BottomSheet>
  );
};
