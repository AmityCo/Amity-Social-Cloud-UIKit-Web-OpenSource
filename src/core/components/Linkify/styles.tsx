import styled from 'styled-components';

export const Link = styled.a`
  color: ${({ theme }) => theme.palette.primary.shade1};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
