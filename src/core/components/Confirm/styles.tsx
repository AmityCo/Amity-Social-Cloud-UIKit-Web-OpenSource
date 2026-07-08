import styled from 'styled-components';
import Modal from '~/core/components/Modal';
import Button, { PrimaryButton } from '~/core/components/Button';

export const ConfirmModal = styled(Modal)`
  max-width: 360px;
  background: var(--asc-color-background-default);
  color: var(--asc-color-base-default);
`;

export const ConfirmModalContent = styled.div`
  padding: 1rem 1rem 0.75rem 1rem;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const DefaultOkButton = styled(PrimaryButton)`
  color: var(--asc-color-white);
  background: var(--asc-color-alert-default);
  border-radius: 0.25rem;
  text-transform: uppercase;
  &:hover {
    background: var(--asc-color-alert-default);
  }
`;
export const DefaultCancelButton = styled(Button)`
  margin-right: 10px;
  background-color: transparent;
  border: 1px solid var(--asc-color-base-shade4);
  border-radius: 0.25rem;
  text-transform: uppercase;
  color: color-mix(
    in srgb,
    var(--color-foreground-primary) calc(var(--tw-text-opacity) * 100%),
    transparent
  );
  &:hover {
    color: color-mix(
      in srgb,
      var(--color-foreground-primary) calc(var(--tw-text-opacity) * 100%),
      transparent
    );
  }
`;
