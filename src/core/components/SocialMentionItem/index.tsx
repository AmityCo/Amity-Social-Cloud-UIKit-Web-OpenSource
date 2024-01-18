import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Avatar from '~/core/components/Avatar';
import BanIcon from '~/icons/Ban';
import useObserver from '../../hooks/useObserver';
import useUser from '~/core/hooks/useUser';
import useImage from '~/core/hooks/useImage';

const Item = styled.div<{ focused?: boolean; isBanned?: boolean; maxWidth?: number }>`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  background-color: ${({ focused, theme }) => focused && theme.palette.base.shade4};
  font-weight: 600;
  color: ${({ isBanned, theme }) => isBanned && theme.palette.base.shade2};
  pointer-events: ${({ isBanned }) => isBanned && 'none'} !important;
  cursor: ${({ isBanned }) => isBanned && 'no-allowed'} !important;
  max-width: ${({ maxWidth }) => maxWidth || 0}px;
`;

const UserDisplayName = styled.div`
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface SocialMentionItemProps {
  id: string;
  focused: boolean;
  isLastItem: boolean;
  loadMore?: () => void;
  rootEl: React.MutableRefObject<HTMLDivElement | null>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

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
  const user = useUser(id);
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });

  useEffect(() => {
    if (targetRef && entry?.isIntersecting) {
      loadMore?.();
    }
  }, [targetRef, entry?.isIntersecting, loadMore]);

  // Slow performance, need more pristine approach
  const onMouseEnter = useCallback((e, isBanned) => {
    if (isBanned) {
      e.target.parentNode.style.cursor = 'not-allowed';
      e.target.parentNode.style['pointer-events'] = 'none';
    }
  }, []);

  return (
    <Item
      ref={isLastItem ? targetRef : null}
      data-qa-anchor="social-mention-item"
      focused={focused}
      isBanned={user?.isGlobalBanned}
      maxWidth={containerRef?.current?.clientWidth}
      onMouseEnter={(e) => onMouseEnter(e, user?.isGlobalBanned)}
    >
      <Avatar avatar={avatarFileUrl} />
      <UserDisplayName>{user?.displayName}</UserDisplayName>
      <div style={{ marginLeft: '0.5rem' }}>{user?.isGlobalBanned ? <BanIcon /> : null}</div>
    </Item>
  );
};

export default SocialMentionItem;
