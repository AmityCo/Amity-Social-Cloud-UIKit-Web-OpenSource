import React from 'react';
import { useForm, Controller } from 'react-hook-form';

import {
  ErrorMessage,
  Form,
  FormBlockBody,
  FormBlockContainer,
  FormBlockHeader,
  FormBody,
  Label,
  MembersField,
  SubmitButton,
  Footer,
} from 'components/CommunityForm/styles';
import UserSelector from 'components/CommunityForm/UserSelector';
import Modal from 'components/Modal';

const FormBlock = ({ title, children }) => (
  <FormBlockContainer>
    <FormBlockHeader>{title}</FormBlockHeader>
    <FormBlockBody>{children}</FormBlockBody>
  </FormBlockContainer>
);

export const AddMemberModal = ({ className, closeConfirm, onSubmit, community }) => {
  const { errors, control, setError, handleSubmit } = useForm({
    defaultValues: {
      members: community.members,
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
    <Modal title="Create community" onCancel={closeConfirm}>
      <Form className={className} onSubmit={handleSubmit(validateNameAndSubmit)}>
        <FormBody>
          <FormBlock title="Community members">
            <MembersField error={errors.members}>
              <Label name="members" required>
                Add members
              </Label>
              <Controller name="members" render={UserSelector} control={control} />
              <ErrorMessage errors={errors} name="members" />
            </MembersField>
          </FormBlock>
        </FormBody>
        <Footer>
          <SubmitButton>Add</SubmitButton>
        </Footer>
      </Form>
    </Modal>
  );
};
