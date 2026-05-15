import * as z from 'zod';
import { useString, resolveString } from '~/v4/core/localization';
import React from 'react';
import { FileRepository } from '@amityco/ts-sdk';
import { useEffect, useMemo, useRef } from 'react';
import { useImage } from '~/v4/core/hooks/useImage';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label, TextArea } from 'react-aria-components';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { Button as AriButton } from '~/v4/core/components/AriaButton';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import styles from './AltTextConfig.module.css';

export type AltTextMedia = { type: 'image'; image: Amity.File<'image'> };

export type AltTextConfigMode =
  | { type: 'create'; media: AltTextMedia }
  | { type: 'edit'; altText: string; media: AltTextMedia };

export type AltTextConfigProps = {
  mode: AltTextConfigMode;
  result: (text: string) => void;
  renderHeader?: ({ count }: { count: number; isDisabled?: boolean }) => React.ReactNode;
};

export function useAltTextConfig({ mode, result }: AltTextConfigProps) {
  const isEdit = mode.type === 'edit';
  const { isDesktop } = useResponsive();
  const { info, success } = useNotifications();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const imageUrl = useImage({
    fileId: mode.media.image.fileId,
  });

  const { mutateAsync } = useMutation({
    networkMode: 'always',
    mutationFn: async (params: { fileId: string; altText: string }) => {
      await FileRepository.updateAltText(params.fileId, params.altText);
    },
    onSuccess: (_, { altText }) => {
      result(altText);
      isEdit &&
        success({
          content: resolveString('amity_social_label_image_alt_text_updated_message'),
          alignment: 'fullscreen',
        });
    },
    onError: (error) => {
      if (error.message.includes('Network Error')) {
        return info({
          content: resolveString('amity_social_label_no_internet_connection'),
          alignment: 'fullscreen',
        });
      }

      if (error.message.includes(`${ERROR_RESPONSE.BLOCKED_WORD}`)) {
        return info({
          content: resolveString('amity_social_error_image_alt_text_ban_word_error_message'),
          alignment: 'fullscreen',
        });
      }
      if (error.message.includes(`${ERROR_RESPONSE.BLOCKED_URL}`)) {
        return info({
          content: resolveString('amity_social_error_image_alt_text_ban_url_error_message'),
          alignment: 'fullscreen',
        });
      }

      info({
        alignment: 'fullscreen',
        content:
          mode.type === 'create'
            ? resolveString('amity_social_toast_image_add_alt_text_generic_error_message')
            : resolveString('amity_social_toast_image_edit_alt_text_generic_error_message'),
      });
    },
  });

  const altTextSchema = useMemo(
    () =>
      z.object({
        altText: isEdit ? z.string().max(180) : z.string().trim().min(1).max(180),
      }),
    [isEdit],
  );

  const { watch, setValue, formState, register, handleSubmit } = useForm<
    z.infer<typeof altTextSchema>
  >({
    mode: 'onChange',
    defaultValues: { altText: mode.media.image.altText || '' },
    resolver: zodResolver(altTextSchema),
  });

  const altText = watch('altText');

  useEffect(() => {
    if (textareaRef.current && isDesktop) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [textareaRef.current]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue('altText', e.target.value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof altTextSchema>> = async (data) => {
    await mutateAsync({
      fileId: mode.media.image.fileId,
      altText: data.altText.trim(),
    });
  };

  return {
    altText,
    imageUrl,
    onSubmit,
    formState,
    register,
    textareaRef,
    handleSubmit,
    handleTextareaChange,
  };
}

export function AltTextConfig({ mode, result, renderHeader }: AltTextConfigProps) {
  const {
    altText,
    onSubmit,
    register,
    imageUrl,
    formState,
    textareaRef,
    handleSubmit,
    handleTextareaChange,
  } = useAltTextConfig({ mode, result });

  const altTextPlaceholder = useString('amity_social_placeholder_image_alt_text_hint_message');
  const addAltTextLabel = useString('amity_social_button_done');
  const editAltTextLabel = useString('amity_social_button_community_setup_edit_button');
  return (
    <form
      id="alt-text-form"
      className={styles.altTextConfig}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
      }}
    >
      {renderHeader &&
        renderHeader({
          count: altText?.trim().length ?? 0,
          isDisabled: !formState.isDirty || !formState.isValid || formState.isSubmitting,
        })}
      <div className={styles.altTextConfig__content}>
        <figure className={styles.altTextConfig__imageContainer}>
          <img
            src={imageUrl}
            alt={mode.media.image.altText}
            className={styles.altTextConfig__image}
          />
        </figure>
        <div>
          <Label className="srOnly" id="alt-text">
            {altTextPlaceholder}
          </Label>
          <TextArea
            {...register('altText')}
            rows={1}
            autoFocus
            maxLength={180}
            value={altText}
            ref={textareaRef}
            aria-labelledby="alt-text"
            onChange={handleTextareaChange}
            className={styles.altTextConfig__input}
            placeholder={altTextPlaceholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
          />
        </div>
        <AriButton
          fullWidth
          type="submit"
          size="medium"
          variant="fill"
          color="primary"
          className={styles.altTextConfig__cta}
          isDisabled={!formState.isDirty || !formState.isValid || formState.isSubmitting}
        >
          {mode.type === 'create' ? addAltTextLabel : editAltTextLabel}
        </AriButton>
      </div>
    </form>
  );
}
