import styled from 'styled-components';

export const LoadingIndicator = styled.div.attrs<{ progress?: number; lightMode?: boolean }>(
  ({ progress }) => ({
    style: { width: `${progress || 0}%` },
  }),
)`
  background: ${({ lightMode, theme }) =>
    lightMode ? theme.palette.primary.main : theme.palette.base.shade4};
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  opacity: 0.75;
  transition: width 0.4s ease;
  animation: glow 0.8s alternate infinite linear;

  @keyframes glow {
    from {
      opacity: 0.5;
    }
    to {
      opacity: 0.75;
    }
  }
`;
