import styled from 'styled-components';

export const Link = styled.a`
  &,
  &:visited {
    color: ${({ theme }) => theme.palette.primary};
    text-decoration: none;
  }
`;
