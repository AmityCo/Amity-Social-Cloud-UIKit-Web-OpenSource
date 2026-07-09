import React, { useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import BanIcon from '~/v4/icons/Banned';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import useUser from '~/v4/core/hooks/objects/useUser';
import useImage from '~/v4/core/hooks/useImage';
import styles from './styles.module.css';
import { MentionIcon } from '~/v4/icons';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { Avatar } from '~/v4/core/components/Avatar';
import User from '~/v4/icons/User';

interface SocialMentionItemProps {
  id: string;
  focused: boolean;
  isLastItem: boolean;
  loadMore?: () => void;
  rootEl: React.MutableRefObject<HTMLDivElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

interface UserMentionItemProps {
  id: string;
  onMouseEnter: (e: React.MouseEvent, isBanned: boolean | undefined) => void;
  focused: boolean;
  isLastItem: boolean;
  targetRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const UserMentionItem = ({
  id,
  onMouseEnter,
  focused,
  isLastItem,
  targetRef,
  containerRef,
}: UserMentionItemProps) => {
  const user = useUser(id);
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });

  return (
    <div
      ref={isLastItem ? targetRef : null}
      data-testid="social-mention-item"
      className={clsx(styles.mentionItem, user?.isGlobalBanned && 'isBanned')}
      onMouseEnter={(e) => onMouseEnter(e, user?.isGlobalBanned)}
    >
      <div className={styles.avatar}>
        <Avatar avatarUrl={avatarFileUrl} defaultImage={<User />} />
      </div>
      <div className={styles.userDisplayName}>
        <Typography.Body>{user?.displayName}</Typography.Body>
      </div>
      <div style={{ marginLeft: '0.5rem' }}>{user?.isGlobalBanned ? <BanIcon /> : null}</div>
    </div>
  );
};

const CustomMentionItem = ({
  id,
  onMouseEnter,
  focused,
  isLastItem,
  targetRef,
  containerRef,
}: Omit<UserMentionItemProps, 'entry' | 'loadMore'>) => {
  const mentionAllText = useString('amity_common_button_all');
  const mentionAllDescription = useString('amity_common_button_all_description');
  return (
    <div
      ref={isLastItem ? targetRef : null}
      data-testid="custom-mention-item"
      className={clsx(styles.mentionItem, styles.mentionAll)}
      onMouseEnter={(e) => onMouseEnter(e, false)}
    >
      <div>
        <MentionIcon width={32} height={32} />
        <div className={styles.userDisplayName}>
          <Typography.Body>{mentionAllText}</Typography.Body>
        </div>
      </div>
      <div className={styles.mentionAllDescription}>
        <Typography.Caption>{mentionAllDescription}</Typography.Caption>
      </div>
    </div>
  );
};

const SocialMentionItem = ({
  id,
  focused,
  isLastItem,
  loadMore,
  rootEl,
  containerRef,
}: SocialMentionItemProps) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(() => {
    if (isLastItem) {
      loadMore?.();
    }
  }, [isLastItem, loadMore]);

  useIntersectionObserver({
    node: targetRef.current,
    onIntersect: handleIntersect,
    options: { root: rootEl?.current?.childNodes[0] as Element },
  });

  // Slow performance, need more pristine approach
  const onMouseEnter = useCallback((e, isBanned) => {
    if (isBanned) {
      e.target.parentNode.style.cursor = 'not-allowed';
      e.target.parentNode.style['pointer-events'] = 'none';
    }
  }, []);

  if (id === '@all') {
    return (
      <CustomMentionItem
        id={id}
        onMouseEnter={onMouseEnter}
        focused={focused}
        isLastItem={isLastItem}
        targetRef={targetRef}
        containerRef={containerRef}
      />
    );
  }

  return (
    <UserMentionItem
      id={id}
      onMouseEnter={onMouseEnter}
      focused={focused}
      isLastItem={isLastItem}
      targetRef={targetRef}
      containerRef={containerRef}
    />
  );
};

export default SocialMentionItem;
