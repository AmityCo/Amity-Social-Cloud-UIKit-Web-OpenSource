import styled from 'styled-components';

export const RemoteImageButton = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;
