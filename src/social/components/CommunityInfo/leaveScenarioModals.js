import React from 'react';
import { FormattedMessage } from 'react-intl';
import { info, confirm } from '~/core/components/Confirm';

const LAST_MODERATOR_ERROR_CODE = 400317;
const ONLY_ONE_MODERATOR_ERROR_CODE = 400318;

const lastModeratorModal = () =>
  info({
    title: <FormattedMessage id="community.leaveCommunityTitle" />,
    content: <FormattedMessage id="community.leaveCommunityBodyLastMember" />,
    okText: <FormattedMessage id="community.leaveCommunityButtonOK" />,
  });

const onlyOneModeratorModal = () =>
  info({
    title: <FormattedMessage id="community.leaveCommunityTitle" />,
    content: <FormattedMessage id="community.leaveCommunityBodyOnlyModerator" />,
    okText: <FormattedMessage id="community.leaveCommunityButtonOK" />,
  });

async function onClickLeaveCommunityOk(communityId, leaveCommunity) {
  try {
    await leaveCommunity(communityId);
  } catch (error) {
    // Member > 0, moderator === 1
    if (error.code === LAST_MODERATOR_ERROR_CODE) {
      onlyOneModeratorModal();
    }
    // Member === 1, moderator === 1
    if (error.code === ONLY_ONE_MODERATOR_ERROR_CODE) {
      lastModeratorModal();
    }
  }
}

export const leaveCommunityConfirmModal = (communityId, leaveCommunityFunc) =>
  confirm({
    title: <FormattedMessage id="community.leaveCommunityTitle" />,
    content: <FormattedMessage id="community.leaveCommunityBody" />,
    okText: <FormattedMessage id="community.leaveCommunityButtonText" />,
    onOk: () => onClickLeaveCommunityOk(communityId, leaveCommunityFunc),
  });
