import styled from 'styled-components';
import { Icon } from '~/v4/core/components';

export const ActionButton = styled(Icon)`
  width: 1.5rem;
  height: 1.5rem;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 50%;
  position: absolute;
  top: 96px;
  left: 24px;
  z-index: 99999;
`;

export const CustomActionButton = styled.img`
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
