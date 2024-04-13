import React from 'react';
import { FormattedMessage } from 'react-intl';
import Sheet from 'react-modal-sheet';
import { Typography } from '~/v4/core/components';
import Spinner from '~/social/components/Spinner';
import HomeIndicator from '~/v4/chat/components/HomeIndicator';
import styles from './styles.module.css';
import clsx from 'clsx';

const ChatLoadingState = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <Sheet.Content>{children}</Sheet.Content>
      <div className={styles.composeBarContainer}>
        <div className={styles.composeBar}>
          <div className={styles.textInputContainer}>
            <div className={styles.composeBarLoading}>
              <Spinner width={20} height={20} />
              <span>
                <Typography.Body>
                  <FormattedMessage id="loading.chat" />
                </Typography.Body>
              </span>
            </div>
          </div>
        </div>
        <HomeIndicator />
      </div>
    </>
  );
};

export default ChatLoadingState;
