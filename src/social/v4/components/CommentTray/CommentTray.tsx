import React from 'react';

import { CommentList } from '~/social/v4/internal-components/CommentList';
import { StoryCommentComposeBar } from '~/social/v4/internal-components/StoryCommentComposeBar';

import {
  MobileSheet,
  MobileSheetComposeBarContainer,
  MobileSheetContent,
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
  pageId: '*';
  storyId: string;
  commentId?: string;
  referenceType?: string;
  referenceId?: string;
  replyTo?: string;
  isReplying: boolean;
  limit?: number;
  isOpen: boolean;
  isJoined: boolean;
  allowCommentInStory?: boolean;
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
  pageId = '*',
  storyId,
  commentId,
  referenceType,
  referenceId,
  limit = REPLIES_PER_PAGE,
  replyTo,
  isJoined,
  isOpen,
  isReplying,
  allowCommentInStory,
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
      isOpen={isOpen}
      onClose={onClose}
      rootId={rootId}
      mountPoint={document.getElementById(rootId) as HTMLElement}
      detent="full-height"
    >
      <MobileSheetContainer>
        <MobileSheet.Header
          style={{
            backgroundColor: primaryColor,
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
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
          <MobileSheet.Scroller
            style={{
              height: 'calc(100% - 4.5rem)',
            }}
          >
            <CommentList
              referenceId={storyId}
              referenceType="story"
              onClickReply={onClickReply}
              limit={limit}
              style={{
                backgroundColor: primaryColor,
              }}
            />
          </MobileSheet.Scroller>
        </MobileSheetContent>
        <MobileSheetComposeBarContainer>
          <StoryCommentComposeBar
            referenceId={referenceId}
            referenceType={referenceType}
            commentId={commentId}
            isReplying={isReplying}
            replyTo={replyTo}
            storyId={storyId}
            isJoined={isJoined}
            allowCommentInStory={allowCommentInStory}
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
