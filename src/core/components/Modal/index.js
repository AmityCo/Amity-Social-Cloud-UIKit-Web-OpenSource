import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import useElement from '~/core/hooks/useElement';
import ConditionalRender from '~/core/components/ConditionalRender';
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
      </ModalComponent>
    </Overlay>
  );
};

export default Modal;
