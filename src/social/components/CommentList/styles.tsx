import styled from 'styled-components';
import { Tab } from '~/icons';

export const TabIcon = styled(Tab).attrs({ height: '16px', width: '16px' })``;

export const TabIconContainer = styled.div`
  display: flex;
  margin-right: 8px;
`;

export const NoCommentsContainer = styled.div`
  ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.palette.base.shade2};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
