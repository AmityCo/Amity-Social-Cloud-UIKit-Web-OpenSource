import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ImageSize, FileRepository } from '@amityco/js-sdk';

import ConditionalRender from '~/core/components/ConditionalRender';
import CommunityMembers from '~/social/components/CommunityMembers';
import CommunityForm from '~/social/components/CommunityForm';
import { AddMemberModal } from '~/social/components/AddMemberModal';
import { PageTypes } from '~/social/constants';
import useCommunity from '~/social/hooks/useCommunity';
import useCommunityMembers from '~/social/hooks/useCommunityMembers';
import PageLayout from '~/social/layouts/Page';

import CommunityEditHeader from '~/social/components/community/EditPageHeader';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { CloseCommunityAction, AddMemberAction } from './ExtraAction';
import { PageTabs } from './constants';

const CommunityEditPage = ({ communityId }) => {
  const { onChangePage } = useNavigation();
  const [activeTab, setActiveTab] = useState(PageTabs.EDIT_PROFILE);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

  const openAddMemberModal = () => setAddMemberModalOpen(true);
  const closeAddMemberModal = () => setAddMemberModalOpen(false);

  const { onClickCommunity } = useNavigation();
  const { community, updateCommunity } = useCommunity(communityId);
  const { addMembers } = useCommunityMembers(communityId);

  const handleReturnToCommunity = () => onClickCommunity(communityId);

  const handleEditCommunity = async data => {
    await updateCommunity(data);
    handleReturnToCommunity();
  };

  const submitAddMembers = async ({ members }) => {
    await addMembers(members);
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
            <ConditionalRender condition={addMemberModalOpen}>
              <AddMemberModal
                closeConfirm={closeAddMemberModal}
                community={community}
                onSubmit={submitAddMembers}
              />
            </ConditionalRender>
          </>
        );
      default:
        return null;
    }
  };

  // TODO: this is temporary - we should use file.fileUrl when supported.
  const fileUrl = useMemo(
    () =>
      community.avatarFileId &&
      FileRepository.getFileUrlById({
        fileId: community.avatarFileId,
        imageSize: ImageSize.Medium,
      }),
    [community.avatarFileId],
  );

  return (
    <PageLayout
      aside={renderAsideComponent()}
      header={
        <CommunityEditHeader
          avatarFileUrl={fileUrl}
          communityName={community?.displayName}
          onReturnToCommunity={handleReturnToCommunity}
          tabs={Object.values(PageTabs)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      }
    >
      <ConditionalRender condition={activeTab === PageTabs.EDIT_PROFILE && !!community.communityId}>
        <CommunityForm onSubmit={data => handleEditCommunity(data)} community={community} edit />
      </ConditionalRender>

      <ConditionalRender condition={activeTab === PageTabs.MEMBERS}>
        <CommunityMembers communityId={communityId} />
      </ConditionalRender>
    </PageLayout>
  );
};

CommunityEditPage.propTypes = {
  communityId: PropTypes.string.isRequired,
};

export default CommunityEditPage;
