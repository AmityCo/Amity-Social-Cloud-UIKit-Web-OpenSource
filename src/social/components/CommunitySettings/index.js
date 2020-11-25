import React, { useState } from 'react';

import ConditionalRender from '~/core/components/ConditionalRender';
import CommunityMembers from '~/social/components/CommunityMembers';
import CommunityForm from '~/social/components/CommunityForm';
import BackLink from '~/core/components/BackLink';
import { AddMemberModal } from '~/social/components/AddMemberModal';

import customizableComponent from '~/core/hocs/customization';
import useCommunity from '~/social/hooks/useCommunity';

import { backgroundImage as CommunityImage } from '~/icons/Community';
import {
  CommunitySettingsTabs,
  Container,
  ActiveTabContent,
  ActiveTabContainer,
  PageHeader,
  PageTitle,
  Avatar,
  AvatarContainer,
} from './styles';
import { CloseCommunityAction, AddMemberAction } from './ExtraAction';

// TODO replace with translations keys
const tabs = {
  EDIT_PROFILE: 'Edit profile',
  MEMBERS: 'Members',
};

const CommunitySettings = ({ communityId, onMemberClick, onCommunityClosed }) => {
  const [activeTab, setActiveTab] = useState(tabs.EDIT_PROFILE);
  const [isModalOpened, setModalOpened] = useState(false);

  const openModal = () => setModalOpened(true);
  const closeModal = () => setModalOpened(false);

  const { community, file, updateCommunity } = useCommunity(communityId);

  const handleSubmit = async data => {
    await updateCommunity(data);
  };

  const submitAddMembers = () => {
    closeModal();
  };

  return (
    <Container>
      <PageHeader>
        <AvatarContainer>
          <Avatar avatar={file.fileUrl} backgroundImage={CommunityImage} />
        </AvatarContainer>
        <div>
          <BackLink text={`Return to ${community.displayName}`} />
          <PageTitle>Community Settings</PageTitle>
        </div>
      </PageHeader>
      <div>
        <CommunitySettingsTabs
          tabs={[tabs.EDIT_PROFILE, tabs.MEMBERS]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>
      <ActiveTabContainer>
        <ConditionalRender condition={activeTab === tabs.EDIT_PROFILE}>
          <ActiveTabContent>
            <CommunityForm
              onSubmit={async data => {
                await handleSubmit(data);
              }}
              edit
              community={community}
            />
            <CloseCommunityAction communityId={communityId} onCommunityClosed={onCommunityClosed} />
          </ActiveTabContent>
        </ConditionalRender>

        <ConditionalRender condition={activeTab === tabs.MEMBERS}>
          <ActiveTabContent>
            <CommunityMembers community={community} onMemberClick={onMemberClick} />
            <AddMemberAction action={openModal} />
            <ConditionalRender condition={isModalOpened}>
              <AddMemberModal
                closeConfirm={closeModal}
                community={community}
                onSubmit={submitAddMembers}
              />
            </ConditionalRender>
          </ActiveTabContent>
        </ConditionalRender>
      </ActiveTabContainer>
    </Container>
  );
};

export default customizableComponent('CommunitySettings', CommunitySettings);
