import styled from 'styled-components';
import { SecondaryButton } from 'components/Button';

export const SideMenuItemContainer = styled(SecondaryButton)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 8px;
  margin-bottom: 6px;
  color: #17181c;
  &:hover {
    background-color: ${({ theme }) => theme.palette.base.shade4};
  }
  &:disabled {
    color: ${({ theme }) => theme.color.neutral2};
  }
  ${({ active, theme }) =>
    active &&
    `
      background: ${theme.palette.primary.shade4};
      color: ${theme.palette.primary.main};
    `}
`;

export const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  ${({ active, theme }) =>
    active
      ? `
      background: ${theme.palette.primary.main};
      color: white;
    `
      : `
      background:${theme.palette.base.shade4};
      color: #898e9e;
  `}
`;
