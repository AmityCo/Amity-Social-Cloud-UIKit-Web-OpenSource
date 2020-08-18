import styled from 'styled-components';

export const AvatarContainer = styled.div`
  background: #e3e4e8;
  border-radius: 50%;
  ${({ size }) => `
height: ${size}px;
width: ${size}px;
`}
  flex-shrink: 0;
`;
