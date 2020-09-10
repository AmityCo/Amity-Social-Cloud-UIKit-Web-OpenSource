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
    background-color: ${({ theme }) => theme.palette.base4};
  }
  &:disabled {
    color: #abaeba;
  }
  ${({ active, theme }) =>
    active &&
    `
      background: ${theme.palette.primary4};
      color: ${theme.palette.primary1};
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
      background: ${theme.palette.primary};
      color: white;
    `
      : `
      background:${theme.palette.base4};
      color: #898e9e;
  `}
`;
