import React, { useState } from 'react';

import UserProfileForm from '~/social/components/UserProfileForm';
import ConditionalRender from '~/core/components/ConditionalRender';
import BackLink from '~/core/components/BackLink';
import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';
import { backgroundImage as UserImage } from '~/icons/User';
import useUser from '~/core/hooks/useUser';
import { isEmpty } from '~/helpers';

import {
  ProfileSettingsTabs,
  Container,
  ActiveTabContent,
  ActiveTabContainer,
  PageHeader,
  PageTitle,
  Avatar,
  AvatarContainer,
} from './styles';

// TODO replace with translations keys
const tabs = {
  EDIT_PROFILE: 'Edit profile',
};

const ProfileSettings = ({ userId, client }) => {
  const [activeTab, setActiveTab] = useState(tabs.EDIT_PROFILE);

  const { user, file } = useUser(userId);

  const handleSubmit = async data => {
    const { displayName, description } = data;
    await client.setDisplayName(displayName);
    await client.setDescription(description);
  };

  if (isEmpty(user)) {
    return null;
  }

  return (
    <Container>
      <PageHeader>
        <AvatarContainer>
          <Avatar avatar={file.fileUrl} backgroundImage={UserImage} />
        </AvatarContainer>
        <div>
          <BackLink text={`Return to ${user.displayName}`} />
          <PageTitle>Profile Settings</PageTitle>
        </div>
      </PageHeader>
      <div>
        <ProfileSettingsTabs
          tabs={[tabs.EDIT_PROFILE]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>
      <ActiveTabContainer>
        <ConditionalRender condition={activeTab === tabs.EDIT_PROFILE}>
          <ActiveTabContent>
            <UserProfileForm
              onSubmit={async data => {
                await handleSubmit(data);
              }}
              user={user}
            />
          </ActiveTabContent>
        </ConditionalRender>
      </ActiveTabContainer>
    </Container>
  );
};

export default withSDK(customizableComponent('ProfileSettings', ProfileSettings));
