import React, { useEffect, useMemo, useState } from 'react';
import { CommunityRepository, FileRepository } from '@amityco/ts-sdk';

import CommunityMembers from '~/social/components/CommunityMembers';
import CommunityPermissions from '~/social/components/CommunityPermissions';
import CommunityForm from '~/social/components/CommunityForm';
import { AddMemberModal } from '~/social/components/AddMemberModal';
import { PageTypes } from '~/social/constants';
import useCommunity from '~/social/hooks/useCommunity';
import PageLayout from '~/social/layouts/Page';

import CommunityEditHeader from '~/social/components/community/EditPageHeader';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { CloseCommunityAction, AddMemberAction } from './ExtraAction';
import { PageTabs, tabs } from './constants';
import useImage from '~/core/hooks/useImage';

type CommunityEditPageProps = {
  communityId?: string;
  tab?: string;
};

const CommunityEditPage = ({
  communityId,
  tab = PageTabs.EDIT_PROFILE,
}: CommunityEditPageProps) => {
  const { onChangePage } = useNavigation();
  const [activeTab, setActiveTab] = useState(tab);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

  const openAddMemberModal = () => setAddMemberModalOpen(true);
  const closeAddMemberModal = () => setAddMemberModalOpen(false);

  useEffect(() => setActiveTab(tab), [tab]);

  const { onBack } = useNavigation();
  const community = useCommunity(communityId);
  const avatarFileUrl = useImage({ fileId: community?.avatarFileId, imageSize: 'medium' });

  const handleReturnToCommunity = () => communityId && onBack();

  const handleEditCommunity = async (
    data: Parameters<typeof CommunityRepository.updateCommunity>[1],
  ) => {
    if (communityId == null) return;
    await CommunityRepository.updateCommunity(communityId, data);
    handleReturnToCommunity();
  };

  const submitAddMembers = async (
    userIds: Parameters<typeof CommunityRepository.Membership.addMembers>[1],
  ) => {
    if (communityId == null) return;
    await CommunityRepository.Membership.addMembers(communityId, userIds);
    closeAddMemberModal();
  };

  const renderAsideComponent = () => {
    switch (activeTab) {
      case PageTabs.EDIT_PROFILE:
        return (
          <CloseCommunityAction
            communityId={communityId}
            onCommunityClosed={() => onChangePage(PageTypes.NewsFeed)}
          />
        );
      case PageTabs.MEMBERS:
        return (
          <>
            <AddMemberAction action={openAddMemberModal} />

            {addMemberModalOpen && (
              <AddMemberModal closeConfirm={closeAddMemberModal} onSubmit={submitAddMembers} />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout
      aside={renderAsideComponent()}
      header={
        <CommunityEditHeader
          avatarFileUrl={avatarFileUrl}
          communityName={community?.displayName}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(newTab) => setActiveTab(newTab)}
          onReturnToCommunity={handleReturnToCommunity}
        />
      }
    >
      {activeTab === PageTabs.EDIT_PROFILE && !!community?.communityId && (
        <CommunityForm
          data-qa-anchor="community-edit"
          community={community}
          edit
          onSubmit={(data) =>
            handleEditCommunity({ ...data, avatarFileId: data.avatarFileId || undefined })
          }
        />
      )}

      {activeTab === PageTabs.MEMBERS && <CommunityMembers communityId={communityId} />}

      {activeTab === PageTabs.PERMISSIONS && <CommunityPermissions communityId={communityId} />}
    </PageLayout>
  );
};

export default CommunityEditPage;
