import React from 'react';
import { useForm, Controller } from 'react-hook-form';

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

export const AddMemberModal = ({ className, closeConfirm, onSubmit }) => {
  const { errors, control, setError, handleSubmit } = useForm({
    defaultValues: {
      members: [],
    },
  });

  const validateNameAndSubmit = async data => {
    if (data.members.length === 0) {
      setError('members', { message: 'Please select at least one member' });
      return;
    }
    onSubmit(data);
  };

  return (
    <Modal title="Add members" onCancel={closeConfirm}>
      <FormContainer>
        <Form className={className} onSubmit={handleSubmit(validateNameAndSubmit)}>
          <FormBody>
            <FormBlock>
              <MembersField error={errors.members}>
                <Controller name="members" render={UserSelector} control={control} />
                <ErrorMessage errors={errors} name="members" />
              </MembersField>
            </FormBlock>
          </FormBody>
          <Footer>
            <SubmitButton>Add</SubmitButton>
          </Footer>
        </Form>
      </FormContainer>
    </Modal>
  );
};
