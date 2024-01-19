import React, { memo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import UserProfileForm from '~/social/components/UserProfileForm';
import BackLink from '~/core/components/BackLink';

import { backgroundImage as UserImage } from '~/icons/User';
import useUser from '~/core/hooks/useUser';

import { useNavigation } from '~/social/providers/NavigationProvider';

import { Tabs, tabs } from './constants';
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
import useSDK from '~/core/hooks/useSDK';
import useFile from '~/core/hooks/useFile';
import { UserRepository } from '@amityco/ts-sdk';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useImage from '~/core/hooks/useImage';

interface ProfileSettingsProps {
  userId?: string;
}

const ProfileSettings = ({ userId }: ProfileSettingsProps) => {
  // const { currentUserId } = useSDK();
  const { formatMessage } = useIntl();
  const { onClickUser } = useNavigation();

  const [activeTab, setActiveTab] = useState(Tabs.EDIT_PROFILE);

  const user = useUser(userId);
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });

  const handleSubmit = async (
    data: Partial<Pick<Amity.User, 'displayName'>> &
      Pick<Amity.User, 'description' | 'avatarFileId'>,
  ) => {
    try {
      if (userId == null) return;
      await UserRepository.updateUser(userId, data);
      onClickUser(userId);
    } catch (err) {
      console.log(err);
    }
  };

  if (user == null) {
    return null;
  }

  return (
    <Container>
      <PageHeader>
        <AvatarContainer>
          <Avatar avatar={avatarFileUrl} backgroundImage={UserImage} />
        </AvatarContainer>
        <div>
          <BackLink
            text={formatMessage({ id: 'ProfileSettings.returnTo' }) + (user?.displayName || '')}
          />
          <PageTitle>
            <FormattedMessage id="profile.setting" />
          </PageTitle>
        </div>
      </PageHeader>
      <div>
        <ProfileSettingsTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>
      <ActiveTabContainer>
        {activeTab === Tabs.EDIT_PROFILE && (
          <ActiveTabContent>
            {user != null ? <UserProfileForm user={user} onSubmit={handleSubmit} /> : null}
          </ActiveTabContent>
        )}
      </ActiveTabContainer>
    </Container>
  );
};

export default memo((props: ProfileSettingsProps) => {
  const CustomComponentFn = useCustomComponent<ProfileSettingsProps>('ProfileSettings');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <ProfileSettings {...props} />;
});
