import styled from 'styled-components';
import { Icon } from '~/v4/core/components';

export const ActionButton = styled(Icon)`
  cursor: pointer;
  border-radius: 50%;
  padding: 0.25rem;
  background-color: ${({ theme }) => theme.v4.colors.actionButton.default};
`;

export const CustomActionButton = styled.img`
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
`;
