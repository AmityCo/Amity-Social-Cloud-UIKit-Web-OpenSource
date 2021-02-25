import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import useElement from '~/core/hooks/useElement';
import ConditionalRender from '~/core/components/ConditionalRender';
import { Overlay, ModalWindow, Header, Content, Footer, CloseIcon } from './styles';

const Modal = ({ className, onOverlayClick, onCancel, title, footer, clean, children }) => {
  const [modalRef, modalElement] = useElement();
  // auto focus to prevent scroll on background (when focus kept on trigger button)
  useEffect(() => modalElement && modalElement.focus(), [modalElement]);

  const isText = typeof children === 'string' || children.type === FormattedMessage;

  return (
    <Overlay onClick={onOverlayClick}>
      <ModalWindow className={className} ref={modalRef} tabIndex={0}>
        <ConditionalRender condition={title || onCancel}>
          <Header clean={clean}>
            {title}
            <ConditionalRender condition={onCancel}>
              <CloseIcon onClick={onCancel} />
            </ConditionalRender>
          </Header>
        </ConditionalRender>
        <Content isText={isText}>{children}</Content>
        <ConditionalRender condition={footer}>
          <Footer clean={clean}>{footer}</Footer>
        </ConditionalRender>
      </ModalWindow>
    </Overlay>
  );
};

export default Modal;
