import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { EkoImageSize, FileRepository } from 'eko-sdk';

import ConditionalRender from '~/core/components/ConditionalRender';
import CommunityMembers from '~/social/components/CommunityMembers';
import CommunityForm from '~/social/components/CommunityForm';
import { AddMemberModal } from '~/social/components/AddMemberModal';
import useCommunity from '~/social/hooks/useCommunity';
import PageLayout from '~/social/layouts/Page';

import CommunityEditHeader from '~/social/components/community/EditPageHeader';
import { CloseCommunityAction, AddMemberAction } from './ExtraAction';
import { PageTabs } from './constants';

const CommunityEditPage = ({
  communityId,
  onReturnToCommunity,
  onClickUser,
  onCommunityClosed,
}) => {
  const [activeTab, setActiveTab] = useState(PageTabs.EDIT_PROFILE);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

  const openAddMemberModal = () => setAddMemberModalOpen(true);
  const closeAddMemberModal = () => setAddMemberModalOpen(false);

  const { community, updateCommunity } = useCommunity(communityId);

  const handleReturnToCommunity = () => onReturnToCommunity(communityId);

  const handleEditCommunity = async data => {
    await updateCommunity(data);
    handleReturnToCommunity();
  };

  // TODO - use communityRepository.addMembers when add members is supported by moderation.
  const submitAddMembers = () => {
    closeAddMemberModal();
  };

  // TODO - remove this once adding members is supported.
  const canAddMembers = false;

  const renderAsideComponent = () => {
    switch (activeTab) {
      case PageTabs.EDIT_PROFILE:
        return (
          <CloseCommunityAction communityId={communityId} onCommunityClosed={onCommunityClosed} />
        );
      case PageTabs.MEMBERS:
        return (
          <>
            {canAddMembers && <AddMemberAction action={openAddMemberModal} />}
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
        imageSize: EkoImageSize.Medium,
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
        <CommunityMembers communityId={communityId} onClickUser={onClickUser} />
      </ConditionalRender>
    </PageLayout>
  );
};

CommunityEditPage.propTypes = {
  communityId: PropTypes.string.isRequired,
  onReturnToCommunity: PropTypes.func,
  onClickUser: PropTypes.func,
  onCommunityClosed: PropTypes.func,
};

CommunityEditPage.defaultProps = {
  onReturnToCommunity: () => {},
  onClickUser: () => {},
  onCommunityClosed: () => {},
};

export default CommunityEditPage;
