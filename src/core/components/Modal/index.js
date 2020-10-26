import React from 'react';

import ConditionalRender from '~/core/components/ConditionalRender';
import { Overlay, ModalWindow, Header, Content, Footer, CloseIcon } from './styles';

const Modal = ({ className, onOverlayClick, onCancel, title, footer, clean, children }) => (
  <Overlay onClick={onOverlayClick}>
    <ModalWindow className={className}>
      <ConditionalRender condition={title || onCancel}>
        <Header clean={clean}>
          {title}
          <ConditionalRender condition={onCancel}>
            <CloseIcon onClick={onCancel} />
          </ConditionalRender>
        </Header>
      </ConditionalRender>
      <Content isText={typeof children === 'string'}>{children}</Content>
      <ConditionalRender condition={footer}>
        <Footer clean={clean}>{footer}</Footer>
      </ConditionalRender>
    </ModalWindow>
  </Overlay>
);

export default Modal;
