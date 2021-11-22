import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Avatar from '~/core/components/Avatar';
import useObserver from '../../hooks/useObserver';

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  background-color: ${({ focused, theme }) => focused && theme.palette.base.shade4};
  font-weight: 600;
`;

const SocialMentionItem = ({
  avatar,
  display,
  focused,
  isLastItem,
  loadMore = () => {},
  rootEl,
}) => {
  const targetRef = useRef();
  const entry = useObserver(targetRef?.current, { root: rootEl?.current?.childNodes[0] });

  useEffect(() => {
    if (targetRef && entry?.isIntersecting) {
      loadMore();
    }
  }, [targetRef, entry.isIntersecting]);

  if (isLastItem) {
    return (
      <Item focused={focused} ref={targetRef}>
        <Avatar avatar={avatar} />
        <div css="margin-left: 10px;">{display}</div>
      </Item>
    );
  }

  return (
    <Item focused={focused}>
      <Avatar avatar={avatar} />
      <div css="margin-left: 10px;">{display}</div>
    </Item>
  );
};

SocialMentionItem.propTypes = {
  avatar: PropTypes.string,
  display: PropTypes.string,
  focused: PropTypes.bool.isRequired,
  isLastItem: PropTypes.bool.isRequired,
  loadMore: PropTypes.func,
  rootEl: PropTypes.element.isRequired,
};

export default SocialMentionItem;
