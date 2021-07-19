import React from 'react';
import { FormattedMessage } from 'react-intl';

import UserPlusIcon from '~/icons/UserPlus';

import { IconWrapper, ClickableMenuItem, MemberItemInfo } from './styles';

function AddNewMember({ onClick }) {
  return (
    <ClickableMenuItem onClick={onClick}>
      <IconWrapper>
        <UserPlusIcon />
      </IconWrapper>
      <MemberItemInfo>
        <FormattedMessage id="chat.member.addMore" />
      </MemberItemInfo>
    </ClickableMenuItem>
  );
}

export default AddNewMember;
