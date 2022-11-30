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
    justify-content: center;
    color: black;
    border: none;
    align-items: center;
    padding: 1rem 0 1rem 0;
    border-bottom: none;
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

export const ShevronDownIcon = styled(ChevronDown).attrs({ height: 14, width: 14 })`
  vertical-align: middle;
  margin-left: 5px;
`;
