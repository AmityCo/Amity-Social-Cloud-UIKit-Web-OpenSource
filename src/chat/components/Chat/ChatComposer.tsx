import React, { ReactNode, useRef } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';

import ChatTypeSelector from '~/chat/components/Chat/ChatTypeSelector';
import AvatarUploader from '~/social/components/CommunityForm/AvatarUploader';
import Button from '~/core/components/Button';
import UserSelector from '~/social/components/UserSelector';

import {
  FormBlockBody,
  FormBlockContainer,
  TextInput,
  LabelContainer,
  LabelWrapper,
  ChatComposerContainer,
  Field,
  Label,
  Footer,
  Form,
  ControllerContainer,
  FormBody,
  SubmitButton,
  ErrorMessage,
} from './styles';
import { ChannelRepository } from '@amityco/ts-sdk';

const FormBlock = ({ children }: { children: ReactNode }) => (
  <FormBlockContainer>
    <FormBlockBody>{children}</FormBlockBody>
  </FormBlockContainer>
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
    <ChatComposerContainer>
      <Form className={className} onSubmit={handleSubmit(validateAndSubmit)}>
        <FormBody ref={formBodyRef}>
          <FormBlock>
            <Field>
              <LabelWrapper>
                <LabelContainer>
                  <Label>
                    <FormattedMessage id="chatComposer.label.type" />
                  </Label>
                </LabelContainer>
              </LabelWrapper>
              <ControllerContainer>
                <Controller
                  name="type"
                  rules={{ required: 'Channel type is required' }}
                  render={({ field: { ref, ...rest } }) => (
                    <ChatTypeSelector parentContainer={formBodyRef.current} {...rest} />
                  )}
                  control={control}
                  defaultValue=""
                />
              </ControllerContainer>
            </Field>

            <Field>
              <LabelWrapper>
                <LabelContainer>
                  <Label>
                    <FormattedMessage id="chatComposer.label.displayName" />
                  </Label>
                </LabelContainer>
              </LabelWrapper>
              <TextInput
                {...register('displayName')}
                placeholder={formatMessage({ id: 'chat_composer.placeholder.displayName' })}
                data-qa-anchor="chat-composer-display-name-input"
              />
              <ErrorMessage errors={errors} name="displayName" />
            </Field>

            <Field>
              <Controller
                name="avatarFileId"
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <AvatarUploader mimeType="image/png, image/jpeg" {...rest} />
                )}
                defaultValue={undefined}
              />
            </Field>

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
                    data-qa-anchor="chat-composer-select-user-input"
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
          >
            <FormattedMessage id="cancel" />
          </Button>
          <SubmitButton data-qa-anchor="chat-composer-submit-button" disabled={disabled}>
            <FormattedMessage id="create" />
          </SubmitButton>
        </Footer>
      </Form>
    </ChatComposerContainer>
  );
};

export default ChatComposer;
