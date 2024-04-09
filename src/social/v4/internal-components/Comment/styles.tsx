import React, { ReactNode } from 'react';
import InputText from '~/core/components/InputText';
import UICommentComposeBar from '~/social/components/CommentComposeBar';
import { SecondaryButton } from '~/core/components/Button';
import { MinusCircle, Reply } from '~/icons';
import styled, { DefaultTheme } from 'styled-components';
import UIAvatar from '~/core/components/Avatar';
import Sheet from 'react-modal-sheet';

export const Avatar = styled(UIAvatar)`
  margin-right: 0.5rem;
`;

export const TimeContainer = styled.div`
  color: ${({ theme }) => theme.palette.base.shade2};
`;

export const EngagementButton = styled(SecondaryButton)`
  padding: 0.5rem;
  color: ${({ theme }) => theme.palette.base.shade2};
`;

export const LikeButton = styled(SecondaryButton)<{ isLiked?: boolean }>`
  padding: 0.25rem;
  color: ${({ theme, isLiked }) =>
    isLiked ? theme.palette.primary.main : theme.palette.neutral.shade2};
`;

export const CommentInteractionButton = styled(SecondaryButton)`
  color: ${({ theme }) => theme.palette.neutral.shade2};
  padding: 0.25rem;
`;

export const MobileSheet = styled(Sheet)`
  margin: 0 auto;
  width: 100%;
`;

export const MobileSheetNestedBackDrop = styled(MobileSheet.Backdrop)`
  background-color: rgba(0, 0, 0, 0.5);
`;

export const MobileSheetContainer = styled(MobileSheet.Container)`
  z-index: 100;
`;

export const MobileSheetHeader = styled(MobileSheet.Header)`
  z-index: 100;
`;

export const MobileSheetContent = styled(MobileSheet.Content)`
  z-index: 100;
  padding: 0rem 1rem;
`;

export const MobileSheetButton = styled(SecondaryButton)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 0.5rem;
`;

export const CommentBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: start;
  justify-content: flex-start;
  overflow: hidden;
`;

export const AuthorName = styled.div`
  display: inline !important;
  ${({ theme }) => theme.typography.captionBold}
`;

export const CommentBubble = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  background-color: #f0f0f0;
  border-top-right-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
`;

const encodeHexColor = (hex: string) => hex.replace('#', '%23');

const getCommentComposeBarBackground = (theme: DefaultTheme) =>
  `<svg xmlns="http://www.w3.org/2000/svg" height="40">
<path d="M20 0 L 20 40" stroke="${encodeHexColor(theme.palette.base.shade4)}" />
</svg>`;

export const CommentContainer = styled.div`
  display: flex;
  width: 100%;
  color: black;
  padding-top: 1rem;
`;

export const ReplyContainer = styled.div`
  display: flex;
  color: black;
  padding-top: 1rem;
  padding-left: 2.5rem;
`;

export const CommentComposeBar = styled(UICommentComposeBar)`
  border: none;
  padding: 0.5rem 0 1rem;
  background-repeat: no-repeat;
  background-image: ${({ theme }) =>
    `url('data:image/svg+xml;utf8,${getCommentComposeBarBackground(theme)}')`};
`;

export const Content = styled.div`
  width: 100%;
`;

export const CommentHeader = styled.div`
  word-break: break-all;
  margin-bottom: 0.3125rem;
`;

export const CommentContent = styled.div`
  overflow-wrap: anywhere !important;
  word-break: break-word;
  color: ${({ theme }) => theme.palette.neutral.main};
  background-color: ${({ theme }) => theme.palette.base.shade4};
  border-radius: 0 0.75rem 0.75rem 0.75rem;
  padding: 0.75rem;
  display: inline-block;
  white-space: pre-wrap;
  ${({ theme }) => theme.typography.body}
`;

export const CommentInfo = styled.div`
  margin-left: 0.5rem;
`;

export const CommentDate = styled.span`
  margin-left: 0.3125rem;
  color: ${({ theme }) => theme.palette.neutral.shade1};
  ${({ theme }) => theme.typography.subTitle}
`;

export const EditedMark = styled.span`
  margin-left: 0.3125rem;
  color: ${({ theme }) => theme.palette.neutral.shade1};
  ${({ theme }) => theme.typography.subTitle}

  &:before {
    content: '(';
  }

  &:after {
    content: ')';
  }
`;

export const ReadMoreButton = styled(SecondaryButton)`
  color: ${({ theme }) => theme.palette.primary.main};
  padding: 0 0 0 0.25rem;

  &:hover {
    background: none;
    text-decoration: underline;
  }
`;

export const InteractionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ReactionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const InteractionBar = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.5rem;
  align-items: center;
  padding: 0.125rem 0;
`;

export const DeletedCommentContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.palette.base.shade3};
  padding: 1rem 0;

  &.reply {
    display: inline-flex;
    margin-left: 2.5rem;
    background: ${({ theme }) => theme.palette.base.shade4};
    color: ${({ theme }) => theme.palette.base.shade2};
    border-radius: 0.25rem;
    margin: 0.875rem 0;
    padding: 0.25rem 0.5rem 0.125rem 0;
  }
`;

export const DeletedReplyContainer = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 0.4375rem 0 0.4375rem 2.5rem;
  background: ${({ theme }) => theme.palette.base.shade4};
  color: ${({ theme }) => theme.palette.base.shade2};
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem 0.125rem 0;
`;

export const DeletedIcon = styled(MinusCircle)<{ icon?: ReactNode }>`
  font-size: 1.125rem;
  width: 1.25rem;
  height: 1.25rem;
`;

export const IconContainer = styled.div`
  display: flex;
  padding-right: 0.625rem;

  &.reply {
    padding: 0.25rem 0.625rem 0.25rem 0.25rem;
  }
`;

export const MessageContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Text = styled.span`
  font-size: 0.875rem;
`;

export const ReplyIcon = styled(Reply)<{ icon?: ReactNode }>`
  font-size: 1rem;
  margin-right: 0.3125rem;
`;

export const ReplyButton = styled(SecondaryButton)``;

export const CommentEditContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;

  > * {
    margin-left: 0.5rem;
  }
`;

export const CommentEditTextarea = styled(InputText).attrs({
  rows: 1,
  maxRows: 15,
})`
  ${({ theme }) => theme.typography.body}
  border-radius: 0 0.75rem 0.75rem 0.75rem;
  height: 7.5rem;
  padding: 0.75rem;
`;

export const ReactionListButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.v4.colors.base.shade2};
`;

export const ReactionsListButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 1;
`;

export const ReactionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  margin-left: -0.25rem;

  &:first-child {
    margin-left: 0;
  }
`;
