import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from '~/core/components/Avatar';
import Ban from '~/icons/Ban';
import useObserver from '../../hooks/useObserver';
import useUser from '~/core/hooks/useUser';

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  background-color: ${({ focused, theme }) => focused && theme.palette.base.shade4};
  font-weight: 600;
`;

const StyledBanIcon = styled(Ban)`
  color: ${({ theme }) => theme.palette.base.shade3};
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

  if (isLastItem) {
    return (
      <Item focused={focused} ref={targetRef} isBanned={user.isGlobalBan}>
        <Avatar avatar={file.fileUrl} showOverlay={user.isGlobalBan} />
        <div css="margin-left: 10px;">{user.displayName}</div>
      </Item>
    );
  }

  return (
    <Item focused={focused} isBanned={user.isGlobalBan}>
      <Avatar avatar={file.fileUrl} />
      <div css="margin-left: 10px;">{user.displayName}</div>
      <div css="margin-left: 0.5rem;">{user.isGlobalBan && <StyledBanIcon />}</div>
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
