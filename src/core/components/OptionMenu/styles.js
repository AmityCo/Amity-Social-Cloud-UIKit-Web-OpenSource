import styled from 'styled-components';
import { SecondaryButton } from '~/core/components/Button';
import { EllipsisH } from '~/icons';

export const OptionsIcon = styled(EllipsisH)`
  font-size: 16px;
  cursor: pointer;
  margin-left: auto;
`;

export const OptionsButton = styled(SecondaryButton)`
  padding: 5px;
  height: 2rem;
  color: ${({ theme }) => theme.palette.neutral.main};
`;

export const Option = styled.div`
  cursor: pointer;
  ${({ active, theme }) => active && `color: ${theme.palette.primary.shade1};`};
  padding: 8px 12px;

  &:hover {
    background: #f2f2f4;
  }
`;

export const Container = styled.div`
  margin-left: auto;
`;
