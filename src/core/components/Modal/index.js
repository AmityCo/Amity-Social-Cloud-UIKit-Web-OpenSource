import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import useElement from '~/core/hooks/useElement';
import {
  Overlay,
  ModalWindow,
  SmallModalWindow,
  Header,
  Content,
  Footer,
  CloseIcon,
} from './styles';

const Modal = ({ size, className, onOverlayClick, onCancel, title, footer, clean, children }) => {
  const [modalRef, modalElement] = useElement();
  // auto focus to prevent scroll on background (when focus kept on trigger button)
  useEffect(() => modalElement && modalElement.focus(), [modalElement]);

  const isText = typeof children === 'string' || children.type === FormattedMessage;

  const attrProps = { className, ref: modalRef };

  const ModalComponent = size === 'small' ? SmallModalWindow : ModalWindow;

  return (
    <Overlay onClick={onOverlayClick}>
      <ModalComponent tabIndex={0} {...attrProps}>
        {(title || onCancel) && (
          <Header clean={clean}>
            {title}
            {onCancel && <CloseIcon onClick={onCancel} />}
          </Header>
        )}

        <Content isText={isText}>{children}</Content>

        {footer && <Footer clean={clean}>{footer}</Footer>}
      </ModalComponent>
    </Overlay>
  );
};

export default Modal;
