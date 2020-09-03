import styled from 'styled-components';
import Modal from 'components/Modal';
import Button, { PrimaryButton } from 'components/Button';

export const ConfirmModal = styled(Modal)`
  max-width: 360px;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const DefaultOkButton = styled(PrimaryButton)`
  color: white;
  background: ${({ theme }) => theme.color.alert};
  &:hover {
    background: ${({ theme }) => theme.color.alert};
  }
`;
export const DefaultCancelButton = styled(Button)`
  margin-right: 10px;
`;
