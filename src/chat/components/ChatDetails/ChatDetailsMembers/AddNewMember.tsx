import React from 'react';
import { FormattedMessage } from 'react-intl';

import UserPlusIcon from '~/icons/UserPlus';

import styles from './styles.module.css';

interface AddNewMemberProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const AddNewMember = ({ onClick }: AddNewMemberProps) => {
  return (
    <div className={styles.clickableMenuItem} onClick={onClick}>
      <span className={styles.iconWrapper}>
        <UserPlusIcon />
      </span>
      <span className={styles.memberItemInfo}>
        <FormattedMessage id="chat.member.addMore" />
      </span>
    </div>
  );
};

export default AddNewMember;
