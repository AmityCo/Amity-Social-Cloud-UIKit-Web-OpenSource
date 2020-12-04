import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import Switch from '~/core/components/Switch';
import Button from '~/core/components/Button';
import Radios from '~/core/components/Radio';
import ConditionalRender from '~/core/components/ConditionalRender';
import useElement from '~/core/hooks/useElement';
import customizableComponent from '~/core/hocs/customization';
import ImageUploader from './ImageUploader';

import { notification } from '~/core/components/Notification';
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

const CommunityTypeItem = ({ type, description, icon }) => (
  <PermissionControlContainer>
    <IconWrapper>{icon}</IconWrapper>
    <div>
      {type}
      <Description>{description}</Description>
    </div>
  </PermissionControlContainer>
);

const communityTypeItems = [
  {
    type: 'Public',
    description: 'Anyone can join, view and search the posts in this page.',
    icon: <WorldIcon />,
    customRenderer: CommunityTypeItem,
    value: true,
  },
  {
    type: 'Private',
    description:
      'Only members invited by the moderators can join, view, and search the posts in this page.',
    icon: <LockIcon />,
    customRenderer: CommunityTypeItem,
    value: false,
  },
];

const CommunityForm = ({
  community, // initialize form on editing
  edit,
  onSubmit,
  className,
  onCancel,
}) => {
  const categoryIds = community?.categoryIds ?? [];
  const defaultValues = {
    avatarFileId: null,
    description: '',
    displayName: '',
    isPublic: true,
    tags: [],
    userIds: [],
    categoryId: categoryIds[0] ?? '',

    ...community, // if edit, community will erase the defaults
  };

  const { register, handleSubmit, errors, setError, watch, control } = useForm({
    defaultValues,
  });

  const [avatarFileId] = useState(edit ? community.avatarFileId : null);

  const displayName = watch('displayName', '');
  const description = watch('description', '');
  const categoryId = watch('categoryId', '');

  // what the hell...
  // The logic is very overcomplicated, but left like this just to fix a bug until a proper refactor can be done.
  const isPublicFromForm = watch('isPublic', true);
  const isPublic =
    (typeof isPublicFromForm === 'boolean' && isPublicFromForm) || isPublicFromForm === 'true';

  const validateAndSubmit = async data => {
    if (!data.displayName.trim()) {
      setError('displayName', { message: 'Name cannot be empty' });
      return;
    }
    if (!isPublic && data.userIds?.length === 0) {
      setError('userIds', { message: 'Please select at least one member' });
      return;
    }

    const payload = {
      displayName: data.displayName,
      description: data.description?.length ? data.description : undefined,
      avatarFileId: data.avatarFileId,
      tags: [],
      userIds: data.userIds,
      isPublic,
      // Currently we support only one category per community.
      categoryIds: data?.categoryId?.length ? [data.categoryId] : undefined,
    };

    // Cannot update community members with this endpoint.
    if (edit) {
      delete payload.userIds;
    }

    await onSubmit(payload);

    const notificationMessageId = edit ? 'community.updateSuccess' : 'community.createSuccess';
    notification.success({
      content: <FormattedMessage id={notificationMessageId} />,
    });
  };

  const disabled = useMemo(() => displayName.length === 0 || categoryId === '', [
    displayName,
    categoryId,
  ]);

  const [formBodyRef, formBodyElement] = useElement();

  return (
    <Form className={className} onSubmit={handleSubmit(validateAndSubmit)} edit={edit}>
      <FormBody ref={formBodyRef}>
        <FormBlock title="General" edit={edit}>
          <Field>
            <Controller
              name="avatarFileId"
              control={control}
              render={({ onChange }) => (
                <ImageUploader mimeType="image/png, image/jpeg" onChange={onChange} />
              )}
              defaultValue={null}
            />
          </Field>
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
          <Field error={errors.categoryId}>
            <Label htmlFor="categoryId" className="required">
              Category
            </Label>
            <Controller
              name="categoryId"
              ref={register({ required: 'Category is required' })}
              render={props => <CategorySelector parentContainer={formBodyElement} {...props} />}
              control={control}
              defaultValue=""
            />
            <ErrorMessage errors={errors} name="category" />
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
          <Controller
            name="isPublic"
            render={({ value, onChange }) => (
              <Radios items={communityTypeItems} value={value} onChange={() => onChange(!value)} />
            )}
            control={control}
          />
        </FormBlock>
        <ConditionalRender condition={!isPublic && !edit}>
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
        <SubmitButton disabled={disabled} edit={edit}>
          {edit ? 'Save' : 'Create'}
        </SubmitButton>
      </Footer>
    </Form>
  );
};

export default customizableComponent('CommunityForm', CommunityForm);
