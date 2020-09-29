import React, { useState } from 'react';

import { UserProfileForm } from 'components/Profile/UserProfileForm';
import { ConditionalRender } from 'components/ConditionalRender';
import { BackLink } from 'components/BackLink';
import { customizableComponent } from 'hocs/customization';
import { getUser } from 'mock/index';
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

const ProfileSettings = ({ userId }) => {
  const [activeTab, setActiveTab] = useState(tabs.EDIT_PROFILE);
  const currentUser = getUser(userId);

  const handleSubmit = data => {
    return data;
  };

  return (
    <Container>
      <PageHeader>
        <AvatarContainer>
          <Avatar avatar={currentUser.avatar} />
        </AvatarContainer>
        <div>
          <BackLink text={`Return to ${currentUser.name}`} />
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
              onSubmit={data => {
                handleSubmit(data);
              }}
              user={currentUser}
            />
          </ActiveTabContent>
        </ConditionalRender>
      </ActiveTabContainer>
    </Container>
  );
};

export default customizableComponent('ProfileSettings', ProfileSettings);
