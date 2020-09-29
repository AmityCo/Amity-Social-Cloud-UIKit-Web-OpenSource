import React from 'react';

import { confirm } from '~/core/components/Confirm';
import { useCommunitiesMock } from '~/mock';
import {
  ExtraActionContainer,
  ExtraActionContainerHeader,
  ExtraActionContainerBody,
  ExtraActionButton,
  ExtraActionPrimaryButton,
  PlusIcon,
  Footer,
} from './styles';

import { communitySettings } from '~/constants/community';

const ExtraAction = ({ title, bodyText, actionButton }) => {
  return (
    <ExtraActionContainer>
      <ExtraActionContainerHeader>{title}</ExtraActionContainerHeader>
      <ExtraActionContainerBody>
        <div>{bodyText}</div>
        <Footer>{actionButton}</Footer>
      </ExtraActionContainerBody>
    </ExtraActionContainer>
  );
};

const AddMemberButton = ({ onClick }) => {
  return (
    <ExtraActionPrimaryButton onClick={onClick}>
      <PlusIcon />
      {communitySettings.ADD_MEMBER_BUTTON_TEXT}
    </ExtraActionPrimaryButton>
  );
};

const CloseCommunityButton = ({ onClick }) => {
  return (
    <ExtraActionButton onClick={onClick}>
      {communitySettings.CLOSE_COMMUNITY_BUTTON_TEXT}
    </ExtraActionButton>
  );
};

export const AddMemberAction = ({ action }) => {
  return (
    <ExtraAction
      title={communitySettings.ADD_MEMBER_TITLE}
      bodyText={communitySettings.ADD_MEMBER_BODY}
      actionButton={<AddMemberButton onClick={action} />}
    />
  );
};

export const CloseCommunityAction = () => {
  const { removeCommunity } = useCommunitiesMock();
  const closeConfirm = () =>
    confirm({
      title: communitySettings.CLOSE_COMMUNITY_CONFIRM_TITLE,
      content: communitySettings.CLOSE_COMMUNITY_CONFIRM_TEXT,
      cancelText: 'Cancel',
      okText: 'Remove',
      onOk: removeCommunity,
    });

  return (
    <ExtraAction
      title={communitySettings.CLOSE_COMMUNITY_TITLE}
      bodyText={communitySettings.CLOSE_COMMUNITY_BODY}
      actionButton={<CloseCommunityButton onClick={closeConfirm} />}
    />
  );
};
