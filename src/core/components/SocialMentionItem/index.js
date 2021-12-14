import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from '~/core/components/Avatar';
import BanIcon from '~/icons/Ban';
import useObserver from '../../hooks/useObserver';
import useUser from '~/core/hooks/useUser';

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  background-color: ${({ focused, theme }) => focused && theme.palette.base.shade4};
  font-weight: 600;
  color: ${({ isBanned, theme }) => isBanned && theme.palette.base.shade2};
  pointer-events: ${({ isBanned }) => isBanned && 'none'} !important;
  cursor: ${({ isBanned }) => isBanned && 'no-allowed'} !important;
`;

const SocialMentionItem = ({ id, focused, isLastItem, loadMore = () => {}, rootEl }) => {
  const targetRef = useRef();
  const entry = useObserver(targetRef?.current, { root: rootEl?.current?.childNodes[0] });
  const { user, file } = useUser(id);

  useEffect(() => {
    if (targetRef && entry?.isIntersecting) {
      loadMore();
    }
  }, [targetRef, entry.isIntersecting]);

  // Slow performance, need more pristine approach
  const onMouseEnter = useCallback((e, isBanned) => {
    if (isBanned) {
      e.target.parentNode.style.cursor = 'not-allowed';
      e.target.parentNode.style['pointer-events'] = 'none';
    }
  });

  if (isLastItem) {
    return (
      <Item
        focused={focused}
        ref={targetRef}
        isBanned={user.isGlobalBan}
        onMouseEnter={e => onMouseEnter(e, user.isGlobalBan)}
      >
        <Avatar avatar={file.fileUrl} showOverlay={user.isGlobalBan} />
        <div css="margin-left: 10px;">{user.displayName}</div>
      </Item>
    );
  }

  return (
    <Item
      focused={focused}
      isBanned={user.isGlobalBan}
      onMouseEnter={e => onMouseEnter(e, user.isGlobalBan)}
    >
      <Avatar avatar={file.fileUrl} />
      <div css="margin-left: 10px;">{user.displayName}</div>
      <div css="margin-left: 0.5rem;">{user.isGlobalBan && <BanIcon />}</div>
    </Item>
  );
};

SocialMentionItem.propTypes = {
  id: PropTypes.string, // userId
  focused: PropTypes.bool.isRequired,
  isLastItem: PropTypes.bool.isRequired,
  loadMore: PropTypes.func,
  rootEl: PropTypes.element.isRequired,
};

export default SocialMentionItem;
