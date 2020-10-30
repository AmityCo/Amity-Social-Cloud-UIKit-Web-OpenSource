import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FileRepository } from 'eko-sdk';

import Switch from '~/core/components/Switch';
import Button from '~/core/components/Button';
import ConditionalRender from '~/core/components/ConditionalRender';
import customizableComponent from '~/core/hocs/customization';
import { AvatarUpload } from '~/core/components/Avatar/AvatarUpload';

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
  Radio,
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

const CommunityForm = ({
  community, // initialize form on editing
  edit,
  onSubmit,
  className,
  onCancel,
}) => {
  const { register, handleSubmit, errors, setError, watch, control } = useForm({
    defaultValues: edit
      ? community
      : {
          avatarFileId: null,
          description: '',
          displayName: '',
          isPublic: true,
          tags: [],
          userIds: [],
          members: [],
        },
  });

  const [avatarFileId, setAvatarFileId] = useState(edit ? community.avatarFileId : '');

  const displayName = watch('displayName', '');
  const description = watch('description', '');

  const validateAndSubmit = async data => {
    const isPublicCommunity = JSON.parse(data.isPublic) || data.isPublic === 'true';

    if (!data.displayName.trim()) {
      setError('displayName', { message: 'Name cannot be empty' });
      return;
    }
    if (!isPublicCommunity && data.members.length === 0) {
      setError('members', { message: 'Please select at least one member' });
      return;
    }

    await onSubmit({
      displayName: data.displayName,
      description: data.description.length ? data.description : undefined,
      avatarFileId: null,
      tags: [],
      userIds: [],
      isPublic: isPublicCommunity,
    });
  };

  if (edit && avatarFileId) {
    const fileUrl = FileRepository.getFileUrlById(community.avatarFileId);
    setAvatarFileId(fileUrl);
  }

  return (
    <Form className={className} onSubmit={handleSubmit(validateAndSubmit)} edit={edit}>
      <FormBody>
        <FormBlock title="General" edit={edit}>
          <Controller name="avatar" as={<AvatarUpload />} control={control} value={avatarFileId} />
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
            <Controller name="categories" render={CategorySelector} control={control} />
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
          <PermissionControlContainer>
            <IconWrapper>
              <WorldIcon />
            </IconWrapper>
            <div>
              Public
              <Description>Anyone can join, view, and search the posts in this page.</Description>
            </div>
            <Radio name="isPublic" value defaultChecked ref={register} />
          </PermissionControlContainer>
          <PermissionControlContainer>
            <IconWrapper>
              <LockIcon />
            </IconWrapper>
            <div>
              Private
              <Description>
                Only members invited by the moderators can join, view, and search the posts in this
                page.
              </Description>
            </div>
            <Radio name="isPublic" value={false} ref={register} />
          </PermissionControlContainer>
        </FormBlock>
        <FormBlock title="Community members" edit={edit}>
          <MembersField error={errors.members}>
            <Label name="members" className="required">
              Add members
            </Label>
            <Controller name="members" render={UserSelector} control={control} />
            <ErrorMessage errors={errors} name="members" />
          </MembersField>
        </FormBlock>
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
