import React, { useState, forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FileRepository } from 'eko-sdk';

import Switch from '~/core/components/Switch';
import Button from '~/core/components/Button';
import Radios from '~/core/components/Radio';
import ConditionalRender from '~/core/components/ConditionalRender';
import customizableComponent from '~/core/hocs/customization';
// import { AvatarUpload } from '~/core/components/Avatar/AvatarUpload';

import CategorySelector from './CategorySelector';
import UserSelector from './UserSelector';

import {
  Form,
  TextField,
  AboutTextarea,
  SwitchContainer,
  Footer,
  SubmitButton,
  Description,
  FormBlockContainer,
  FormBlockHeader,
  FormBlockBody,
  PermissionControlContainer,
  IconWrapper,
  LockIcon,
  WorldIcon,
  Counter,
  Label,
  LabelCounterWrapper,
  Field,
  MembersField,
  ErrorMessage,
  FormBody,
} from './styles';

const FormBlock = ({ title, children, edit }) => (
  <FormBlockContainer edit={edit}>
    {edit && title && <FormBlockHeader>{title}</FormBlockHeader>}
    <FormBlockBody>{children}</FormBlockBody>
  </FormBlockContainer>
);

const PermissionSelector = forwardRef(({ name }, ref) => {
  const ItemRenderer = ({ type, description, icon }) => (
    <PermissionControlContainer>
      <IconWrapper>{icon}</IconWrapper>
      <div>
        {type}
        <Description>{description}</Description>
      </div>
    </PermissionControlContainer>
  );

  const items = [
    {
      type: 'Public',
      description: 'Anyone can join, view and search the posts in this page.',
      icon: <WorldIcon />,
      customRenderer: ItemRenderer,
      value: true,
    },
    {
      type: 'Private',
      description:
        'Only members invited by the moderators can join, view, and search the posts in this page.',
      icon: <LockIcon />,
      customRenderer: ItemRenderer,
      value: false,
    },
  ];

  const [bool, setBool] = useState(items[0].value);

  return <Radios value={bool} items={items} onChange={setBool} register={ref} name={name} />;
});

const CommunityForm = ({
  community, // initialize form on editing
  edit,
  onSubmit,
  className,
  onCancel,
}) => {
  const defaultValues = {
    avatarFileId: null,
    description: '',
    displayName: '',
    isPublic: true,
    tags: [],
    userIds: [],
    categoryId: community?.categoryIds[0] ?? '',

    ...community, // if edit, community will erase the defaults
  };

  const { register, handleSubmit, errors, setError, watch, control } = useForm({ defaultValues });

  const [avatarFileId, setAvatarFileId] = useState(edit ? community.avatarFileId : '');

  const displayName = watch('displayName', '');
  const description = watch('description', '');

  // what the hell...
  const isPublicFromForm = watch('isPublic', true);
  const isPublic = isPublicFromForm === 'true';

  const validateAndSubmit = async data => {
    if (!data.displayName.trim()) {
      setError('displayName', { message: 'Name cannot be empty' });
      return;
    }
    if (!isPublic && data.userIds.length === 0) {
      setError('userIds', { message: 'Please select at least one member' });
      return;
    }

    const payload = {
      displayName: data.displayName,
      description: data.description.length ? data.description : undefined,
      avatarFileId: null,
      tags: [],
      userIds: data.userIds,
      isPublic,
      categoryIds: data?.categoryId?.length ? [data.categoryId] : undefined,
    };

    await onSubmit(payload);
  };

  if (edit && avatarFileId) {
    const fileUrl = FileRepository.getFileUrlById(community.avatarFileId);
    setAvatarFileId(fileUrl);
  }

  // <Controller name="avatar" as={<AvatarUpload />} control={control} value={avatarFileId} />

  return (
    <Form className={className} onSubmit={handleSubmit(validateAndSubmit)} edit={edit}>
      <FormBody>
        <FormBlock title="General" edit={edit}>
          <Field error={errors.displayName}>
            <LabelCounterWrapper>
              <Label htmlFor="displayName" className="required">
                Community name
              </Label>
              <Counter>{displayName.length}/30</Counter>
            </LabelCounterWrapper>
            <TextField
              placeholder="Enter community name"
              id="displayName"
              name="displayName"
              ref={register({
                required: 'Name is required',
                maxLength: {
                  value: 30,
                  message: 'Name is too long',
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
              placeholder="Enter description"
              name="description"
              ref={register({
                maxLength: { value: 180, message: 'Description text is too long' },
              })}
            />
            <ErrorMessage errors={errors} name="description" />
          </Field>
          <Field error={errors.category}>
            <Label htmlFor="category">Category</Label>
            <Controller
              name="categoryId"
              render={CategorySelector}
              control={control}
              defaultValue={null}
            />
          </Field>
        </FormBlock>
        <ConditionalRender condition={false}>
          <FormBlock title="Post permission" edit={edit}>
            <SwitchContainer>
              <div>
                <Label>Only admin can post</Label>

                <Description>
                  Choose to allow Only Admins to create posts in this community.
                </Description>
              </div>
              <Controller
                name="onlyAdminCanPost"
                render={({ value, onChange }) => (
                  <Switch value={value} onChange={() => onChange(!value)} />
                )}
                control={control}
              />
            </SwitchContainer>
          </FormBlock>
        </ConditionalRender>
        <FormBlock title="Community permission" edit={edit}>
          <PermissionSelector ref={register} name="isPublic" />
        </FormBlock>
        <ConditionalRender condition={!isPublic}>
          <FormBlock title="Community members" edit={edit}>
            <MembersField error={errors.userIds}>
              <Label name="userIds" className="required">
                Add members
              </Label>
              <Controller name="userIds" render={UserSelector} control={control} />
              <ErrorMessage errors={errors} name="userIds" />
            </MembersField>
          </FormBlock>
        </ConditionalRender>
      </FormBody>
      <Footer edit={edit}>
        <ConditionalRender condition={!edit}>
          <Button
            onClick={e => {
              e.preventDefault();
              onCancel();
            }}
          >
            Cancel
          </Button>
        </ConditionalRender>
        <SubmitButton disabled={displayName.length === 0}>{edit ? 'Save' : 'Create'}</SubmitButton>
      </Footer>
    </Form>
  );
};

export default customizableComponent('CommunityForm', CommunityForm);
