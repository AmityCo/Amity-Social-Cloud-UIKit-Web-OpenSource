import React from 'react';

import { useForm, Controller } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { ChannelType } from '@amityco/js-sdk';

import useElement from '~/core/hooks/useElement';
import ChatTypeSelector from '~/chat/components/Chat/ChatTypeSelector';
import AvatarUploader from '~/social/components/CommunityForm/AvatarUploader';
import Button from '~/core/components/Button';
import UserSelector from '~/social/components/UserSelector';

import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';
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

const FormBlock = ({ children }) => (
  <FormBlockContainer>
    <FormBlockBody>{children}</FormBlockBody>
  </FormBlockContainer>
);

const ChatComposer = ({ className, onCancel = () => {}, onSubmit = () => {} }) => {
  const { formatMessage } = useIntl();

  const defaultValues = {
    channelId: '',
    type: '',
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

  const userIds = watch('userIds', '');

  const [validateAndSubmit, submitting] = useAsyncCallback(async (data) => {
    const payload = {
      channelId: data?.channelId || undefined,
      type: data?.type || ChannelType.Community,
      displayName: data?.displayName || undefined,
      avatarFileId: data?.avatarFileId || undefined,
      userIds: data?.userIds,
      tags: data?.tags,
    };

    await onSubmit(payload);
  });

  const disabled = !isDirty || userIds.length === 0 || submitting;

  const [formBodyRef, formBodyElement] = useElement();

  return (
    <ChatComposerContainer>
      <Form className={className} onSubmit={handleSubmit(validateAndSubmit)}>
        <FormBody ref={formBodyRef}>
          <FormBlock>
            <Field>
              <LabelWrapper>
                <LabelContainer>
                  <Label>
                    <FormattedMessage id="chatComposer.label.channelId" />
                  </Label>
                </LabelContainer>
              </LabelWrapper>
              <TextInput
                {...register('channelId')}
                placeholder={formatMessage({ id: 'chat_composer.placeholder.channelId' })}
                data-qa-anchor="chat-composer-channel-id-input"
              />
              <ErrorMessage errors={errors} name="channelId" />
            </Field>

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
                    <ChatTypeSelector parentContainer={formBodyElement} {...rest} />
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
                defaultValue={null}
              />
            </Field>

            <Field error={errors.userIds}>
              <Label name="userIds" className="required">
                <FormattedMessage id="chatComposer.addUsers" />
              </Label>
              <Controller
                name="userIds"
                render={({ field: { ref, ...rest } }) => (
                  <UserSelector
                    parentContainer={formBodyElement}
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
              onCancel();
            }}
          >
            <FormattedMessage id="cancel" />
          </Button>
          <SubmitButton data-qa-anchor="chat-composer-submit-button" disabled={disabled}>
            <FormattedMessage id="post" />
          </SubmitButton>
        </Footer>
      </Form>
    </ChatComposerContainer>
  );
};

export default ChatComposer;
