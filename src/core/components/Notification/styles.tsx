import { ReactNode } from 'react';
import styled from 'styled-components';
import { Check, ExclamationCircle, Remove } from '~/icons';

export const SuccessIcon = styled(Check)<{ icon?: ReactNode }>`
  font-size: 18px;
  margin-right: 8px;
`;

export const InfoIcon = styled(ExclamationCircle)<{ icon?: ReactNode }>`
  font-size: 18px;
  margin-right: 8px;
`;

export const ErrorIcon = styled(Remove)<{ icon?: ReactNode }>`
  font-size: 18px;
  margin-right: 8px;
`;

export const Notifications = styled.div`
  position: fixed;
  padding-top: 50px;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 9999;
  pointer-events: none;
`;

export const NotificationContainer = styled.div`
  width: 480px;
  padding: 8px 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: ${({ theme }) => theme.palette.base.main};
  border-radius: 4px;
  margin-bottom: 10px;

  animation-duration: 0.3s;
  animation-name: appear;

  @keyframes appear {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
  pointer-events: auto;
`;
