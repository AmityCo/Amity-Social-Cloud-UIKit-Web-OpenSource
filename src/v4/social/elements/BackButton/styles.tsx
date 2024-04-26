import styled from 'styled-components';
import { Icon } from '~/v4/core/components';

export const UIBackButton = styled(Icon)`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  border-radius: 50%;
  padding: 0.375rem 0rem;
  background: ${({ theme }) => theme.v4.colors.actionButton.default};
  fill: ${({ theme }) => theme.v4.colors.baseInverse.default};
`;

export const UIBackButtonImage = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
`;
