import React from 'react';
import { useForm, Controller } from 'react-hook-form';

import Switch from '~/core/components/Switch';
import Button from '~/core/components/Button';
import { customizableComponent } from '~/core/hocs/customization';

import CategorySelector from './CategorySelector';
import UserSelector from './UserSelector';

import {
  Form,
  TextField,
  Avatar,
  AvatarUploadContainer,
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
  CameraIcon,
  Radio,
  Counter,
  Label,
  LabelCounterWrapper,
  Field,
  MembersField,
  AvatarWrapper,
  ErrorMessage,
  FormBody,
} from './styles';

const AvatarUpload = ({ value }) => (
  <AvatarUploadContainer>
    <AvatarWrapper>
      <Avatar size="big" avatar={value} />
      <CameraIcon />
    </AvatarWrapper>
  </AvatarUploadContainer>
);

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
          avatar:
            'https://www.gardeningknowhow.com/wp-content/uploads/2017/07/hardwood-tree-400x266.jpg',
          name: '',
          description: '',
          category: 'cat0',
          onlyAdminCanPost: false,
          isPublic: true,
          members: [],
        },
  });

  const currentName = watch('name');
  const description = watch('description');
  const isPublic = watch('isPublic');

  const validateAndSubmit = async data => {
    if (!data.name.trim()) {
      setError('name', { message: 'Name cannot be empty' });
      return;
    }
    if (!data.isPublic && data.members.length === 0) {
      setError('members', { message: 'Please select at least one member' });
      return;
    }
    onSubmit(data);
  };

  return (
    <Form className={className} onSubmit={handleSubmit(validateAndSubmit)} edit={edit}>
      <FormBody>
        <FormBlock title="General" edit={edit}>
          <Controller name="avatar" render={AvatarUpload} control={control} />
          <Field error={errors.name}>
            <LabelCounterWrapper>
              <Label htmlFor="name" className="required">
                Community name
              </Label>
              <Counter>{currentName.length}/30</Counter>
            </LabelCounterWrapper>
            <TextField
              placeholder="Enter community name"
              id="name"
              name="name"
              ref={register({
                required: 'Name is required',
                maxLength: {
                  value: 30,
                  message: 'Name is too long',
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
            <Controller name="category" render={CategorySelector} control={control} />
          </Field>
        </FormBlock>
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
        <FormBlock title="Community permission" edit={edit}>
          <PermissionControlContainer>
            <IconWrapper>
              <WorldIcon />
            </IconWrapper>
            <div>
              Public
              <Description>Anyone can join, view, and search the posts  in this page.</Description>
            </div>
            <Radio type="radio" name="isPublic" defaultChecked ref={register} />
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
            <Radio type="radio" name="isPublic" value={false} ref={register} />
          </PermissionControlContainer>
        </FormBlock>
        {!isPublic && (
          <FormBlock title="Community members" edit={edit}>
            <MembersField error={errors.members}>
              <Label name="members" className="required">
                Add members
              </Label>
              <Controller name="members" render={UserSelector} control={control} />
              <ErrorMessage errors={errors} name="members" />
            </MembersField>
          </FormBlock>
        )}
      </FormBody>
      <Footer edit={edit}>
        {!edit && (
          <Button
            onClick={e => {
              e.preventDefault();
              onCancel();
            }}
          >
            Cancel
          </Button>
        )}
        <SubmitButton disabled={currentName.length === 0}>{edit ? 'Save' : 'Create'}</SubmitButton>
      </Footer>
    </Form>
  );
};

export default customizableComponent('CommunityForm', CommunityForm);
