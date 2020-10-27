import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';

import Button from '~/core/components/Button';

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

export const ShevronDownIcon = styled(FaIcon).attrs({ icon: faChevronDown })`
  font-size: 16px;
  margin-left: 5px;
`;
