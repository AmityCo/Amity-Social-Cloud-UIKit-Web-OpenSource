import React, { memo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import UserProfileForm from '~/social/components/UserProfileForm';
import BackLink from '~/core/components/BackLink';
import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';
import { backgroundImage as UserImage } from '~/icons/User';
import useUser from '~/core/hooks/useUser';
import { isEmpty } from '~/helpers';

import PageLayout from '~/social/layouts/Page';
import PageHeader from '~/core/components/PageHeader';
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

const ProfileSettings = ({ userId, client }) => {
  const { formatMessage } = useIntl();
  const { onClickUser } = useNavigation();

  const [activeTab, setActiveTab] = useState(Tabs.EDIT_PROFILE);

  const { user, file } = useUser(userId);

  const onBack = () => {
    onClickUser(userId);
  };

  const handleSubmit = async (data) => {
    try {
      await client.updateCurrentUser(data);
    } catch (err) {
      console.log(err);
    }

    onBack();
  };

  if (isEmpty(user)) {
    return null;
  }

  return (
    <PageLayout
      header={
        <>
          <PageHeader
            title={<FormattedMessage id="profile.setting" />}
            avatarFileUrl={file.fileUrl}
            avatarImage={UserImage}
            backLinkText={formatMessage({ id: 'ProfileSettings.returnTo' }) + user.displayName}
            hideBackArrow
            onBack={onBack}
          />
          <ProfileSettingsTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </>
      }
    >
      <ActiveTabContainer>
        {activeTab === Tabs.EDIT_PROFILE && (
          <ActiveTabContent>
            <UserProfileForm user={user} onSubmit={handleSubmit} />
          </ActiveTabContent>
        )}
      </ActiveTabContainer>
    </PageLayout>
  );
};

export default memo(withSDK(customizableComponent('ProfileSettings', ProfileSettings)));
