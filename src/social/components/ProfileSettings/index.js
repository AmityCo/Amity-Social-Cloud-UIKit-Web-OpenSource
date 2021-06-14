import React, { memo, useState } from 'react';

import UserProfileForm from '~/social/components/UserProfileForm';
import ConditionalRender from '~/core/components/ConditionalRender';
import BackLink from '~/core/components/BackLink';
import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';
import { backgroundImage as UserImage } from '~/icons/User';
import useUser from '~/core/hooks/useUser';
import { isEmpty } from '~/helpers';

import { useNavigation } from '~/social/providers/NavigationProvider';

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
  const { onClickUser } = useNavigation();

  const [activeTab, setActiveTab] = useState(tabs.EDIT_PROFILE);

  const { user, file } = useUser(userId);

  const handleSubmit = async data => {
    const { displayName, description, avatarFileId } = data;

    try {
      await client.setDisplayName(displayName);
      await client.setDescription(description);
      await client.setAvatar(avatarFileId);
    } catch (err) {
      console.log(err);
    }

    onClickUser(userId);
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
            <UserProfileForm onSubmit={handleSubmit} user={user} />
          </ActiveTabContent>
        </ConditionalRender>
      </ActiveTabContainer>
    </Container>
  );
};

export default memo(withSDK(customizableComponent('ProfileSettings', ProfileSettings)));
