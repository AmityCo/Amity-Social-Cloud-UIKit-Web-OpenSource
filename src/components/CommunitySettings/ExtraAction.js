import React from 'react';

import {
  ExtraActionContainer,
  ExtraActionContainerHeader,
  ExtraActionContainerBody,
  ExtraActionButton,
  ExtraActionPrimaryButton,
  PlusIcon,
  Footer,
} from './styles';

import { communitySettings } from '../../constants/community';

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

export const AddMemberAction = ({ handleClick }) => {
  return (
    <ExtraAction
      title={communitySettings.ADD_MEMBER_TITLE}
      bodyText={communitySettings.ADD_MEMBER_BODY}
      actionButton={<AddMemberButton onClick={handleClick} />}
    />
  );
};

export const CloseCommunityAction = ({ handleClick }) => {
  return (
    <ExtraAction
      title={communitySettings.CLOSE_COMMUNITY_TITLE}
      bodyText={communitySettings.CLOSE_COMMUNITY_BODY}
      actionButton={<CloseCommunityButton onClick={handleClick} />}
    />
  );
};
