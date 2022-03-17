import styled from 'styled-components';
import Modal from '~/core/components/Modal';
import Button, { PrimaryButton } from '~/core/components/Button';

export const ConfirmModal = styled(Modal)`
  max-width: 360px;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const DefaultOkButton = styled(PrimaryButton)`
  color: white;
  background: ${({ theme }) => theme.palette.alert.main};
  &:hover {
    background: ${({ theme }) => theme.palette.alert.main};
  }
`;
export const DefaultCancelButton = styled(Button)`
  margin-right: 10px;
`;
