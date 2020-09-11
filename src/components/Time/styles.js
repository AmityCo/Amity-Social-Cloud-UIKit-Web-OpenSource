import styled from 'styled-components';

export const DateContainer = styled.div`
  color: ${({ theme }) => theme.color.neutral1};
  ${({ theme }) => theme.typography.caption}
`;
