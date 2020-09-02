import React from 'react';

import { Overlay, ModalWindow, Header, Content, Footer, CloseIcon } from './styles';

const Modal = ({ className, onOverlayClick, onCancel, title, footer, clean, children }) => (
  <Overlay onClick={onOverlayClick}>
    <ModalWindow className={className}>
      {(title || onCancel) && (
        <Header clean={clean}>
          {title}
          {onCancel && <CloseIcon onClick={onCancel} />}
        </Header>
      )}
      <Content isText={typeof children === 'string'}>{children}</Content>
      {footer && <Footer clean={clean}>{footer}</Footer>}
    </ModalWindow>
  </Overlay>
);

export default Modal;
