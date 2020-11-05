import styled from 'styled-components';

import TextareaAutosize from 'react-autosize-textarea';
import { PrimaryButton } from '~/core/components/Button';

import UIAvatar from '~/core/components/Avatar';

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;

export const CommentComposeBarContainer = styled.div`
  padding-top: 16px;
  background: #ffffff;
  border-top: 1px solid #e3e4e8;
  display: flex;
  align-items: center;
`;

export const CommentComposeBarInput = styled(TextareaAutosize).attrs({ rows: 1, maxRows: 15 })`
  height: 22px;
  padding: 10px 6px 6px;
  outline: none;
  border: 1px solid #e3e4e8;
  border-radius: 4px;
  flex-grow: 1;
  font: inherit;
  font-size: 14px;
  resize: vertical;
`;

export const AddCommentButton = styled(PrimaryButton)`
  height: 40px;
  padding: 10px 16px;
  margin-left: 12px;
`;
