import React, { ReactNode, useRef } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';

import ChatTypeSelector from '~/chat/components/Chat/ChatTypeSelector';
import AvatarUploader from '~/social/components/CommunityForm/AvatarUploader';
import Button from '~/core/components/Button';
import UserSelector from '~/social/components/UserSelector';

import styles from './styles.module.css';
import { ChannelRepository } from '@amityco/ts-sdk';

const FormBlock = ({ children }: { children: ReactNode }) => (
  <div className={styles.formBlockContainer}>
    <div className={styles.formBlockBody}>{children}</div>
  </div>
);

interface ChatComposerProps {
  className?: string;
  onCancel?: () => void;
  onSubmit?: (data: Parameters<typeof ChannelRepository.createChannel>[0]) => void;
}

const ChatComposer = ({ className, onCancel, onSubmit }: ChatComposerProps) => {
  const { formatMessage } = useIntl();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const defaultValues = {
    type: 'live',
    displayName: undefined,
    avatarFileId: undefined,
    userIds: [],
    tags: [],
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
  });

  const userIds = watch('userIds');

  const validateAndSubmit = async (
    data: Omit<Parameters<typeof ChannelRepository.createChannel>[0], 'type'> & { type?: string },
  ) => {
    setIsSubmitting(true);
    try {
      const payload = {
        displayName: data.displayName,
        type: (data?.type || 'community') as Amity.ChannelType,
        avatarFileId: data?.avatarFileId || undefined,
        userIds: data?.userIds,
        tags: data?.tags,
      };

      await onSubmit?.(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = !isDirty || userIds.length === 0 || isSubmitting;

  const formBodyRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.chatComposerContainer}>
      <form className={className} onSubmit={handleSubmit(validateAndSubmit)}>
        <div className={styles.formBody} ref={formBodyRef}>
          <FormBlock>
            <div className={styles.field}>
              <div className={styles.labelWrapper}>
                <div className={styles.labelContainer}>
                  <label className={styles.label}>
                    <FormattedMessage id="chatComposer.label.type" />
                  </label>
                </div>
              </div>
              <div className={styles.controllerContainer}>
                <Controller
                  name="type"
                  rules={{ required: 'Channel type is required' }}
                  render={({ field: { ref, ...rest } }) => (
                    <ChatTypeSelector parentContainer={formBodyRef.current} {...rest} />
                  )}
                  control={control}
                  defaultValue=""
                />
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.labelWrapper}>
                <div className={styles.labelContainer}>
                  <label className={styles.label}>
                    <FormattedMessage id="chatComposer.label.displayName" />
                  </label>
                </div>
              </div>
              <input
                className={styles.textInput}
                {...register('displayName')}
                placeholder={formatMessage({ id: 'chat_composer.placeholder.displayName' })}
                data-testid="chat-composer-display-name-input"
              />
              <div className={styles.errorMessage} data-errors={errors} data-name="displayName" />
            </div>

            <div className={styles.field}>
              <Controller
                name="avatarFileId"
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <AvatarUploader mimeType="image/png, image/jpeg" {...rest} />
                )}
                defaultValue={undefined}
              />
            </div>

            <div className={styles.field}>
              <label className={`${styles.label} required`}>
                <FormattedMessage id="chatComposer.addUsers" />
              </label>
              <Controller
                name="userIds"
                render={({ field: { ref, ...rest } }) => (
                  <UserSelector
                    parentContainer={formBodyRef.current}
                    {...rest}
                    data-testid="chat-composer-select-user-input"
                  />
                )}
                control={control}
              />
              <div className={styles.errorMessage} data-errors={errors} data-name="userIds" />
            </div>
          </FormBlock>
        </div>

        <div className={styles.footer}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onCancel?.();
            }}
          >
            <FormattedMessage id="cancel" />
          </Button>
          <button
            className={styles.submitButton}
            data-testid="chat-composer-submit-button"
            disabled={disabled}
          >
            <FormattedMessage id="create" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComposer;
