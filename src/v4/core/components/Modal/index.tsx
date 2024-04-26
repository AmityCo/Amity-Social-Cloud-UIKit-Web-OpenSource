import React, { ReactNode, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import Close from '~/v4/icons/Close';

export interface ModalProps {
  'data-qa-anchor'?: string;
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
  'data-qa-anchor': dataQaAnchor = '',
  size = '',
  onOverlayClick = () => {},
  onCancel,
  title,
  footer,
  children,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  // auto focus to prevent scroll on background (when focus kept on trigger button)
  useEffect(() => {
    modalRef?.current?.focus();
  }, [modalRef?.current]);

  return (
    <div className={styles.overlay} onClick={onOverlayClick}>
      <div
        className={clsx(styles.modalWindow, `${size === 'small' ? 'smallModalWindow' : ''}`)}
        data-qa-anchor={dataQaAnchor}
        ref={modalRef}
        tabIndex={0}
      >
        {(title || onCancel) && (
          <div className={styles.header}>
            {title}
            {onCancel && <Close className={styles.closeIcon} onClick={onCancel} />}
          </div>
        )}

        <div className={clsx(styles.content)}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
