import styled from 'styled-components';

import Button from '~/core/components/Button';
import { ChevronDown } from '~/icons';

export const LoadMoreButton = styled(Button)`
  width: 100%;
  &.text-center {
    justify-content: center;
  }
  color: ${({ theme }) => theme.palette.base.shade2};
  border: 1px solid ${({ theme }) => theme.palette.base.shade4};
  border-radius: 0;

  &.no-border {
    border: none;
  }

  &.comments-button {
    justify-content: flex-start;
    color: black;
    border: none;
    margin-top: 16px;
    padding: 0 0 16px 0;
    border-bottom: 1px solid #e3e4e8;
  }

  &.reply-button {
    width: fit-content;
    background-color: ${({ theme }) => theme.palette.base.shade4};
    color: ${({ theme }) => theme.palette.base.shade1};
    margin: 12px 0px 16px 3rem;
    padding: 5px 12px;
    border-radius: 8px;
    ${({ theme }) => theme.typography.captionBold}
  }
`;

export const ShevronDownIcon = styled(ChevronDown).attrs({
  width: 14,
  height: 14,
})`
  font-size: 16px;
  margin-left: 5px;
`;
