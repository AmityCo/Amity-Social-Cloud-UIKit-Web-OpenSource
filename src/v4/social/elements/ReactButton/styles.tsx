import styled from 'styled-components';

export const UIReactButton = styled.button`
  ${({ theme }) => theme.typography.bodyBold};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
  border-radius: 1.5rem;
  padding: 0.5rem 0.625rem;
  background-color: #292b32;
  cursor: pointer;
  border: none;
  color: ${({ theme }) => theme.v4.colors.baseInverse.default};
`;

export const UIRemoteImageButton = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.baseInverse.default};
`;
