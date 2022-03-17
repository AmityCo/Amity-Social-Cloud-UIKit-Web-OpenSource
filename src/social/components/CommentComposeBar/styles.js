import styled from 'styled-components';
import InputText from '~/core/components/InputText';
import { PrimaryButton } from '~/core/components/Button';

import UIAvatar from '~/core/components/Avatar';

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;

export const CommentComposeBarContainer = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
  background: ${({ theme }) => theme.palette.system.background};
  display: flex;
  align-items: center;
`;

export const CommentComposeBarInput = styled(InputText).attrs({ rows: 1, maxRows: 15 })`
  outline: none;
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
