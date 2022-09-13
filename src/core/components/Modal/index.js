import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { IconButton } from '@noom/wax-component-library';
import useElement from '~/core/hooks/useElement';
import ConditionalRender from '~/core/components/ConditionalRender';
import { Overlay, ModalWindow, SmallModalWindow, Header, Content, Footer } from './styles';


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
            <span>{title}</span>
            <ConditionalRender condition={onCancel}>
              <IconButton size="sm" icon="close" variant="outline" onClick={onCancel} />
            </ConditionalRender>
          </Header>
        )}

        <Content isText={isText}>{children}</Content>

        {footer && <Footer clean={clean}>{footer}</Footer>}
      </ModalComponent>
    </Overlay>
  );
};

export default Modal;
