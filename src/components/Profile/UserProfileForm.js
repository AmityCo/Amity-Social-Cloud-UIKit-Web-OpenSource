import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  AboutTextarea,
  Avatar,
  AvatarUploadContainer,
  AvatarWrapper,
  CameraIcon,
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
} from 'components/CommunityForm/styles';

import { PrimaryButton } from 'components/Button';

import { ButtonContainer } from './styles';

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

export const UserProfileForm = ({ user, onSubmit, className }) => {
  const { register, handleSubmit, errors, watch, control } = useForm({
    defaultValues: {
      ...user,
      description: '',
    } || {
      avatar:
        'https://www.gardeningknowhow.com/wp-content/uploads/2017/07/hardwood-tree-400x266.jpg',
      displayName: '',
      description: '',
    },
  });

  const currentName = watch('displayName');
  const description = watch('description');

  return (
    <Form className={className} onSubmit={handleSubmit(onSubmit)}>
      <FormBody>
        <FormBlock title="General">
          <Controller name="avatar" render={AvatarUpload} control={control} />
          <Field error={errors.name}>
            <LabelCounterWrapper>
              <Label htmlFor="name" required>
                Display name
              </Label>
              <Counter>{currentName.length}/30</Counter>
            </LabelCounterWrapper>
            <TextField
              placeholder="Enter user display name"
              id="name"
              name="name"
              ref={register({
                required: 'Display name is required',
                maxLength: {
                  value: 30,
                  message: 'Display name is too long',
                },
              })}
            />
            <ErrorMessage errors={errors} name="name" />
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
