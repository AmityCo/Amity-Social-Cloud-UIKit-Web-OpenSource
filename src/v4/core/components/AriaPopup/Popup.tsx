import clsx from 'clsx';
import { CloseButton } from '~/v4/social/elements';
import React, { Fragment, PropsWithChildren } from 'react';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import styles from './Popup.module.css';

export function Popup() {
  const { isDesktop } = useResponsive();
  const { popups, closePopup } = usePopupContext();

  return (
    <Fragment>
      {popups.map((popup, index) => {
        const {
          style,
          header,
          onClose,
          children,
          className,
          view = 'all',
          media = false,
          overlayClassName,
          keepPrevious = true,
          isDismissable = true,
          disabledAnimation = false,
          ariaLabel = 'Popup',
          ...props
        } = popup;
        const close = () => closePopup(props.id);
        const isLastPopup = index + 1 === popups.length;
        const shouldUseModalOverlay = isDesktop || media;

        return shouldUseModalOverlay ? (
          <ModalOverlay
            {...props}
            key={props.id}
            isDismissable={isDismissable}
            data-animation={!disabledAnimation}
            isOpen={keepPrevious || isLastPopup}
            className={clsx(styles.overlay, overlayClassName)}
            data-view={keepPrevious && !isLastPopup ? 'none' : view}
            data-media={!!media}
            aria-label={ariaLabel}
            onOpenChange={(open) => (!open && onClose ? onClose({ close }) : close())}
          >
            <Modal
              style={style}
              aria-modal="true"
              aria-label={ariaLabel}
              data-media={!!media}
              data-animation={!disabledAnimation}
              className={clsx(styles.popup, className)}
            >
              <Dialog aria-label={ariaLabel} className={styles.dialog}>
                {({ close }) => {
                  return (
                    <Fragment>
                      {header && <Popup.Header onClose={close}>{header}</Popup.Header>}
                      {typeof children === 'function' ? children({ close }) : children}
                    </Fragment>
                  );
                }}
              </Dialog>
            </Modal>
          </ModalOverlay>
        ) : (
          (keepPrevious || isLastPopup) && (
            <div
              role="dialog"
              key={props.id}
              aria-modal="true"
              aria-label={ariaLabel}
              data-animation={!disabledAnimation}
              className={clsx(styles.overlay, overlayClassName)}
              data-view={keepPrevious && !isLastPopup ? 'none' : view}
            >
              <Dialog
                data-media={!!media}
                data-animation={!disabledAnimation}
                className={clsx(styles.popup, styles.dialog, className)}
                aria-label={ariaLabel}
              >
                {({ close }) => {
                  return (
                    <Fragment>
                      {header && <Popup.Header onClose={close}>{header}</Popup.Header>}
                      {typeof children === 'function' ? children({ close }) : children}
                    </Fragment>
                  );
                }}
              </Dialog>
            </div>
          )
        );
      })}
    </Fragment>
  );
}

type PopupHeaderProps = PropsWithChildren<{
  pageId?: string;
  onClose?: () => void;
}>;

function PopupHeader({ onClose, children, pageId = '*' }: PopupHeaderProps) {
  return (
    <div className={clsx(styles.popup__header)}>
      {children}
      <CloseButton
        pageId={pageId}
        onPress={onClose}
        defaultClassName={styles.popup__header__closeButton}
      />
    </div>
  );
}

Popup.Header = PopupHeader;
