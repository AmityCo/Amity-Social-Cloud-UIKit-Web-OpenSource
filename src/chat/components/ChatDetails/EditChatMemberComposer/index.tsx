import React, { ReactNode, useRef } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import Button from '~/core/components/Button';
import UserSelector from '~/social/components/UserSelector';

import {
  FormBlockBody,
  FormBlockContainer,
  EditChatMemberComposerContainer,
  Field,
  Label,
  Footer,
  Form,
  FormBody,
  SubmitButton,
  ErrorMessage,
} from './styles';
import { ChannelRepository } from '@amityco/ts-sdk';
import { isNonNullable } from '~/helpers/utils';
import useChannelMembersCollection from '~/chat/hooks/collections/useChannelMembersCollection';
import { useNotifications } from '~/core/providers/NotificationProvider';

const FormBlock = ({ children }: { children: ReactNode }) => (
  <FormBlockContainer>
    <FormBlockBody>{children}</FormBlockBody>
  </FormBlockContainer>
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
    <EditChatMemberComposerContainer>
      <Form className={className} onSubmit={handleSubmit(validateAndSubmit)}>
        <FormBody ref={formBodyRef}>
          <FormBlock>
            <Field>
              <Label className="required">
                <FormattedMessage id="chatComposer.addUsers" />
              </Label>
              <Controller
                name="userIds"
                render={({ field: { ref, ...rest } }) => (
                  <UserSelector
                    parentContainer={formBodyRef.current}
                    {...rest}
                    data-qa-anchor="edit-chat-members-composer-select-user-input"
                  />
                )}
                control={control}
              />
              <ErrorMessage errors={errors} name="userIds" />
            </Field>
          </FormBlock>
        </FormBody>

        <Footer>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onCancel?.();
            }}
            disabled={isDirty}
          >
            <FormattedMessage id="cancel" />
          </Button>
          <SubmitButton
            data-qa-anchor="edit-chat-members-composer-submit-button"
            disabled={disabled}
          >
            <FormattedMessage id="save" />
          </SubmitButton>
        </Footer>
      </Form>
    </EditChatMemberComposerContainer>
  );
};

export default function EditChatMemberComposer(props: EditChatMemberComposerProps) {
  const { channelId, ...rest } = props;
  const { isLoading, channelMembers, hasMore, loadMore } = useChannelMembersCollection(channelId);

  const memberIds = channelMembers.map((member) => member.userId);

  if (isLoading || channelId == null) return null;

  return <EditChatMemberComposerForm {...rest} channelId={channelId} memberIds={memberIds} />;
}
