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
  background: ${({ theme }) => theme.palette.neutral.shade3};
  &:hover {
    background: ${({ theme }) => theme.palette.neutral.shade1};
  }
`;
export const DefaultCancelButton = styled(Button)`
  margin-right: 10px;
`;
