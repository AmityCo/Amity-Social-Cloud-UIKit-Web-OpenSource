import React from 'react';
import { SocialMentionDropdownContainer, SocialMentionDropdownItem, Avatar, Name } from './styles';

interface SocialMentionDropdownProps {
  items: { avatar: string; name: string }[];
}

const SocialMentionDropdown = ({ items = [] }: SocialMentionDropdownProps) => {
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
};

export default SocialMentionDropdown;
