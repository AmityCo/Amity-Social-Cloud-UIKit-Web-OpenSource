import styled from 'styled-components';
import { Icon } from '~/core/v4/components/Icon';

export const IconButton = styled(Icon)`
  width: 1rem;
  height: 1rem;
  position: absolute;
  bottom: 0rem;
  right: 0rem;
  cursor: pointer;
  border-radius: 50%;
  z-index: 100;
`;

export const RemoteImageButton = styled.img`
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

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;
