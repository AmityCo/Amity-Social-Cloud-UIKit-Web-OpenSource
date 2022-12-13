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
  }, [targetRef, entry.isIntersecting, loadMore]);

  // Slow performance, need more pristine approach
  const onMouseEnter = useCallback((e, isBanned) => {
    if (isBanned) {
      e.target.parentNode.style.cursor = 'not-allowed';
      e.target.parentNode.style['pointer-events'] = 'none';
    }
  }, []);

  if (isLastItem) {
    return (
      <Item
        ref={targetRef}
        data-qa-anchor="social-mention-item"
        focused={focused}
        isBanned={user.isGlobalBan}
        onMouseEnter={(e) => onMouseEnter(e, user.isGlobalBan)}
      >
        <Avatar
          size="small"
          displayName={user.displayName}
          avatar={file.fileUrl}
          showOverlay={user.isGlobalBan}
        />
        <div style={{ marginLeft: '0.5em' }}>{user.displayName}</div>
      </Item>
    );
  }

  return (
    <Item
      data-qa-anchor="social-mention-item"
      focused={focused}
      isBanned={user.isGlobalBan}
      onMouseEnter={(e) => onMouseEnter(e, user.isGlobalBan)}
    >
      <Avatar size="small" displayName={user.displayName} avatar={file.fileUrl} />{' '}
      <div style={{ marginLeft: '0.5em' }}>{user.displayName}</div>
      <div style={{ marginLeft: '0.5em' }}>{user.isGlobalBan && <BanIcon />}</div>
    </Item>
  );
};

SocialMentionItem.propTypes = {
  id: PropTypes.string, // userId
  focused: PropTypes.bool,
  isLastItem: PropTypes.bool.isRequired,
  loadMore: PropTypes.func,
  rootEl: PropTypes.element,
};

export default SocialMentionItem;
