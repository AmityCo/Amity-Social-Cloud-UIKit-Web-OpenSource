import React, { ReactNode, useRef } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import Button from '~/core/components/Button';
import UserSelector from '~/social/components/UserSelector';

import styles from './styles.module.css';
import { ChannelRepository } from '@amityco/ts-sdk';
import { isNonNullable } from '~/helpers/utils';
import useChannelMembersCollection from '~/chat/hooks/collections/useChannelMembersCollection';
import { useNotifications } from '~/core/providers/NotificationProvider';

const FormBlock = ({ children }: { children: ReactNode }) => (
  <div className={styles.formBlockContainer}>
    <div className={styles.formBlockBody}>{children}</div>
  </div>
);

interface EditChatMemberComposerProps {
  channelId?: string;
  className?: string;
  onCancel?: () => void;
  onSubmit?: (userIds: Parameters<typeof ChannelRepository.Membership.addMembers>[1]) => void;
}

interface EditChatMemberComposerFormProps {
  channelId: string;
  className?: string;
  memberIds: string[];
  onCancel?: () => void;
  onSubmit?: (userIds: Parameters<typeof ChannelRepository.Membership.addMembers>[1]) => void;
}

const EditChatMemberComposerForm = ({
  channelId,
  className,
  memberIds,
  onCancel,
  onSubmit,
}: EditChatMemberComposerFormProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const notification = useNotifications();

  const defaultValues = {
    userIds: memberIds,
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

  const validateAndSubmit = async ({
    userIds,
  }: {
    userIds: Parameters<typeof ChannelRepository.Membership.addMembers>[1];
  }) => {
    setIsSubmitting(true);
    try {
      onSubmit?.(userIds);

      const toRemoveMemberIds = memberIds.filter((id) => !userIds.includes(id));
      const toAddMemberIds = userIds.filter((id) => !memberIds.includes(id));

      return Promise.all(
        [
          toAddMemberIds?.length > 0
            ? ChannelRepository.Membership.addMembers(channelId, toAddMemberIds)
            : null,
          toRemoveMemberIds?.length > 0
            ? ChannelRepository.Membership.removeMembers(channelId, toRemoveMemberIds)
            : null,
        ].filter(isNonNullable),
      );
    } catch (error) {
      if (error instanceof Error) {
        notification.error({
          content: error.message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = !isDirty || userIds.length === 0 || isSubmitting;

  const formBodyRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.editChatMemberComposerContainer}>
      <form className={className} onSubmit={handleSubmit(validateAndSubmit)}>
        <div className={styles.formBody} ref={formBodyRef}>
          <FormBlock>
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
                    data-testid="edit-chat-members-composer-select-user-input"
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
            disabled={isDirty}
          >
            <FormattedMessage id="cancel" />
          </Button>
          <button
            className={styles.submitButton}
            data-testid="edit-chat-members-composer-submit-button"
            disabled={disabled}
          >
            <FormattedMessage id="save" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default function EditChatMemberComposer(props: EditChatMemberComposerProps) {
  const { channelId, ...rest } = props;
  const { isLoading, channelMembers, hasMore, loadMore } = useChannelMembersCollection(channelId);

  const memberIds = channelMembers.map((member) => member.userId);

  if (isLoading || channelId == null) return null;

  return <EditChatMemberComposerForm {...rest} channelId={channelId} memberIds={memberIds} />;
}
