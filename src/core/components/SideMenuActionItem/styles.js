import styled, { css } from 'styled-components';
import { SecondaryButton } from '~/core/components/Button';

const actionItemActiveStyles = css`
  ${({ active, theme }) =>
    active &&
    `
      background-color: ${theme.palette.tertiary.shade2};
      & > .actionItemChild {
        color: ${theme.palette.primary.main};
      }
    `}
`;

const actionItemContainerStyles = css`
  display: flex;
  align-items: center;
  padding: 5px 8px;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.palette.neutral.main};
  justify-content: left;
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.palette.tertiary.shade1};
  }
  &:disabled {
    color: ${({ theme }) => theme.palette.neutral.shade2};
    background-color: transparent;
  }
  ${actionItemActiveStyles}
`;

// important tags are here because styled components can not override WAX without it
export const ButtonActionItem = styled(SecondaryButton)`
  ${actionItemContainerStyles};
  width: 100% !important;
  border-radius: 0 !important;
  justify-content: flex-start !important;
  padding: 0.5rem !important;
  min-height: 3rem;
`;

export const AnchorActionItem = styled.a`
  cursor: pointer;
  ${actionItemContainerStyles}
  ${({ theme }) => theme.typography.bodyBold}
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
      ? css`
          background: ${theme.palette.primary.main};
          // TODO: check color with design
          color: white;
        `
      : css`
          background: ${theme.palette.tertiary.main};
          color: inherit;
        `};
`;
