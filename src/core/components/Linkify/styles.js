import styled from 'styled-components';

export const Link = styled.a`
  color: ${({ theme }) => theme.palette.primary.main};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:visited {
    color: #663366; // Google's visited color code
  }
`;
