import { ReactNode } from 'react';
import styled from 'styled-components';

import { SortDown } from '~/icons';

export const LayoutHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #ffffff;
  border-bottom: 1px solid #ebecef;
  height: 60px;
  ${({ theme }) => theme.typography.body}
`;

export const Username = styled.div`
  margin-right: 6px;
  margin-left: 7px;
`;

export const DropdownIcon = styled(SortDown)<{ icon?: ReactNode }>`
  fill: #292b32;
  cursor: pointer;
  margin-bottom: 2px;
`;

export const DropDownContainer = styled.div`
  display: flex;
  align-items: flex-end;
  cursor: pointer;
  margin-right: 76px;
`;
