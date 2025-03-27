import clsx from 'clsx';
import React, { Fragment, ReactNode, useState } from 'react';
import { CloseButton } from '~/v4/social/elements';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/components/AriaButton';
import { Typography } from '~/v4/core/components';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { ConfirmType, useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import styles from './ConfirmModal.module.css';

type ConfirmProps = ConfirmType & {
  isOpen: boolean;
  className?: string;
  okText?: ReactNode;
  cancelText?: ReactNode;
  type?: 'confirm' | 'info';
};

const Confirm = ({
  onOk,
  title,
  isOpen,
  content,
  onCancel,
  className,
  pageId = '*',
  okText = 'OK',
  type = 'confirm',
  componentId = '*',
  cancelText = 'Cancel',
  retryText,
}: ConfirmProps) => {
  const elementId = 'confirm-modal';
  const { accessibilityId, themeStyles } = useAmityElement({ pageId, componentId, elementId });

  const [isLoading, setIsLoading] = useState(false);

  return (
    <ModalOverlay
      isDismissable
      isOpen={isOpen}
      onOpenChange={onCancel}
      className={clsx(styles.overlay)}
      data-testid={`${elementId}-${accessibilityId}`}
    >
      <Modal className={clsx(styles.popup, className)}>
        <Dialog className={styles.dialog}>
          {({ close }) => {
            return (
              <Fragment>
                <div className={clsx(styles.popup__header)}>
                  <Typography.TitleBold
                    className={styles.popup__header__title}
                    data-testid={`${pageId}/${componentId}/modal-title`}
                  >
                    {title}
                  </Typography.TitleBold>
                  <CloseButton
                    pageId={pageId}
                    onPress={close}
                    defaultClassName={styles.popup__header__closeButton}
                    isDisabled={isLoading}
                  />
                </div>
                <div
                  className={clsx(styles.popup__content)}
                  data-testid={`${pageId}/${componentId}/modal-content`}
                >
                  {content}
                </div>
                <div className={styles.popup__footer}>
                  {type === 'confirm' && (
                    <Button
                      size="medium"
                      color="secondary"
                      variant="outlined"
                      onPress={onCancel}
                      style={themeStyles}
                      data-testid={`${elementId}-cancel-button`}
                      className={styles.popup__footer__cancelButton}
                      isDisabled={isLoading}
                    >
                      <Typography.BodyBold>{cancelText}</Typography.BodyBold>
                    </Button>
                  )}
                  <Button
                    size="medium"
                    variant="fill"
                    style={themeStyles}
                    className={styles.popup__footer__okButton}
                    color={type === 'info' ? 'primary' : 'alert'}
                    data-testid={`${elementId}-${accessibilityId}-ok-button`}
                    isDisabled={isLoading}
                    onPress={async () => {
                      setIsLoading(true);
                      try {
                        const result = onOk?.();
                        if (result && (result as Promise<void>).then) {
                          await (result as Promise<void>);
                        }
                      } catch (err) {
                        console.error('Error in onOk:', err);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    <Typography.BodyBold className={styles.popup__footer__okText}>
                      {okText}
                    </Typography.BodyBold>
                  </Button>
                </div>
              </Fragment>
            );
          }}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export const ConfirmModal = () => {
  const { confirmData, closeConfirm } = useConfirmContext();

  if (!confirmData) return null;

  const onCancel = () => {
    closeConfirm();
    confirmData?.onCancel?.();
  };

  const onOk = async () => {
    await confirmData?.onOk?.();
    closeConfirm();
  };

  return <Confirm {...confirmData} onOk={onOk} onCancel={onCancel} isOpen={!!confirmData} />;
};

export default Confirm;
