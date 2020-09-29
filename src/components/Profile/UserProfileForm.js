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
import { Controller, useForm } from 'react-hook-form';
import React from 'react';
import { getCommunities } from 'mock/index';
import { Footer, SubmitButton } from './styles';

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
  const { register, handleSubmit, errors, setError, watch, control } = useForm({
    defaultValues: user || {
      avatar:
        'https://www.gardeningknowhow.com/wp-content/uploads/2017/07/hardwood-tree-400x266.jpg',
      name: '',
      description: '',
    },
  });

  const currentName = watch('name');
  const description = watch('description');

  const communities = getCommunities();

  const validateNameAndSubmit = async data => {
    const communityNames = communities.map(({ name }) => name);
    if (communityNames.includes(data.name)) {
      setError('name', { message: 'This name has already been taken' });
      return;
    }

    onSubmit(data);
  };

  return (
    <Form className={className} onSubmit={handleSubmit(validateNameAndSubmit)}>
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
        </FormBlock>
      </FormBody>
      <Footer>
        <SubmitButton>Save</SubmitButton>
      </Footer>
    </Form>
  );
};
