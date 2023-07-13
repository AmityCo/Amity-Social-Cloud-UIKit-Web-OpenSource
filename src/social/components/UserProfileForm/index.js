import React, { memo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';
import BackLink from '~/core/components/BackLink';

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
import { MyProfileContainer } from '../UserInfo/styles';

const ButtonContainer = styled.div`
  margin-top: 16px;
`;
const FormBlock = ({ title, children }) => (
  <>
    <MyProfileContainer className="!relative xs:!flex justify-center items-center md:!hidden min-h-[32px] h-fit mb-[14px] mt-4">
      <h1 className="!leading-none m-auto cym-h-2-lg">Edit Profile</h1>
      <BackLink
        className="absolute left-0 ml-2"
        text={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.6211 19.9141L16.3242 19.2461C16.4648 19.0703 16.4648 18.7891 16.3242 18.6484L9.96094 12.25L16.3242 5.88672C16.4648 5.74609 16.4648 5.46484 16.3242 5.28906L15.6211 4.62109C15.4453 4.44531 15.1992 4.44531 15.0234 4.62109L7.64062 11.9688C7.5 12.1445 7.5 12.3906 7.64062 12.5664L15.0234 19.9141C15.1992 20.0898 15.4453 20.0898 15.6211 19.9141Z"
              fill="#292B32"
            />
          </svg>
        }
      />
    </MyProfileContainer>
    <FormBlockContainer>
      {/* MD+  */}
      <FormBlockHeader className="xs:!hidden md:!flex">{title}</FormBlockHeader>

      <FormBlockBody>{children}</FormBlockBody>
    </FormBlockContainer>
  </>
);

const UserProfileForm = ({ user, onSubmit, className }) => {
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
      avatarFileId: user.avatarFileId ?? null,
    },
  });

  const description = watch('description');
  const displayName = watch('displayName');

  return (
    <Form className={className + ' xs:!min-w-0 md:min-w-[600px]'} onSubmit={handleSubmit(onSubmit)}>
      <FormBody>
        <FormBlock title={<FormattedMessage id="UserProfileForm.title" />}>
          <Controller
            name="avatarFileId"
            render={({ field: { ref, ...rest } }) => (
              <AvatarUploader {...rest} data-qa-anchor="user-profile-form-avatar-uploader" />
            )}
            control={control}
          />
          <Field error={errors.name}>
            <LabelCounterWrapper>
              <Label htmlFor="displayName" className="required">
                <FormattedMessage id="UserProfileForm.displayname" />
              </Label>
              <Counter>{displayName.length}/100</Counter>
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
              <Counter>{description.length}/180</Counter>
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
