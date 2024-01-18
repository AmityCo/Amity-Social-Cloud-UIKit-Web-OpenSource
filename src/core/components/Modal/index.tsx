import React, { ReactElement, ReactNode, useEffect, useRef } from 'react';
import { Overlay, Header, Content, Footer, CloseIcon, StyledModalWindow } from './styles';

export interface ModalProps {
  'data-qa-anchor'?: string;
  size?: 'small' | '';
  className?: string;
  onOverlayClick?: () => void;
  onCancel?: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  clean?: boolean;
  children: ReactNode;
}

const Modal = ({
  'data-qa-anchor': dataQaAnchor = '',
  size = '',
  className,
  onOverlayClick = () => {},
  onCancel,
  title,
  footer,
  clean,
  children,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  // auto focus to prevent scroll on background (when focus kept on trigger button)
  useEffect(() => {
    modalRef?.current?.focus();
  }, [modalRef?.current]);

  const isText =
    typeof children === 'string' || (children as ReactElement)?.type === 'FormattedMessage';

  return (
    <Overlay onClick={onOverlayClick}>
      <StyledModalWindow
        small={size === 'small'}
        tabIndex={0}
        className={className}
        ref={modalRef}
        data-qa-anchor={dataQaAnchor}
      >
        {(title || onCancel) && (
          <Header clean={clean}>
            {title}
            {onCancel && <CloseIcon onClick={onCancel} />}
          </Header>
        )}

        <Content isText={isText}>{children}</Content>

        {footer && <Footer clean={clean}>{footer}</Footer>}
      </StyledModalWindow>
    </Overlay>
  );
};

export default Modal;
