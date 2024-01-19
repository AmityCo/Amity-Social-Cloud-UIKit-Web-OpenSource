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

// async function onClickLeaveCommunityOk(
//   communityId: string,
//   leaveCommunity: (communityId: string) => void,
// ) {
//   try {
//     await leaveCommunity(communityId);
//   } catch (error) {
//     if (error instanceof Error) {
//       // Member > 0, moderator === 1
//       if (error.code === LAST_MODERATOR_ERROR_CODE) {
//         onlyOneModeratorModal();
//       }
//       // Member === 1, moderator === 1
//       if (error.code === ONLY_ONE_MODERATOR_ERROR_CODE) {
//         lastModeratorModal();
//       }
//     }
//   }
// }

export const leaveCommunityConfirmModal = ({ onOk }: { onOk: () => void }) =>
  confirm({
    'data-qa-anchor': 'leave-community',
    title: <FormattedMessage id="community.leaveCommunityTitle" />,
    content: <FormattedMessage id="community.leaveCommunityBody" />,
    okText: <FormattedMessage id="community.leaveCommunityButtonText" />,
    onOk: () => onOk(),
  });
