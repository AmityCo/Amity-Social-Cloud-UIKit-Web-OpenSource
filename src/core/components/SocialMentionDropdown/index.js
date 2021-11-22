import PropTypes from 'prop-types';
import React from 'react';
import { SocialMentionDropdownContainer, SocialMentionDropdownItem, Avatar, Name } from './styles';

function SocialMentionDropdown({ items = [] }) {
  return (
    <SocialMentionDropdownContainer>
      {items.map(({ avatar, name }) => (
        <SocialMentionDropdownItem key={name}>
          <Avatar src={avatar} />
          <Name>{name}</Name>
        </SocialMentionDropdownItem>
      ))}
    </SocialMentionDropdownContainer>
  );
}

SocialMentionDropdown.propTypes = {
  items: PropTypes.array(),
};

export default SocialMentionDropdown;
