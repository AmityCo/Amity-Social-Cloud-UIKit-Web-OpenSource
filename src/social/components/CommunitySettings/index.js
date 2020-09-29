import React, { useState } from 'react';

import { ConditionalRender } from '~/core/components/ConditionalRender';
import CommunityMembers from '~/social/components/Community/CommunityMembers';
import CommunityForm from '~/social/components/CommunityForm';
import { BackLink } from '~/core/components/BackLink';
import { AddMemberModal } from '~/social/components/AddMemberModal';
import { customizableComponent } from '~/core/hocs/customization';
import { getCommunity } from '~/mock/index';
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

const CommunitySettings = ({ communityId, onSubmit, onMemberClick }) => {
  const [activeTab, setActiveTab] = useState(tabs.EDIT_PROFILE);
  const [isModalOpened, setModalOpened] = useState(false);

  const openModal = () => setModalOpened(true);
  const closeModal = () => setModalOpened(false);

  const currentCommunity = getCommunity(communityId);

  const submitAddMembers = () => {
    closeModal();
  };

  return (
    <Container>
      <PageHeader>
        <AvatarContainer>
          <Avatar avatar={currentCommunity.avatar} />
        </AvatarContainer>
        <div>
          <BackLink text={`Return to ${currentCommunity.name}`} />
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
              onSubmit={data => {
                onSubmit(data);
              }}
              edit
              community={currentCommunity}
            />
            <CloseCommunityAction />
          </ActiveTabContent>
        </ConditionalRender>

        <ConditionalRender condition={activeTab === tabs.MEMBERS}>
          <ActiveTabContent>
            <CommunityMembers community={currentCommunity} onMemberClick={onMemberClick} />
            <AddMemberAction action={openModal} />
            <ConditionalRender condition={isModalOpened}>
              <AddMemberModal
                closeConfirm={closeModal}
                community={currentCommunity}
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
