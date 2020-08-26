import styled from 'styled-components';
import Modal from '../Modal';
import Button, { PrimaryButton } from '../Button';

export const ConfirmModal = styled(Modal)`
  max-width: 360px;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const DefaultOkButton = styled(PrimaryButton)`
  color: white;
  background: #fa4d30;
  &:hover {
    background: #fa4d30;
  }
`;
export const DefaultCancelButton = styled(Button)`
  margin-right: 10px;
`;
