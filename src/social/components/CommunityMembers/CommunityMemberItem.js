import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { notification } from '~/core/components/Notification';
import OptionMenu from '~/core/components/OptionMenu';
import UserHeader from '~/social/components/UserHeader';
import useUser from '~/core/hooks/useUser';
import { MemberInfo, CommunityMemberContainer } from './styles';

const CommunityMemberItem = ({ userId, onClick }) => {
  const { handleReportUser } = useUser(userId);

  // TODO: react-intl
  const onReportClick = () => {
    handleReportUser();
    notification.success({
      content: <FormattedMessage id="report.reportSent" />,
    });
  };

  return (
    <CommunityMemberContainer>
      <MemberInfo>
        <UserHeader userId={userId} onClick={onClick} />
      </MemberInfo>
      {/* TODO - add in options once SDK methods for actions are confirmed */}
      <OptionMenu
        options={[
          /* { name: 'Remove from community', action: confirmRemoving }, */
          { name: 'Report user', action: onReportClick },
        ]}
      />
    </CommunityMemberContainer>
  );
};

CommunityMemberItem.propTypes = {
  userId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default CommunityMemberItem;
