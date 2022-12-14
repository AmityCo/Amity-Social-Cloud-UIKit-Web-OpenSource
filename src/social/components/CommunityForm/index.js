import React, { memo, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import Switch from '~/core/components/Switch';
import Button from '~/core/components/Button';
import Radios from '~/core/components/Radio';
import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';
import useElement from '~/core/hooks/useElement';
import customizableComponent from '~/core/hocs/customization';
import AvatarUploader from './AvatarUploader';
import { isEqual } from '~/helpers';

import { notification } from '~/core/components/Notification';
import CategorySelector from './CategorySelector';
import UserSelector from '~/social/components/UserSelector';

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
    <FormBlockBody edit={edit}>{children}</FormBlockBody>
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
    key: 'public',
    type: 'Public',
    description: 'Anyone can join, view and search the posts in this page.',
    icon: <WorldIcon />,
    customRenderer: CommunityTypeItem,
    value: true,
    'data-qa-anchor': 'community-form-public-type',
  },
  {
    key: 'private',
    type: 'Private',
    description:
      'Only members invited by the moderators can join, view, and search the posts in this page.',
    icon: <LockIcon />,
    customRenderer: CommunityTypeItem,
    value: false,
    'data-qa-anchor': 'community-form-private-type',
  },
];

function useKeepScrollBottom(ref, deps) {
  const scrollBottom =
    ref.current && ref.current.scrollHeight - ref.current.clientHeight - ref.current.scrollTop;

  React.useLayoutEffect(() => {
    if (ref.current && scrollBottom < 10) {
      const scrollBottomAfterRender =
        ref.current.scrollHeight - ref.current.clientHeight - ref.current.scrollTop;

      if (scrollBottomAfterRender > 10) {
        ref.current.scrollTo({ top: ref.current.scrollHeight });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, scrollBottom, ...deps]);
}

const CommunityForm = ({
  'data-qa-anchor': dataQaAnchor = '',
  community, // initialize form on editing
  edit,
  onSubmit,
  className,
  onCancel,
  canCreatePublic,
}) => {
  const defaultValues = useMemo(
    () => ({
      avatarFileId: null,
      description: '',
      displayName: '',
      isPublic: false,
      tags: [],
      userIds: [],
      categoryId: community?.categoryIds?.[0] ?? '',
      ...community, // if edit, community will erase the defaults
    }),
    [community],
  );

  const { register, handleSubmit, setError, watch, control, formState } = useForm({
    defaultValues,
  });

  const { errors } = formState;
  const displayName = watch('displayName', '');
  const description = watch('description', '');
  const categoryId = watch('categoryId', '');
  const userIds = watch('userIds', []);
  const avatarFileId = watch('avatarFileId', null);

  // what the hell...
  // The logic is very overcomplicated, but left like this just to fix a bug until a proper refactor can be done.
  const isPublicFromForm = watch('isPublic', true);
  const isPublic =
    (typeof isPublicFromForm === 'boolean' && isPublicFromForm) || isPublicFromForm === 'true';

  const [isDirty, markDirty] = useState(false);
  useEffect(() => {
    markDirty(
      !isEqual(defaultValues, {
        ...defaultValues,
        displayName,
        description,
        categoryId,
        userIds,
        isPublic,
        avatarFileId,
      }),
    );
  }, [displayName, description, categoryId, userIds, isPublic, avatarFileId, defaultValues]);

  const [validateAndSubmit, submitting] = useAsyncCallback(
    async (data) => {
      if (!data.displayName.trim()) {
        setError('displayName', { message: 'Name cannot be empty' });
        return;
      }

      // Cannot update community members with this endpoint.
      if (!edit && !isPublic && data.userIds?.length === 0) {
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

      if (edit) {
        notification.success({ content: <FormattedMessage id="community.updateSuccess" /> });
      }
    },
    [setError, isPublic, onSubmit, edit],
  );

  const disabled = !isDirty || displayName.length === 0 || categoryId === '' || submitting;

  const [formBodyRef, formBodyElement] = useElement();
  useKeepScrollBottom(formBodyRef, [formState]);

  const formattedCommunityTypeItems = canCreatePublic
    ? communityTypeItems
    : communityTypeItems.filter((i) => i.key !== 'public');

  return (
    <Form className={className} edit={edit} onSubmit={handleSubmit(validateAndSubmit)}>
      <FormBody ref={formBodyRef}>
        <FormBlock title="General" edit={edit}>
          <Field>
            <Controller
              name="avatarFileId"
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <AvatarUploader
                  mimeType="image/png, image/jpeg"
                  {...rest}
                  data-qa-anchor={dataQaAnchor}
                />
              )}
              defaultValue={null}
            />
          </Field>
          <Field error={errors.displayName}>
            <LabelCounterWrapper>
              <Label htmlFor="displayName" className="required">
                <FormattedMessage id="community.name" />
              </Label>
              <Counter>{displayName.length}/30</Counter>
            </LabelCounterWrapper>
            <TextField
              {...register('displayName', {
                required: 'Name is required',
                maxLength: {
                  value: 30,
                  message: 'Name is too long',
                },
              })}
              data-qa-anchor={`${dataQaAnchor}-community-name-input`}
              placeholder="Enter community name"
            />
            <ErrorMessage errors={errors} name="displayName" />
          </Field>
          <Field error={errors.description}>
            <LabelCounterWrapper>
              <Label htmlFor="description">
                <FormattedMessage id="community.about" />
              </Label>
              <Counter>{description.length}/180</Counter>
            </LabelCounterWrapper>
            <AboutTextarea
              {...register('description', {
                maxLength: { value: 180, message: 'Description text is too long' },
              })}
              data-qa-anchor={`${dataQaAnchor}-community-description-textarea`}
              placeholder="Enter description"
            />
            <ErrorMessage errors={errors} name="description" />
          </Field>
          <Field error={errors.categoryId}>
            <Label htmlFor="categoryId" className="required">
              <FormattedMessage id="community.category" />
            </Label>
            <Controller
              rules={{ required: 'Category is required' }}
              name="categoryId"
              render={({ field: { ref, ...rest } }) => (
                <CategorySelector
                  parentContainer={formBodyElement}
                  {...rest}
                  data-qa-anchor={`${dataQaAnchor}`}
                />
              )}
              control={control}
              defaultValue=""
            />
            <ErrorMessage errors={errors} name="category" />
          </Field>
        </FormBlock>

        {false && (
          <FormBlock title="Post permission" edit={edit}>
            <SwitchContainer>
              <div>
                <Label>
                  <FormattedMessage id="community.onlyadmincanpost" />
                </Label>

                <Description>
                  <FormattedMessage id="community.onlyadmins" />,
                </Description>
              </div>
              <Controller
                name="onlyAdminCanPost"
                render={({ field: { value, onChange } }) => (
                  <Switch value={value} onChange={() => onChange(!value)} />
                )}
                control={control}
                defaultValue={false}
              />
            </SwitchContainer>
          </FormBlock>
        )}

        <FormBlock title={<FormattedMessage id="community.categorypermission" />} edit={edit}>
          <Controller
            name="isPublic"
            render={({ field: { value, onChange } }) => (
              <Radios
                items={formattedCommunityTypeItems}
                value={value}
                onChange={() => onChange(!value)}
              />
            )}
            control={control}
          />
        </FormBlock>

        {!isPublic && !edit && (
          <FormBlock title="Community members" edit={edit}>
            <MembersField error={errors.userIds}>
              <Label name="userIds" className="required">
                <FormattedMessage id="community.addmembers" />
              </Label>
              <Controller
                name="userIds"
                render={({ field: { ref, ...rest } }) => (
                  <UserSelector
                    parentContainer={formBodyElement}
                    data-qa-anchor={dataQaAnchor}
                    {...rest}
                  />
                )}
                control={control}
              />
              <ErrorMessage errors={errors} name="userIds" />
            </MembersField>
          </FormBlock>
        )}
      </FormBody>
      <Footer edit={edit}>
        {!edit && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              onCancel();
            }}
          >
            <FormattedMessage id="cancel" />
          </Button>
        )}

        <SubmitButton
          data-qa-anchor={`${dataQaAnchor}-${edit ? 'save' : 'create'}-button`}
          disabled={disabled}
          edit={edit}
        >
          {edit ? <FormattedMessage id="save" /> : <FormattedMessage id="create" />}
        </SubmitButton>
      </Footer>
    </Form>
  );
};

export default memo(customizableComponent('CommunityForm', CommunityForm));
