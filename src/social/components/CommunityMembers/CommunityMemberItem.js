import React from 'react';
import { notification } from '~/core/components/Notification';
import Options from '~/core/components/Options';
import UserHeader from '~/social/components/UserHeader';
import useUser from '~/core/hooks/useUser';
import { MemberInfo, CommunityMemberContainer } from './styles';

const CommunityMemberItem = ({ userId, onMemberClick }) => {
  const { handleReportUser } = useUser(userId);

  // TODO: react-intl
  const onReportClick = () => {
    handleReportUser();
    notification.success({
      content: 'Report Sent',
    });
  };

  return (
    <CommunityMemberContainer>
      <MemberInfo>
        <UserHeader userId={userId} onClick={onMemberClick} />
      </MemberInfo>
      {/* TODO - add in options once SDK methods for actions are confirmed */}
      <Options
        options={[
          /* { name: 'Remove from community', action: confirmRemoving }, */
          { name: 'Report user', action: onReportClick },
        ]}
      />
    </CommunityMemberContainer>
  );
};

export default CommunityMemberItem;
