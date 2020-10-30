import React, { useState } from 'react';

import { getUser } from '~/helpers';
import UserProfileForm from '~/social/components/UserProfileForm';
import ConditionalRender from '~/core/components/ConditionalRender';
import BackLink from '~/core/components/BackLink';
import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';
import { backgroundImage as UserImage } from '~/icons/User';
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

  const currentUser = getUser(userId);

  const handleSubmit = async data => {
    const { displayName, description } = data;
    await client.setDisplayName(displayName);
    await client.setDescription(description);
  };

  return (
    <Container>
      <PageHeader>
        <AvatarContainer>
          <Avatar avatar={currentUser.avatar} backgroundImage={UserImage} />
        </AvatarContainer>
        <div>
          <BackLink text={`Return to ${currentUser.displayName}`} />
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
              user={currentUser}
            />
          </ActiveTabContent>
        </ConditionalRender>
      </ActiveTabContainer>
    </Container>
  );
};

export default withSDK(customizableComponent('ProfileSettings', ProfileSettings));
