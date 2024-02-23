import { ReactNode } from 'react';
import styled from 'styled-components';

import { Lock } from '~/icons';

export const PrivateFeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.palette.base.shade3};
  padding: 5rem 0.5rem;
  background: ${({ theme }) => theme.palette.system.background};
  color: ${({ theme }) => theme.palette.base.shade3};
  ${({ theme }) => theme.typography.body};
`;

export const LockIconContainer = styled.div`
  margin-bottom: 12px;
`;

export const LockIcon = styled(Lock).attrs<{ icon?: ReactNode }>({ width: 40, height: 40 })`
  fill: ${({ theme }) => theme.palette.base.shade2};
`;

export const PrivateFeedTitle = styled.div`
  font-weight: bold;
  font-size: 17px;
  color: ${({ theme }) => theme.palette.base.main};
`;

export const PrivateFeedBody = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.base.shade1};
`;
