import styled from 'styled-components';
import { Icon } from '~/core/v4/components/Icon';

export const UIBackButton = styled(Icon)<{ backgroundColor?: string }>`
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: 0,
  left: 0,
  cursor: pointer;
  border-radius: 50%;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

export const UIBackButtonImage = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
`;
