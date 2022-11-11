import React, { useEffect } from 'react';

import {
  Modal as WaxModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useBreakpointValue,
} from '@noom/wax-component-library';
import useElement from '~/core/hooks/useElement';

const Modal = ({
  size,
  isCentered,
  className,
  onOverlayClick,
  onCancel,
  title,
  footer,
  isOpen,
  children,
  scrollBehavior,
}) => {
  const [modalRef, modalElement] = useElement();
  // auto focus to prevent scroll on background (when focus kept on trigger button)
  useEffect(() => modalElement && modalElement.focus(), [modalElement]);
  const forceCentered = useBreakpointValue({
    base: false,
    md: true,
  });

  const attrProps = { className, ref: modalRef };

  const modalSize = size === 'small' ? 'sm' : 'lg';

  return (
    <WaxModal
      isOpen={isOpen}
      isCentered={isCentered || forceCentered}
      onClose={onCancel ?? onOverlayClick}
      size={modalSize}
      scrollBehavior={scrollBehavior}
    >
      <ModalOverlay />

      <ModalContent tabIndex={0} marginY={0} {...attrProps}>
        {title && <ModalHeader>{title}</ModalHeader>}
        {onCancel && <ModalCloseButton />}
        <ModalBody>{children}</ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </WaxModal>
  );
};

export default Modal;
