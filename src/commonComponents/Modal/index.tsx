import React, { useState } from 'react';

import { Overlay, ModalWindow, Header, Content, Footer, CloseIcon } from './styles';

const Modal = ({ className, onOverlayClick, onClose, title, footer, clean, children }) => (
  <Overlay onClick={onOverlayClick}>
    <ModalWindow className={className}>
      {(title || onClose) && (
        <Header clean={clean}>
          {title}
          {onClose && <CloseIcon onClick={onClose} />}
        </Header>
      )}
      <Content isText={typeof children === 'string'}>{children}</Content>
      {footer && <Footer clean={clean}>{footer}</Footer>}
    </ModalWindow>
  </Overlay>
);

export default Modal;
