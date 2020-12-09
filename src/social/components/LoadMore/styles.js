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
`;

export const ShevronDownIcon = styled(ChevronDown)`
  font-size: 16px;
  margin-left: 5px;
`;
