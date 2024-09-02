import React, { memo } from 'react';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { Controller, useForm } from 'react-hook-form';

import { PrimaryButton } from '~/core/components/Button';
import AvatarUploader from '~/social/components/CommunityForm/AvatarUploader';

// TODO: should not be importing styles from another component.
import {
  AboutTextarea,
  Counter,
  ErrorMessage,
  Field,
  Form,
  FormBlockBody,
  FormBlockContainer,
  FormBlockHeader,
  FormBody,
  Label,
  LabelCounterWrapper,
  TextField,
} from '~/social/components/CommunityForm/styles';

const ButtonContainer = styled.div`
  margin-top: 16px;
`;

interface FormBlockProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const FormBlock = ({ title, children }: FormBlockProps) => (
  <FormBlockContainer>
    <FormBlockHeader>{title}</FormBlockHeader>
    <FormBlockBody>{children}</FormBlockBody>
  </FormBlockContainer>
);

interface UserProfileFormProps {
  user: Amity.User;
  onSubmit: (
    data: Partial<Pick<Amity.User, 'displayName'>> &
      Pick<Amity.User, 'description' | 'avatarFileId'>,
  ) => Promise<void>;
  className?: string;
}

const UserProfileForm = ({ user, onSubmit, className }: UserProfileFormProps) => {
  const { formatMessage } = useIntl();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm({
    defaultValues: {
      displayName: user.displayName,
      description: user.description ?? '',
      avatarFileId: user.avatarFileId ?? undefined,
    },
  });

  const description = watch('description');
  const displayName = watch('displayName');

  return (
    <Form
      className={className}
      onSubmit={handleSubmit((data) => {
        if (user.displayName === data.displayName) {
          onSubmit({
            description: data.description,
            avatarFileId: data.avatarFileId,
          });
        } else {
          onSubmit(data);
        }
      })}
    >
      <FormBody>
        <FormBlock title={<FormattedMessage id="UserProfileForm.title" />}>
          <Controller
            name="avatarFileId"
            render={({ field: { ref, ...rest } }) => (
              <AvatarUploader {...rest} data-qa-anchor="user-profile-form-avatar-uploader" />
            )}
            control={control}
          />
          <Field error={errors.displayName}>
            <LabelCounterWrapper>
              <Label htmlFor="displayName" className="required">
                <FormattedMessage id="UserProfileForm.displayname" />
              </Label>
              <Counter>{displayName?.length || 0}/100</Counter>
            </LabelCounterWrapper>
            <TextField
              {...register('displayName', {
                required: formatMessage({ id: 'UserProfileForm.requiredDisplayName' }),
              })}
              data-qa-anchor="user-profile-form-display-name-input"
              placeholder={formatMessage({ id: 'UserProfileForm.namePlaceholder' })}
              maxLength={100}
            />
            <ErrorMessage errors={errors} name="displayName" />
          </Field>
          <Field error={errors.description}>
            <LabelCounterWrapper>
              <Label htmlFor="description">
                <FormattedMessage id="UserProfileForm.about" />
              </Label>
              <Counter>{description?.length || 0}/180</Counter>
            </LabelCounterWrapper>
            <AboutTextarea
              {...register('description')}
              data-qa-anchor="user-profile-form-description-textarea"
              placeholder={formatMessage({ id: 'UserProfileForm.requiredDescription' })}
              maxLength={180}
            />
            <ErrorMessage errors={errors} name="description" />
          </Field>
          <ButtonContainer>
            <PrimaryButton data-qa-anchor="user-profile-form-save-button" type="submit">
              <FormattedMessage id="save" />
            </PrimaryButton>
          </ButtonContainer>
        </FormBlock>
      </FormBody>
    </Form>
  );
};

export default memo(UserProfileForm);
