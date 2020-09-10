import styled from 'styled-components';

export const UIStyles = styled.div`
  font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
  ${({ theme }) => theme.typography.body}
  color: ${({ theme }) => theme.palette.base};
  input,
  div {
    box-sizing: border-box;
  }
`;
