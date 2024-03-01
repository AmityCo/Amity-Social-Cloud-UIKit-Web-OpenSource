import styled from 'styled-components';
import InputText from '~/core/components/InputText';
import { SecondaryButton } from '~/core/components/Button';

import UIAvatar from '~/core/components/Avatar';

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;

export const ReplyContainer = styled.div`
  display: flex;
  padding: 10px 12px 10px 16px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: ${({ theme }) => theme.palette.base.shade4};
  transform: translateY(100%);
  transition: transform 0.5s ease-in-out; /* Adjust the duration and timing function as needed */
`;

export const ReplyingToText = styled.span`
  ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.palette.base.shade2};
`;

export const ReplyingToUsername = styled.span`
  ${({ theme }) => theme.typography.bodyBold};
  color: ${({ theme }) => theme.palette.base.shade2};
`;

export const AnimatedReplyContainer = styled(ReplyContainer)`
  transform: translateY(0%);
`;

export const CommentComposeBarContainer = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
  background: ${({ theme }) => theme.palette.system.background};
  display: flex;
  align-items: center;
`;

export const CommentComposeBarInput = styled(InputText).attrs<{ rows?: number; maxRows?: number }>({
  rows: 1,
  maxRows: 15,
})`
  outline: none;
  flex-grow: 1;
  font: inherit;
  font-size: 14px;
  resize: vertical;
  border-radius: 1.25rem;
  color: ${({ theme }) => theme.palette.base.shade2};
  background-color: ${({ theme }) => theme.palette.base.shade4};
  border-radius: 20px;
`;

export const AddCommentButton = styled(SecondaryButton)`
  color: ${({ theme }) => theme.palette.primary.main} !important;
  cursor: pointer !important;
  padding: 0.625rem;
  margin-left: 0.625rem;
`;
