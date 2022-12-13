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

const FormBlock = ({ children }) => (
  <FormBlockContainer>
    <FormBlockBody>{children}</FormBlockBody>
  </FormBlockContainer>
);

export const AddMemberModal = ({ className, closeConfirm, onSubmit, usersToOmit = [] }) => {
  const { formatMessage } = useIntl();

  const {
    formState: { errors },
    control,
    setError,
    handleSubmit,
  } = useForm({
    defaultValues: {
      members: [],
    },
  });

  const validateNameAndSubmit = async (data) => {
    if (data.members.length === 0) {
      setError('members', {
        message: formatMessage({ id: 'AddMemberModal.membersValidationError' }),
      });
      return;
    }
    onSubmit(data);
  };

  return (
    <Modal
      isOpen
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
                    <UserSelector
                      {...field}
                      usersToOmit={usersToOmit}
                      data-qa-anchor="add-member-modal"
                    />
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
