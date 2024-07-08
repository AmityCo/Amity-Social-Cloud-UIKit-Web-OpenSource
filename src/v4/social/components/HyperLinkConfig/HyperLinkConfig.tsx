import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import { BottomSheet, Typography } from '~/v4/core/components';

import styles from './HyperLinkConfig.module.css';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { Button } from '~/v4/core/components/Button';
import useSDK from '~/v4/core/hooks/useSDK';
import Trash from '~/v4/social/icons/trash';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { DoneButton } from '~/v4/social/elements/DoneButton';
import { EditCancelButton } from '../../elements/EditCancelButton/EditCancelButton';

interface HyperLinkConfigProps {
  pageId: string;
  isHaveHyperLink: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onRemove: () => void;
}

const MAX_LENGTH = 30;

export const HyperLinkConfig = ({
  pageId = '*',
  isOpen,
  isHaveHyperLink,
  onClose,
  onSubmit,
  onRemove,
}: HyperLinkConfigProps) => {
  const componentId = 'hyper_link_config_component';
  const { confirm } = useConfirmContext();
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityComponent({
      pageId,
      componentId,
    });

  if (isExcluded) return null;

  const { formatMessage } = useIntl();
  const { client } = useSDK();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const schema = z.object({
    url: z
      .string()
      .refine(
        (value) => {
          if (!value) return true;
          try {
            const urlObj = new URL(value);
            return ['http:', 'https:'].includes(urlObj.protocol);
          } catch (error) {
            // Check if the value starts with "www."
            if (value.startsWith('www.')) {
              try {
                const urlObj = new URL(`https://${value}`);
                return ['http:', 'https:'].includes(urlObj.protocol);
              } catch (error) {
                return false;
              }
            }
            return false;
          }
        },
        {
          message: formatMessage({ id: 'storyCreation.hyperlink.validation.error.invalidUrl' }),
        },
      )
      .refine(
        async (value) => {
          if (!value) return true;
          // Prepend "https://" to the value if it starts with "www."
          const urlToValidate = value.startsWith('www.') ? `https://${value}` : value;
          const hasWhitelistedUrls = await client?.validateUrls([urlToValidate]).catch(() => false);
          return hasWhitelistedUrls;
        },
        {
          message: formatMessage({ id: 'storyCreation.hyperlink.validation.error.whitelisted' }),
        },
      ),
    customText: z
      .string()
      .optional()
      .refine(async (value) => {
        if (!value) return true;
        const hasBlockedWord = await client?.validateTexts([value]).catch(() => false);
        return hasBlockedWord;
      }, formatMessage({ id: 'storyCreation.hyperlink.validation.error.blocked' })),
  });

  type HyperLinkFormInputs = z.infer<typeof schema>;

  const {
    trigger,
    watch,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HyperLinkFormInputs>({
    resolver: zodResolver(schema),
  });

  const { url, customText } = watch();

  useEffect(() => {
    setHasUnsavedChanges(url !== '' || customText !== '');
  }, [url, customText]);

  const onSubmitForm = async (data: HyperLinkFormInputs) => {
    onSubmit(data);
    onClose();
  };

  const confirmDiscardHyperlink = () => {
    reset();
    onRemove();
    onClose();
  };

  const discardHyperlink = () => {
    confirm({
      title: formatMessage({ id: 'storyCreation.hyperlink.removeConfirm.title' }),
      content: formatMessage({ id: 'storyCreation.hyperlink.removeConfirm.content' }),
      cancelText: formatMessage({ id: 'storyCreation.hyperlink.removeConfirm.cancel' }),
      okText: formatMessage({ id: 'storyCreation.hyperlink.removeConfirm.confirm' }),
      onOk: confirmDiscardHyperlink,
    });
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      confirm({
        title: formatMessage({ id: 'storyCreation.hyperlink.unsavedChanges.title' }),
        content: formatMessage({ id: 'storyCreation.hyperlink.unsavedChanges.content' }),
        cancelText: formatMessage({ id: 'storyCreation.hyperlink.unsavedChanges.cancel' }),
        okText: formatMessage({ id: 'storyCreation.hyperlink.unsavedChanges.confirm' }),
        onOk: () => {
          reset();
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  return (
    <BottomSheet
      detent="full-height"
      mountPoint={document.getElementById('asc-uikit-create-story') as HTMLElement}
      rootId="asc-uikit-create-story"
      isOpen={isOpen}
      onClose={handleClose}
      className={styles.bottomSheet}
    >
      <div className={styles.headerContainer}>
        <EditCancelButton pageId={pageId} componentId={componentId} onPress={handleClose} />
        <Typography.Title>
          {formatMessage({ id: 'storyCreation.hyperlink.bottomSheet.title' })}
        </Typography.Title>
        <DoneButton
          pageId={pageId}
          componentId={componentId}
          onPress={() => handleSubmit(onSubmitForm)}
        />
      </div>
      <div className={styles.divider} />
      <div className={styles.hyperlinkFormContainer}>
        <form
          id="asc-story-hyperlink-form"
          onSubmit={handleSubmit(onSubmitForm)}
          className={styles.form}
        >
          <div className={styles.inputContainer}>
            <Typography.Title>
              <label
                htmlFor="asc-uikit-hyperlink-input-url"
                className={clsx(styles.label, styles.required)}
              >
                {formatMessage({ id: 'storyCreation.hyperlink.form.urlLabel' })}
              </label>
            </Typography.Title>

            <input
              id="asc-uikit-hyperlink-input-url"
              placeholder={formatMessage({ id: 'storyCreation.hyperlink.form.urlPlaceholder' })}
              className={clsx(styles.input, errors?.url && styles.hasError)}
              {...register('url', {
                onChange: () => trigger('url'),
              })}
            />
            {errors?.url && <span className={styles.errorText}>{errors?.url?.message}</span>}
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.labelContainer}>
              <Typography.Title>
                <label htmlFor="asc-uikit-hyperlink-input-link-text" className={styles.label}>
                  {formatMessage({ id: 'storyCreation.hyperlink.form.linkTextLabel' })}
                </label>
              </Typography.Title>
              <div className={styles.characterCount}>
                {watch('customText')?.length || 0} / {MAX_LENGTH}
              </div>
            </div>
            <input
              id="asc-uikit-hyperlink-input-link-text"
              placeholder={formatMessage({
                id: 'storyCreation.hyperlink.form.linkTextPlaceholder',
              })}
              className={clsx(styles.input, errors?.customText && styles.hasError)}
              {...register('customText')}
              maxLength={MAX_LENGTH}
            />
            {errors?.customText && (
              <span className={styles.errorText}>{errors?.customText?.message}</span>
            )}
            <Typography.Caption>
              <label className={styles.description}>
                {formatMessage({ id: 'storyCreation.hyperlink.form.linkTextDescription' })}
              </label>
            </Typography.Caption>
          </div>
        </form>
        {isHaveHyperLink && (
          <div className={styles.removeLinkContainer}>
            <Button
              variant="secondary"
              onClick={discardHyperlink}
              className={clsx(styles.removeLinkButton)}
            >
              <Trash className={styles.removeIcon} />
              {formatMessage({ id: 'storyCreation.hyperlink.form.removeButton' })}
            </Button>
          </div>
        )}
      </div>
    </BottomSheet>
  );
};
