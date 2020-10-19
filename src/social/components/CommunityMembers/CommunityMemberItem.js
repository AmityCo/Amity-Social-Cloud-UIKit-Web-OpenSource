import React from 'react';
import { notification } from '~/core/components/Notification';
import { confirm } from '~/core/components/Confirm';
// import Options from '~/core/components/Options';
import UserHeader from '~/social/components/UserHeader';
import { MemberInfo, CommunityMemberContainer } from './styles';

const CommunityMemberItem = ({ userId, onMemberClick }) => {
  // TODO: find out which SDK methods 'remove user' and 'report user' refer to.
  const confirmRemoving = () =>
    confirm({
      // TODO: react-intl
      title: 'Remove user from community',
      content:
        'This user won’t no longer be able to search, post and interact in this community. Are you sure you want to continue?',
      okText: 'Remove',
      onOk: () => {},
    });

  // TODO: react-intl
  const onReportClick = () =>
    notification.success({
      content: 'Report Sent',
    });

  return (
    <CommunityMemberContainer>
      <MemberInfo>
        <UserHeader userId={userId} onClick={onMemberClick} />
      </MemberInfo>
      {/* TODO - add in options once SDK methods for actions are confirmed */}
      {/* <Options
        options={[
          { name: 'Remove from community', action: confirmRemoving },
          { name: 'Report user', action: onReportClick },
        ]}
      /> */}
    </CommunityMemberContainer>
  );
};

export default CommunityMemberItem;
