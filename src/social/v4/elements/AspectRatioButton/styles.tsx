import styled from 'styled-components';
import { Icon } from '~/core/v4/components/Icon';

export const ActionButton = styled(Icon)`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  border-radius: 50%;
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
