import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';

import Modal from '~/core/components/Modal';
import UserSelector from '~/social/components/UserSelector';
import {
  ErrorMessage,
  Form,
  FormBlockBody,
  FormBlockContainer,
  FormBody,
  MembersField,
  SubmitButton,
  Footer,
} from '~/social/components/CommunityForm/styles';
import { FormContainer } from './styles';
import { CommunityRepository } from '@amityco/ts-sdk';

interface FormBlockProps {
  children: React.ReactNode;
}

type FormValues = { members: Parameters<typeof CommunityRepository.Membership.addMembers>[1] };

const FormBlock = ({ children }: FormBlockProps) => (
  <FormBlockContainer>
    <FormBlockBody>{children}</FormBlockBody>
  </FormBlockContainer>
);

interface AddMemberModalProps {
  className?: string;
  closeConfirm: () => void;
  onSubmit: (userIds: string[]) => void;
}

export const AddMemberModal = ({ className = '', closeConfirm, onSubmit }: AddMemberModalProps) => {
  const { formatMessage } = useIntl();

  const {
    formState: { errors },
    control,
    setError,
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      members: [],
    },
  });

  const validateNameAndSubmit = async (data: FormValues) => {
    if (data.members.length === 0) {
      setError('members', {
        message: formatMessage({ id: 'AddMemberModal.membersValidationError' }),
      });
      return;
    }
    onSubmit(data.members);
  };

  return (
    <Modal
      data-qa-anchor="add-member-modal"
      title={formatMessage({ id: 'AddMemberModal.addMembers' })}
      onCancel={closeConfirm}
    >
      <FormContainer>
        <Form className={className} onSubmit={handleSubmit(validateNameAndSubmit)}>
          <FormBody>
            <FormBlock>
              <MembersField error={errors.members}>
                <Controller
                  name="members"
                  render={({ field }) => (
                    <UserSelector {...field} data-qa-anchor="add-member-modal" />
                  )}
                  control={control}
                />
                <ErrorMessage errors={errors} name="members" />
              </MembersField>
            </FormBlock>
          </FormBody>
          <Footer>
            <SubmitButton>
              <FormattedMessage id="add" />
            </SubmitButton>
          </Footer>
        </Form>
      </FormContainer>
    </Modal>
  );
};
