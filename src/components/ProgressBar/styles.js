import styled from 'styled-components';

export const LoadingIndicator = styled.div`
  width: ${({ progress }) => progress}%;
  background: ${({ lightMode, theme }) =>
    lightMode ? theme.palette.primary.main : theme.palette.base.shade4};
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
`;
