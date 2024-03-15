import styled from 'styled-components';
import { Icon } from '~/core/v4/components/Icon';

export const UIOverflowButton = styled(Icon)<{ backgroundColor?: string }>`
  cursor: pointer;
  fill: #ffffff;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

export const RemoteImageButton = styled.img`
  width: 1.5rem;
  height: 1.5rem;
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
