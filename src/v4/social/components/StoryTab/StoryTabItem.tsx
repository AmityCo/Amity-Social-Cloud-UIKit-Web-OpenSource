import React from 'react';

import { StoryRing } from '~/v4/social/elements/StoryRing';

import { Typography } from '~/v4/core/components';
import Verified from '~/v4/icons/Verified';
import clsx from 'clsx';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import useImage from '~/v4/core/hooks/useImage';

import styles from './StoryTabItem.module.css';

const ErrorIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <circle cx="8" cy="8" r="7.25" fill="#FA4D30" stroke="#fff" strokeWidth="1.5"></circle>
      <path
        fill="#fff"
        d="M9.25 10.75C9.25 11.453 8.687 12 8 12c-.703 0-1.25-.547-1.25-1.25 0-.688.547-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25zM6.89 4.406A.378.378 0 017.267 4h1.453c.219 0 .39.188.375.406l-.203 4.25A.387.387 0 018.516 9H7.469a.387.387 0 01-.375-.344l-.203-4.25z"
      ></path>
    </svg>
  );
};

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="#000"
        fillOpacity=".2"
        d="M8 0c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8z"
      ></path>
      <path
        fill="#000"
        fillOpacity=".2"
        d="M8 2c2.21 0 4 1.79 4 4v1h-1V6c0-1.104-.896-2-2-2s-2 .896-2 2v1H4V6c0-2.21 1.79-4 4-4z"
      ></path>
    </svg>
  );
};

interface StoryTabProps {
  pageId: string;
  componentId: string;
  targetId: string;
  hasUnseen: boolean;
  onClick: () => void;
  size: number;
  isErrored?: boolean;
}

export const StoryTabItem: React.FC<StoryTabProps> = ({
  pageId,
  componentId,
  targetId,
  hasUnseen,
  onClick,
  isErrored,
}) => {
  const { community } = useCommunity({
    communityId: targetId,
  });
  const communityAvatar = useImage({ fileId: community?.avatarFileId, imageSize: 'small' });

  return (
    <div className={clsx(styles.container)} onClick={onClick}>
      <div className={styles.avatarContainer}>
        <StoryRing
          pageId={pageId}
          componentId={componentId}
          hasUnseen={hasUnseen}
          isErrored={isErrored}
        />

        <div className={styles.avatarBackground}>
          {communityAvatar && (
            <img className={styles.avatar} src={communityAvatar} alt={community?.displayName} />
          )}
        </div>
        {isErrored && <ErrorIcon className={styles.errorIcon} />}
        {community?.isOfficial && <Verified className={styles.verifiedIcon} />}
      </div>

      <Typography.Caption className={clsx(styles.displayName)}>
        {!community?.isPublic && <LockIcon />}
        {community?.displayName}
      </Typography.Caption>
    </div>
  );
};
