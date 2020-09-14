import React, { useState, useEffect } from 'react';

import { customizableComponent } from 'hocs/customization';
import { getCommunities } from 'mock';
import Popover from 'components/Popover';
import { MenuItem } from 'components/Menu';

import {
  Avatar,
  CommunitiesSearchContainer,
  CommunitiesSearchInput,
  SearchIcon,
  CommunitiesSearchResults,
  Text,
  HighlightedText,
} from './styles';

// from https://stackoverflow.com/questions/29652862/highlight-text-using-reactjs
const Highlight = ({ query, text }) => {
  const chunks = text.split(new RegExp(`(${query})`, 'gi'));
  return chunks.map(chunk => {
    if (chunk.toLowerCase() === query.toLowerCase())
      return <HighlightedText key={chunk}>{chunk}</HighlightedText>;
    return <Text key={chunk}>{chunk}</Text>;
  });
};

const CommunitySearch = ({ onSearchResultCommunityClick }) => {
  const [query, setQuery] = useState('');

  const [isOpen, setIsOpen] = useState(true);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  // open if query not empty
  useEffect(() => {
    query.length && open();
  }, [query]);

  const communities = getCommunities();

  const searchResult = communities.filter(({ name }) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );

  const menu = (
    <CommunitiesSearchResults>
      {/* TODO empty state */}
      {searchResult.map(community => (
        <MenuItem
          key={community.communityId}
          onClick={() => onSearchResultCommunityClick(community)}
        >
          <Avatar size="tiny" avatar={community.avatar} />
          <Highlight text={community.name} query={query} />
        </MenuItem>
      ))}
    </CommunitiesSearchResults>
  );

  const isPopoverOpen = isOpen && query.length && searchResult.length;

  return (
    <Popover
      isOpen={isPopoverOpen}
      onClickOutside={close}
      position="bottom"
      align="start"
      content={menu}
    >
      <CommunitiesSearchContainer>
        <CommunitiesSearchInput
          value={query}
          onChange={e => setQuery(e.target.value)}
          type="text"
          placeholder="Search communities..."
        />
        <SearchIcon />
      </CommunitiesSearchContainer>
    </Popover>
  );
};

export default customizableComponent('CommunitySearch', CommunitySearch);
