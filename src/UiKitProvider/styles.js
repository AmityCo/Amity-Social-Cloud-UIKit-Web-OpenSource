import styled from 'styled-components';

export const UIStyles = styled.div`
  ${({ theme }) => theme.typography.body}
  color: #292B32;
  input,
  div {
    box-sizing: border-box;
  }
`;
