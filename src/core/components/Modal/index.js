import React, { useEffect } from 'react';

import {
  Modal as WaxModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@noom/wax-component-library';
import useElement from '~/core/hooks/useElement';

const Modal = ({ size, className, onOverlayClick, onCancel, title, footer, isOpen, children }) => {
  const [modalRef, modalElement] = useElement();
  // auto focus to prevent scroll on background (when focus kept on trigger button)
  useEffect(() => modalElement && modalElement.focus(), [modalElement]);

  const attrProps = { className, ref: modalRef };

  const modalSize = size === 'small' ? 'sm' : 'lg';

  return (
    <WaxModal isCentered isOpen={isOpen} onClose={onCancel ?? onOverlayClick} size={modalSize}>
      <ModalOverlay />

      <ModalContent tabIndex={0} marginY={0} {...attrProps}>
        {title && <ModalHeader>{title}</ModalHeader>}
        {onCancel && <ModalCloseButton />}
        <ModalBody maxH="calc(100vh - 100px)" overflowY="auto">
          {children}
        </ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </WaxModal>
  );
};

export default Modal;
