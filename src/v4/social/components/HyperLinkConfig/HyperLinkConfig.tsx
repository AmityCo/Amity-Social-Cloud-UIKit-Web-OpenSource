import React from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import useSDK from '~/core/hooks/useSDK';
import { BottomSheet, Typography } from '~/v4/core/components';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { Trash2Icon } from '~/icons';
import styles from './HyperLinkConfig.module.css';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { Button } from '~/v4/core/components/Button';

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
  const { confirm } = useConfirmContext();

  const componentId = 'hyper_link_config_component';
  const { getConfig, isExcluded } = useCustomization();

  const componentConfig = getConfig(`${pageId}/${componentId}/*`);
  const componentTheme = componentConfig?.theme?.light || {};

  const cancelButtonConfig = getConfig(`*/hyper_link_config_component/cancel_button`);
  const doneButtonConfig = getConfig(`*/hyper_link_config_component/done_button`);

  const { formatMessage } = useIntl();
  const { client } = useSDK();

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

  return (
    <BottomSheet
      detent="full-height"
      mountPoint={document.getElementById('asc-uikit-create-story') as HTMLElement}
      rootId="asc-uikit-create-story"
      isOpen={isOpen}
      onClose={onClose}
      className={styles.bottomSheet}
    >
      <div className={styles.headerContainer}>
        <Button className={clsx(styles.cancelButton)} variant="ghost" onClick={onClose}>
          <Typography.Body>
            {cancelButtonConfig?.cancel_button_text ||
              formatMessage({ id: 'storyCreation.hyperlink.bottomSheet.cancel' })}
          </Typography.Body>
          {cancelButtonConfig?.cancel_icon &&
            typeof cancelButtonConfig?.cancel_icon === 'string' && (
              <img src={cancelButtonConfig?.cancel_icon} width={16} height={16} />
            )}
        </Button>
        <Typography.Title>
          {formatMessage({ id: 'storyCreation.hyperlink.bottomSheet.title' })}
        </Typography.Title>
        <Button
          variant="ghost"
          form="asc-story-hyperlink-form"
          type="submit"
          className={clsx(styles.doneButton)}
          disabled={!watch('url') || !!errors.url}
        >
          <Typography.Body>
            {doneButtonConfig?.done_button_text ||
              formatMessage({ id: 'storyCreation.hyperlink.bottomSheet.submit' })}
          </Typography.Body>
          {doneButtonConfig?.done_icon && typeof doneButtonConfig?.done_icon === 'string' && (
            <img src={doneButtonConfig.done_icon} width={16} height={16} />
          )}
        </Button>
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
          {isHaveHyperLink && (
            <div className={styles.inputContainer}>
              <Button
                variant="secondary"
                onClick={discardHyperlink}
                className={clsx(styles.removeLinkButton)}
              >
                <Trash2Icon className={styles.removeIcon} />
                {formatMessage({ id: 'storyCreation.hyperlink.form.removeButton' })}
              </Button>
              <div className={styles.divider} />
            </div>
          )}
        </form>
      </div>
    </BottomSheet>
  );
};
