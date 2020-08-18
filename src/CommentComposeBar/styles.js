import styled from 'styled-components';

import { PrimaryButton } from '../commonComponents/Button';

import UIAvatar from '../Avatar';

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

export const CommentComposeBarInput = styled.input`
  height: 40px;
  padding: 6px;
  outline: none;
  border: 1px solid #e3e4e8;
  border-radius: 4px;
  flex-grow: 1;
`;

export const AddCommentButton = styled(PrimaryButton)`
  height: 40px;
  padding: 10px 16px;
  margin-left: 12px;
`;
