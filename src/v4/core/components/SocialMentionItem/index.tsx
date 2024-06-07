import React, { useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import UserAvatar from '~/v4/chat/components/UserAvatar';
import { backgroundImage as userBackgroundImage } from '~/icons/User';
import BanIcon from '~/icons/Ban';
import useObserver from '~/core/hooks/useObserver';
import useUser from '~/core/hooks/useUser';
import useImage from '~/core/hooks/useImage';
import styles from './styles.module.css';
import { MentionIcon } from '~/icons';
import { SIZE_ALIAS } from '~/core/hooks/useSize';
import { FormattedMessage } from 'react-intl';
import { Typography } from '../index';

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
  entry: IntersectionObserverEntry | null;
  onMouseEnter: (e: React.MouseEvent, isBanned: boolean | undefined) => void;
  focused: boolean;
  isLastItem: boolean;
  loadMore?: () => void;
  targetRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const UserMentionItem = ({
  id,
  entry,
  onMouseEnter,
  focused,
  isLastItem,
  loadMore,
  targetRef,
  containerRef,
}: UserMentionItemProps) => {
  const user = useUser(id);
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });

  useEffect(() => {
    if (targetRef && entry?.isIntersecting) {
      loadMore?.();
    }
  }, [targetRef, entry?.isIntersecting, loadMore]);

  return (
    <div
      ref={isLastItem ? targetRef : null}
      data-qa-anchor="social-mention-item"
      className={clsx(styles.mentionItem, user?.isGlobalBanned && 'isBanned')}
      onMouseEnter={(e) => onMouseEnter(e, user?.isGlobalBanned)}
    >
      <UserAvatar
        size={SIZE_ALIAS.SMALL}
        avatarUrl={avatarFileUrl}
        defaultImage={userBackgroundImage}
      />
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
  return (
    <div
      ref={isLastItem ? targetRef : null}
      data-qa-anchor="custom-mention-item"
      className={clsx(styles.mentionItem, styles.mentionAll)}
      onMouseEnter={(e) => onMouseEnter(e, false)}
    >
      <div>
        <MentionIcon width={32} height={32} />
        <div className={styles.userDisplayName}>
          <Typography.Body>
            <FormattedMessage id="livechat.mention.all" />
          </Typography.Body>
        </div>
      </div>
      <div className={styles.mentionAllDescription}>
        <Typography.Caption>
          <FormattedMessage id="livechat.mention.all.description" />
        </Typography.Caption>
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
  const entry = useObserver(targetRef?.current, {
    root: rootEl?.current?.childNodes[0] as Element,
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
      entry={entry}
      onMouseEnter={onMouseEnter}
      focused={focused}
      isLastItem={isLastItem}
      loadMore={loadMore}
      targetRef={targetRef}
      containerRef={containerRef}
    />
  );
};

export default SocialMentionItem;
