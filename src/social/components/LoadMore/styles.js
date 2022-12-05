import styled from 'styled-components';

import Button from '~/core/components/Button';
import { ChevronDown } from '~/icons';

export const LoadMoreButton = styled(Button)`
  width: 100%;
  &.text-center {
    justify-content: center;
  }

  border-radius: 8px;
  padding: 1rem;
  ${({ theme }) => theme.typography.captionBold}
  color: ${({ theme }) => theme.palette.neutral.main};
  background-color: ${({ theme }) => theme.palette.background.main};

  &.no-border {
    border: none;
  }

  &.comments-button {
    justify-content: center;
    color: black;
    border: none;
    align-items: center;

    border-bottom: none;
  }

  &.reply-button {
    width: fit-content;
    margin: 12px 0px 16px 3rem;
    border: none;
  }
`;

export const ShevronDownIcon = styled(ChevronDown).attrs({ height: 14, width: 14 })`
  vertical-align: middle;
  margin-left: 5px;
`;
