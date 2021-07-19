import styled from 'styled-components';
import { SecondaryButton } from '~/core/components/Button';

export const SideMenuItemContainer = styled(SecondaryButton)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 8px;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.palette.neutral.main};
  justify-content: left;

  &:disabled {
    color: ${({ theme }) => theme.palette.neutral.shade2};
  }

  ${({ active, theme }) =>
    active
      ? `
      background-color: ${theme.palette.primary.shade3};
      color: ${theme.palette.primary.main};
      &:hover {
        background-color: ${theme.palette.primary.shade3};
      }
    `
      : `
      &:hover {
        background-color: ${theme.palette.base.shade4};
      }
    `}}
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
      background: ${theme.palette.base.shade4};
      color: ${theme.palette.base.main};
  `}
`;
