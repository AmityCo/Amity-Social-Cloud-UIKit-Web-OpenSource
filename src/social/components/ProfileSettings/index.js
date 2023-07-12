import React, { memo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import BackLink from '~/core/components/BackLink';
import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';
import useUser from '~/core/hooks/useUser';
import { isEmpty } from '~/helpers';
import { backgroundImage as UserImage } from '~/icons/User';
import UserProfileForm from '~/social/components/UserProfileForm';

import { useNavigation } from '~/social/providers/NavigationProvider';

import { Tabs, tabs } from './constants';
import {
  ActiveTabContainer,
  ActiveTabContent,
  Avatar,
  AvatarContainer,
  Container,
  PageHeader,
  PageTitle,
  ProfileSettingsTabs,
} from './styles';

const ProfileSettings = ({ userId, client }) => {
  const { formatMessage } = useIntl();
  const { onClickUser } = useNavigation();

  const [activeTab, setActiveTab] = useState(Tabs.EDIT_PROFILE);

  const { user, file } = useUser(userId);

  const handleSubmit = async (data) => {
    try {
      await client.updateCurrentUser(data);
    } catch (err) {
      console.log(err);
    }

    onClickUser(userId);
  };

  if (isEmpty(user)) {
    return null;
  }

  return (
    <Container className="xs:!min-w-0 md:min-w-[600px]">
      <PageHeader className="xs:!hidden md:!flex">
        <AvatarContainer>
          <Avatar avatar={file.fileUrl} backgroundImage={UserImage} />
        </AvatarContainer>
        <div>
          <BackLink text={formatMessage({ id: 'ProfileSettings.returnTo' }) + user.displayName} />
          <PageTitle>
            <FormattedMessage id="profile.setting" />
          </PageTitle>
        </div>
      </PageHeader>
      <div>
        <ProfileSettingsTabs
          className="xs:!hidden md:!block"
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>
      <ActiveTabContainer>
        {activeTab === Tabs.EDIT_PROFILE && (
          <ActiveTabContent>
            <UserProfileForm className="w-full" user={user} onSubmit={handleSubmit} />
          </ActiveTabContent>
        )}
      </ActiveTabContainer>
    </Container>
  );
};

export default memo(withSDK(customizableComponent('ProfileSettings', ProfileSettings)));
