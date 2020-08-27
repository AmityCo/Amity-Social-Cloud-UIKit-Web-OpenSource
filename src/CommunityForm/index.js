import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { customizableComponent } from '../hoks/customization';
import { notification } from '../commonComponents/Notification';

import { testUser } from '../mock';

import {
  Form,
  InformationBlock,
  Avatar,
  AvatarUploadContainer,
  AboutTextarea,
  Switch,
  SwitchContainer,
  Footer,
  SubmitButton,
  Description,
  FormBlockContainer,
  FormBlockHeader,
  FormBlockBody,
} from './styles';

// const maxFilesWarning = () =>
//   notification.info({
//     content: 'The selected file is larger than 1GB. Please select a new file. ',
//   });

const AvatarUpload = () => (
  <AvatarUploadContainer>
    <Avatar size="big" />
  </AvatarUploadContainer>
);

const FormBlock = ({ title, children, edit }) => (
  <FormBlockContainer edit={edit}>
    {edit && title && <FormBlockHeader>{title}</FormBlockHeader>}
    <FormBlockBody>{children}</FormBlockBody>
  </FormBlockContainer>
);

const CommunityForm = ({ user = testUser, community, edit, onSubmit, onSave, className }) => {
  const [text, setText] = useState('');

  const { register, handleSubmit, getValues, setValue, errors, watch } = useForm(); // initialize the hook

  // const onSubmit = data => {
  //   console.log(data);
  // };
  const values = getValues();
  console.log('values', values);
  // const { onlyAdminCanPost } = values;
  const onlyAdminCanPost = watch('onlyAdminCanPost', false);
  return (
    <>
      <Form className={className} onSubmit={handleSubmit(onSubmit)} edit={edit}>
        <FormBlock title="General" edit={edit}>
          {/*   avatar */}
          <AvatarUpload />
          Community name
          <AboutTextarea />
          {/* 0/30 */}
          About
          <AboutTextarea name="about" ref={register} />
          {/* 0/180 */}
          Category
          <div> selector </div>
        </FormBlock>
        <FormBlock title="Post permission" edit={edit}>
          <SwitchContainer>
            <div>
              Only admin can post
              <Description>
                Choose to allow Only Admins to create posts in this community.
              </Description>
            </div>
            <Switch
              checked={onlyAdminCanPost}
              onChange={e => setValue('onlyAdminCanPost', e.target.checked)}
            />
          </SwitchContainer>
        </FormBlock>
        <FormBlock title="Community permission" edit={edit}>
          Public
          <Description>Anyone can join, view, and search the posts  in this page.</Description>
          PrivateIcon
          <Description>
            Only members invited by the moderators can join, view, and search the posts in this
            page.{' '}
          </Description>
        </FormBlock>
        <Footer>
          <SubmitButton>Create</SubmitButton>
        </Footer>
      </Form>
    </>
  );
};

export default customizableComponent('CommunityForm')(CommunityForm);
