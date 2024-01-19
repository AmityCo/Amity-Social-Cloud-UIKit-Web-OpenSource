import { ReactNode } from 'react';
import styled from 'styled-components';
import { SecondaryButton } from '~/core/components/Button';
import { EllipsisH } from '~/icons';

export const OptionsIcon = styled(EllipsisH).attrs<{ icon?: ReactNode }>({ width: 16, height: 16 })`
  font-size: 16px;
  cursor: pointer;
  margin-left: auto;
`;

export const OptionsButton = styled(SecondaryButton)<{ icon?: ReactNode }>`
  padding: 5px;
  height: 2rem;
  color: ${({ theme }) => theme.palette.neutral.main};
`;

export const Option = styled.div<{ active?: boolean }>`
  cursor: pointer;
  ${({ active, theme }) => active && `color: ${theme.palette.primary.shade1};`};
  padding: 8px 12px;

  &:hover {
    background: #f2f2f4;
  }

  &.danger-zone {
    color: ${({ theme }) => theme.palette.alert.main};
  }
`;

export const Container = styled.div<{ pullRight?: boolean }>`
  ${({ pullRight }) => pullRight && `margin-left: auto;`}
`;
