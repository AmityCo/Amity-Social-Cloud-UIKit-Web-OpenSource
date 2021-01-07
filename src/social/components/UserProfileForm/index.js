import React from 'react';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';

import { PrimaryButton } from '~/core/components/Button';
import CameraIcon from '~/icons/Camera';

// TODO: should not be importing styles from another component.
import {
  AboutTextarea,
  Avatar,
  AvatarWrapper,
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

const AvatarUploadContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonContainer = styled.div`
  margin-top: 16px;
`;

const AvatarUpload = ({ value }) => (
  <AvatarUploadContainer>
    <AvatarWrapper>
      <Avatar size="big" avatar={value} />
      <CameraIcon />
    </AvatarWrapper>
  </AvatarUploadContainer>
);

const FormBlock = ({ title, children }) => (
  <FormBlockContainer>
    <FormBlockHeader>{title}</FormBlockHeader>
    <FormBlockBody>{children}</FormBlockBody>
  </FormBlockContainer>
);

const UserProfileForm = ({ user, onSubmit, className }) => {
  const { register, handleSubmit, errors, watch, control } = useForm({
    defaultValues: {
      ...user,
      description: user.description || '',
    } || {
      avatar:
        'https://www.gardeningknowhow.com/wp-content/uploads/2017/07/hardwood-tree-400x266.jpg',
      displayName: '',
      description: '',
    },
  });

  const description = watch('description');
  const displayName = watch('displayName');

  return (
    <Form className={className} onSubmit={handleSubmit(onSubmit)}>
      <FormBody>
        <FormBlock title="General">
          <Controller name="avatar" render={AvatarUpload} control={control} />
          <Field error={errors.name}>
            <LabelCounterWrapper>
              <Label htmlFor="displayName" className="required">
                Display name
              </Label>
              <Counter>{displayName.length}/100</Counter>
            </LabelCounterWrapper>
            <TextField
              placeholder="Enter user display name"
              id="displayName"
              name="displayName"
              ref={register({
                required: 'Display name is required',
                maxLength: {
                  value: 100,
                  message: 'Display name is too long',
                },
              })}
            />
            <ErrorMessage errors={errors} name="displayName" />
          </Field>
          <Field error={errors.description}>
            <LabelCounterWrapper>
              <Label htmlFor="description">About</Label>
              <Counter>{description.length}/180</Counter>
            </LabelCounterWrapper>
            <AboutTextarea
              placeholder="Enter something about yourself"
              name="description"
              ref={register({
                maxLength: { value: 180, message: 'Description text is too long' },
              })}
            />
            <ErrorMessage errors={errors} name="description" />
          </Field>
          <ButtonContainer>
            <PrimaryButton type="submit">Save</PrimaryButton>
          </ButtonContainer>
        </FormBlock>
      </FormBody>
    </Form>
  );
};

export default UserProfileForm;
