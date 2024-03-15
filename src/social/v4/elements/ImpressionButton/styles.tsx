import styled from 'styled-components';
import { Icon } from '~/core/v4/components/Icon';

export const IconButton = styled(Icon)<{ backgroundColor?: string }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

export const RemoteImageButton = styled.img`
  width: 1.5rem;
  height: 1.5rem;
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
