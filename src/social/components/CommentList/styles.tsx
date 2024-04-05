import styled from 'styled-components';
import { Tab } from '~/icons';

export const TabIcon = styled(Tab).attrs({ height: '16px', width: '16px' })``;

export const TabIconContainer = styled.div`
  display: flex;
  margin-right: 8px;
`;

export const NoCommentsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;
