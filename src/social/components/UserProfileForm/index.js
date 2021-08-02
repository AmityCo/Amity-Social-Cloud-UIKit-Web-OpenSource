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

const FormBlock = ({ title, children }) => (
  <FormBlockContainer>
    <FormBlockHeader>{title}</FormBlockHeader>
    <FormBlockBody>{children}</FormBlockBody>
  </FormBlockContainer>
);

const UserProfileForm = ({ user, onSubmit, className }) => {
  const { formatMessage } = useIntl();
  const { register, handleSubmit, errors, watch, control } = useForm({
    defaultValues: {
      ...user,
      description: user.description ?? '',
      avatarFileId: user.avatarFileId ?? '',
    } || {
      avatarFileId: '',
      displayName: '',
      description: '',
    },
  });

  const description = watch('description');
  const displayName = watch('displayName');

  return (
    <Form className={className} onSubmit={handleSubmit(onSubmit)}>
      <FormBody>
        <FormBlock title={<FormattedMessage id="UserProfileForm.title" />}>
          <Controller
            name="avatarFileId"
            render={props => <AvatarUploader {...props} />}
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
              placeholder={formatMessage({ id: 'UserProfileForm.namePlaceholder' })}
              id="displayName"
              name="displayName"
              maxLength={100}
              ref={register({
                required: formatMessage({ id: 'UserProfileForm.requiredDisplayName' }),
              })}
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
              placeholder={formatMessage({ id: 'UserProfileForm.requiredDescription' })}
              name="description"
              maxLength={180}
              ref={register()}
            />
            <ErrorMessage errors={errors} name="description" />
          </Field>
          <ButtonContainer>
            <PrimaryButton type="submit">
              <FormattedMessage id="save" />
            </PrimaryButton>
          </ButtonContainer>
        </FormBlock>
      </FormBody>
    </Form>
  );
};

export default memo(UserProfileForm);
