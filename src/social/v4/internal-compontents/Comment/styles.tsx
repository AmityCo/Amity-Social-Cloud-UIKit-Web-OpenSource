import React, { ReactNode } from 'react';
import InputText from '~/core/components/InputText';
import UICommentComposeBar from '~/social/components/CommentComposeBar';
import { SecondaryButton } from '~/core/components/Button';
import { MinusCircle, Reply } from '~/icons';
import styled, { DefaultTheme } from 'styled-components';
import UIAvatar from '~/core/components/Avatar';
import Sheet from 'react-modal-sheet';

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
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
  padding: 1rem;
`;

export const MobileSheetButton = styled(SecondaryButton)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`;

export const CommentBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: #ffffff;
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
  padding-top: 16px;
`;

export const ReplyContainer = styled.div`
  display: flex;
  color: black;
  padding-top: 16px;
  padding-left: 40px;
`;

export const CommentComposeBar = styled(UICommentComposeBar)`
  border: none;
  padding: 8px 0 16px;
  background-repeat: no-repeat;
  background-image: ${({ theme }) =>
    `url('data:image/svg+xml;utf8,${getCommentComposeBarBackground(theme)}')`};
`;

export const Content = styled.div`
  width: 100%;
`;

export const CommentHeader = styled.div`
  word-break: break-all;
  margin-bottom: 5px;
`;

export const CommentContent = styled.div`
  overflow-wrap: anywhere !important;
  word-break: break-word;
  color: ${({ theme }) => theme.palette.neutral.main};
  background-color: ${({ theme }) => theme.palette.base.shade4};
  border-radius: 0 12px 12px 12px;
  padding: 12px;
  display: inline-block;
  white-space: pre-wrap;
  ${({ theme }) => theme.typography.body}
`;

export const CommentInfo = styled.div`
  margin-left: 8px;
`;

export const CommentDate = styled.span`
  margin-left: 5px;
  color: ${({ theme }) => theme.palette.neutral.shade1};
  ${({ theme }) => theme.typography.subTitle}
`;

export const EditedMark = styled.span`
  margin-left: 5px;
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
  padding: 0 0 0 4px;

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
  padding: 2px 0;
`;

export const DeletedCommentContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.palette.base.shade3};
  padding: 16px 0;

  &.reply {
    display: inline-flex;
    margin-left: 40px;
    background: ${({ theme }) => theme.palette.base.shade4};
    color: ${({ theme }) => theme.palette.base.shade2};
    border-radius: 4px;
    margin: 14px 0px;
    padding: 4px 8px 2px 0px;
  }
`;

export const DeletedReplyContainer = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 7px 0px 7px 40px;
  background: ${({ theme }) => theme.palette.base.shade4};
  color: ${({ theme }) => theme.palette.base.shade2};
  border-radius: 4px;
  padding: 4px 8px 2px 0px;
`;

export const DeletedIcon = styled(MinusCircle)<{ icon?: ReactNode }>`
  font-size: 18px;
  width: 1.25rem;
  height: 1.25rem;
`;

export const IconContainer = styled.div`
  display: flex;
  padding-right: 10px;

  &.reply {
    padding: 4px 10px 4px 4px;
  }
`;

export const MessageContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Text = styled.span`
  font-size: 14px;
`;

export const ReplyIcon = styled(Reply)<{ icon?: ReactNode }>`
  font-size: 16px;
  margin-right: 5px;
`;

export const ReplyButton = styled(SecondaryButton)``;

export const CommentEditContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;

  > * {
    margin-left: 8px;
  }
`;

export const CommentEditTextarea = styled(InputText).attrs({
  rows: 1,
  maxRows: 15,
})`
  ${({ theme }) => theme.typography.body}
  border-radius: 0rem 0.75rem 0.75rem 0.75rem;
  height: 7.5rem;
  padding: 0.75rem;
`;
