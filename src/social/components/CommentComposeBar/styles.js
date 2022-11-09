import styled from 'styled-components';
import InputText from '~/core/components/InputText';
import { PrimaryButton } from '~/core/components/Button';

import UIAvatar from '~/core/components/Avatar';

export const Avatar = UIAvatar;

export const CommentComposeBarContainer = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
  background: ${({ theme }) => theme.palette.system.background};
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 960px) {
    & > div:last-child {
      width: 100%;
    }
  }
`;

export const CommentComposeBarInput = styled(InputText).attrs({ rows: 1, maxRows: 15 })`
  outline: none;
  flex-grow: 1;
  font: inherit;
  font-size: 14px;
  resize: vertical;

  @media (max-width: 960px) {
    width: calc(100% - 50px);
  }
`;
