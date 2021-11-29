import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Avatar from '~/core/components/Avatar';
import useObserver from '~/core/hooks/useObserver';
import useUser from '~/core/hooks/useUser';
import Ban from '~/icons/Ban';

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

const SocialMentionItem = ({
  id,
  avatar,
  display,
  focused,
  isLastItem,
  loadMore = () => {},
  rootEl,
}) => {
  const targetRef = useRef();
  const { user } = useUser(id);
  const entry = useObserver(targetRef?.current, { root: rootEl?.current?.childNodes[0] });

  useEffect(() => {
    if (targetRef && entry?.isIntersecting) {
      loadMore();
    }
  }, [targetRef, entry.isIntersecting]);

  if (isLastItem) {
    return (
      <Item focused={focused} ref={targetRef}>
        <Avatar avatar={avatar} showOverlay={user.isGlobalBan} />
        <div css="margin-left: 10px;">{display}</div>
      </Item>
    );
  }

  return (
    <Item focused={focused} isBanned={user.isGlobalBan}>
      <Avatar avatar={user.avatarUrl} />
      <div css="margin-left: 0.5rem;">{display}</div>
      <div css="margin-left: 0.5rem;">{user.isGlobalBan && <StyledBanIcon />}</div>
    </Item>
  );
};

SocialMentionItem.propTypes = {
  id: PropTypes.string,
  avatar: PropTypes.string,
  display: PropTypes.string,
  focused: PropTypes.bool.isRequired,
  isLastItem: PropTypes.bool.isRequired,
  loadMore: PropTypes.func,
  rootEl: PropTypes.element.isRequired,
};

export default SocialMentionItem;
