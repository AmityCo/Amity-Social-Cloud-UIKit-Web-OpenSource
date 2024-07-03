import React, { ReactNode, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import Close from '~/v4/icons/Close';
import { useAmityElement } from '../../hooks/uikit';

export interface ModalProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  size?: 'small' | '';
  className?: string;
  onOverlayClick?: () => void;
  onCancel?: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  dataTheme?: string;
}

const Modal = ({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  size = '',
  onOverlayClick = () => {},
  onCancel,
  title,
  footer,
  children,
}: ModalProps) => {
  const { accessibilityId, themeStyles } = useAmityElement({ pageId, componentId, elementId });

  const modalRef = useRef<HTMLDivElement | null>(null);
  // auto focus to prevent scroll on background (when focus kept on trigger button)
  useEffect(() => {
    modalRef?.current?.focus();
  }, [modalRef?.current]);

  return (
    <div className={styles.overlay} onClick={onOverlayClick} style={themeStyles}>
      <div
        className={clsx(styles.modalWindow)}
        data-qa-anchor={accessibilityId}
        ref={modalRef}
        tabIndex={0}
      >
        {onCancel && <Close className={styles.closeIcon} onClick={onCancel} />}
        {title && <div className={styles.title}>{title}</div>}

        <div className={clsx(styles.content)}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
