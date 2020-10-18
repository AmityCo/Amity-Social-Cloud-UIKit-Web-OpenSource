import styled from 'styled-components';

export const DateContainer = styled.div`
  color: ${({ theme }) => theme.palette.neutral.shade1};
  & > * {
    ${({ theme }) => theme.typography.caption}
  }
`;
