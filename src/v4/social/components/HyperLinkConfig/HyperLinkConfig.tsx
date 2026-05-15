import React, { useEffect, useState } from 'react';
import { useString } from '~/v4/core/localization';
import { useForm } from 'react-hook-form';
import { custom, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import useSDK from '~/v4/core/hooks/useSDK';
import Trash from '~/v4/social/icons/trash';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { DoneButton } from '~/v4/social/elements/DoneButton';
import { EditCancelButton } from '~/v4/social/elements/EditCancelButton';

import styles from './HyperLinkConfig.module.css';
import Close from '~/v4/icons/Close';
import { Button } from '~/v4/core/natives/Button/Button';
import { UnderlineInput } from '~/v4/social/internal-components/UnderlineInput/UnderlineInput';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';

interface HyperLinkConfigProps {
  pageId: string;
  url?: string;
  customText?: string;
  onClose: () => void;
  onSubmit: (data: { url: string; customText?: string }) => void;
  onRemove: () => void;
}

const MAX_LENGTH = 30;

export const HyperLinkConfig = ({
  pageId = '*',
  url,
  customText,
  onClose,
  onSubmit,
  onRemove,
}: HyperLinkConfigProps) => {
  const componentId = 'hyper_link_config_component';
  const { confirm } = useConfirmContext();
  const { removeDrawerData } = useDrawer();

  const { accessibilityId, isExcluded, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { closePopup } = usePopupContext();
  const { isDesktop } = useResponsive();

  if (isExcluded) return null;

  const { client } = useSDK();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const formId = 'asc-story-hyperlink-form';

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
          message: useString('amity_social_label_enter_valid_url'),
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
          message: useString('amity_social_label_enter_whitelisted_url'),
        },
      ),
    customText: z
      .string()
      .optional()
      .refine(async (value) => {
        if (!value) return true;
        const hasBlockedWord = await client?.validateTexts([value]).catch(() => false);
        return hasBlockedWord;
      }, useString('amity_social_label_text_contains_blocklisted')),
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
    defaultValues: {
      url,
      customText,
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      const isUrlChanged = values.url !== (url ?? '');
      const isCustomTextChanged = values.customText !== (customText ?? '');
      setHasUnsavedChanges(isUrlChanged || isCustomTextChanged);
    });

    return () => subscription.unsubscribe();
  }, [watch, url, customText]);

  const onSubmitForm = (data: HyperLinkFormInputs) => {
    onSubmit(data);
    onClose();
  };

  const confirmDiscardHyperlink = () => {
    // TODO: fix cannot close drawer
    reset();
    onRemove();
    onClose();
  };

  const discardHyperlink = () => {
    confirm({
      title: useString('amity_social_modal_dialog_title_remove_link'),
      content: useString('amity_social_modal_dialog_remove_story_link'),
      cancelText: useString('amity_social_button_cancel'),
      okText: useString('amity_social_modal_alert_remove_button'),
      onOk: confirmDiscardHyperlink,
    });
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      confirm({
        title: useString('amity_social_modal_dialog_title_unsaved_changes'),
        content: useString('amity_social_modal_dialog_cancel_unsaved_changes'),
        cancelText: useString('amity_social_button_no'),
        okText: useString('amity_social_button_yes'),

        onOk: () => {
          reset();
          closePopup();
          !isDesktop && removeDrawerData();
        },
      });
    } else {
      onClose();
    }
  };

  return (
    <div data-testid={accessibilityId} style={themeStyles}>
      <div className={styles.headerContainer}>
        <EditCancelButton
          pageId={pageId}
          componentId={componentId}
          onPress={handleClose}
          className={styles.hyperlinkConfig__header__editCancelButton}
        />
        <Typography.Headline>{useString('amity_social_button_add_link')}</Typography.Headline>
        <DoneButton
          type="submit"
          pageId={pageId}
          componentId={componentId}
          form={formId}
          className={styles.hyperlinkConfig__header__editDoneButton}
        />
        <Button onPress={handleClose} className={styles.hyperlinkConfig__header__closeButton}>
          <Close className={styles.hyperlinkConfig__header__closeButton__icon} />
        </Button>
      </div>
      <div className={styles.divider} />
      <div className={styles.hyperlinkFormContainer}>
        <form onSubmit={handleSubmit(onSubmitForm)} id={formId} className={styles.form}>
          <UnderlineInput
            label="URL"
            required={true}
            placeholder={useString('amity_social_placeholder_hyperlink_url_hint')}
            placeholderClassName={styles.hyperlinkConfig__inputPlaceholder}
            value={watch('url')}
            {...register('url', {
              onChange: async () => {
                await trigger('url');
              },
            })}
            {...{ id: 'asc-uikit-hyperlink-input-url' }}
            isError={!!errors.url?.message}
            helperText={errors?.url?.message}
          />
          <UnderlineInput
            label={useString('amity_social_label_customize_link_text')}
            placeholder={useString('amity_social_placeholder_hyperlink_name_hint')}
            placeholderClassName={styles.hyperlinkConfig__inputPlaceholder}
            {...register('customText', {
              onChange: async () => {
                await trigger('customText');
              },
            })}
            {...{ id: 'asc-uikit-hyperlink-input-link-text' }}
            isError={!!errors.customText?.message}
            helperText={
              errors?.customText?.message ??
              useString('amity_social_this_text_will_show_on_the_link_instead_of_url')
            }
            value={watch('customText')}
            showCounter={true}
            maxLength={MAX_LENGTH}
          />
        </form>
        {url && (
          <div className={styles.removeLinkContainer}>
            <Button onPress={discardHyperlink} className={clsx(styles.removeLinkButton)}>
              <Trash className={styles.removeIcon} />
              {useString('amity_social_button_remove_link')}
            </Button>
          </div>
        )}
      </div>
      <div className={styles.hyperlinkConfig__footer}>
        <EditCancelButton
          pageId={pageId}
          componentId={componentId}
          onPress={handleClose}
          className={styles.hyperlinkConfig__footer__editCancelButton}
        />
        <DoneButton
          type="submit"
          pageId={pageId}
          componentId={componentId}
          form={formId}
          className={styles.hyperlinkConfig__footer__editDoneButton}
          isDisabled={!!errors.url || !!errors.customText || !watch('url')}
        />
      </div>
    </div>
  );
};
