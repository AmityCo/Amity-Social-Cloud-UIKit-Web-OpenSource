import React, { ReactNode, memo, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import Button from '~/core/components/Button';
import Radio from '~/core/components/Radio';

import AvatarUploader from './AvatarUploader';

import CategorySelector from './CategorySelector';
import UserSelector from '~/social/components/UserSelector';

import {
  Form,
  TextField,
  AboutTextarea,
  Footer,
  SubmitButton,
  Description,
  FormBlockContainer,
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
import { CreateFormValues, useCreateCommunityForm } from './hooks';
import { CommunityRepository } from '@amityco/ts-sdk';

interface FormBlockProps {
  title?: ReactNode;
  children: ReactNode;
}

const FormBlock = ({ title, children }: FormBlockProps) => (
  <FormBlockContainer>
    <FormBlockBody>{children}</FormBlockBody>
  </FormBlockContainer>
);

interface CommunityTypeItemProps {
  type: string;
  description: string;
  icon: ReactNode;
}

const CommunityTypeItem = ({ type, description, icon }: CommunityTypeItemProps) => (
  <PermissionControlContainer>
    <IconWrapper>{icon}</IconWrapper>
    <div>
      {type}
      <Description>{description}</Description>
    </div>
  </PermissionControlContainer>
);

interface CreateCommunityFormProps {
  'data-qa-anchor'?: string;
  community?: Amity.Community;
  onSubmit?: (data: Parameters<typeof CommunityRepository.createCommunity>[0]) => void;
  className?: string;
  onCancel?: () => void;
}

const CreateCommunityForm = ({
  'data-qa-anchor': dataQaAnchor = '',
  className,
  onSubmit,
  onCancel,
}: CreateCommunityFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, setError, watch, control, formState, setValue, getValues } =
    useCreateCommunityForm();

  const { errors } = formState;
  const displayName = watch('displayName');
  const description = watch('description');
  const isPublic = watch('isPublic');

  const formBodyRef = useRef<HTMLDivElement | null>(null);

  const validateAndSubmit = async (data: CreateFormValues) => {
    try {
      setSubmitting(true);

      // Cannot update community members with this endpoint.
      if (!data.isPublic && data.userIds?.length === 0) {
        setError('userIds', { message: 'Please select at least one member' });
        return;
      }

      await onSubmit?.({
        ...data,
        displayName: data.displayName || '',
        avatarFileId: data.avatarFileId || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = !formState.isValid || submitting;

  const scrollBottom =
    formBodyRef.current &&
    formBodyRef.current.scrollHeight -
      formBodyRef.current.clientHeight -
      formBodyRef.current.scrollTop;

  React.useLayoutEffect(() => {
    if (scrollBottom != null && formBodyRef.current && scrollBottom < 10) {
      const scrollBottomAfterRender =
        formBodyRef.current.scrollHeight -
        formBodyRef.current.clientHeight -
        formBodyRef.current.scrollTop;

      if (scrollBottomAfterRender > 10) {
        formBodyRef.current.scrollTo({ top: formBodyRef.current.scrollHeight });
      }
    }
  }, [formBodyRef.current, scrollBottom, formState]);

  return (
    <Form className={className} onSubmit={handleSubmit(validateAndSubmit)}>
      <FormBody ref={formBodyRef}>
        <FormBlock title="General">
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
              {...register('displayName')}
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
              <Counter>{description?.length || 0}/180</Counter>
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
          <Field error={errors.categoryIds}>
            <Label htmlFor="categoryIds" className="required">
              <FormattedMessage id="community.category" />
            </Label>
            <Controller
              rules={{ required: 'Category is required' }}
              name="categoryIds"
              render={({ field: { ref, onChange, ...rest } }) => (
                <CategorySelector
                  parentContainer={formBodyRef.current}
                  onChange={(categoryIds) =>
                    setValue('categoryIds', categoryIds as any, { shouldValidate: true })
                  }
                  {...rest}
                  data-qa-anchor={`${dataQaAnchor}`}
                />
              )}
              control={control}
            />
            <ErrorMessage errors={errors} name="category" />
          </Field>
        </FormBlock>

        <FormBlock title={<FormattedMessage id="community.categorypermission" />}>
          <Controller
            name="isPublic"
            render={({ field }) => (
              <>
                <Radio
                  {...field}
                  value={field.value === true}
                  onChange={(event) => field.onChange(event.target.checked)}
                  data-qa-anchor={`community-form-public-type-community-type`}
                  label="Public"
                  renderer={() => (
                    <CommunityTypeItem
                      type="Public"
                      description="Anyone can join, view and search the posts in this page."
                      icon={<WorldIcon />}
                    />
                  )}
                />
                <Radio
                  {...field}
                  value={field.value === false}
                  onChange={(event) => field.onChange(!event.target.checked)}
                  data-qa-anchor={`community-form-private-type-community-type`}
                  label="Private"
                  renderer={() => (
                    <CommunityTypeItem
                      type="Private"
                      description="Only members invited by the moderators can join, view, and search the posts in this page."
                      icon={<LockIcon />}
                    />
                  )}
                />
              </>
            )}
            control={control}
          />
        </FormBlock>

        {!isPublic && (
          <FormBlock title="Community members">
            <MembersField error={errors.userIds}>
              <Label className="required">
                <FormattedMessage id="community.addmembers" />
              </Label>
              <Controller
                name="userIds"
                render={({ field: { ref, ...rest } }) => (
                  <UserSelector
                    parentContainer={formBodyRef.current}
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
      <Footer>
        <Button
          onClick={(e) => {
            e.preventDefault();
            onCancel?.();
          }}
        >
          <FormattedMessage id="cancel" />
        </Button>

        <SubmitButton data-qa-anchor={`${dataQaAnchor}-save-button`} disabled={disabled}>
          <FormattedMessage id="create" />
        </SubmitButton>
      </Footer>
    </Form>
  );
};

export default memo(CreateCommunityForm);
