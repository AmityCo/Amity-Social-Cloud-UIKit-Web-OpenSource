import React, { useState, useEffect } from 'react';

import Popover from '~/core/components/Popover';
import { MenuItem } from '~/core/components/Menu';
import customizableComponent from '~/core/hocs/customization';
import { getCommunities } from '~/mock';
import ConditionalRender from '~/core/components/ConditionalRender';
import { backgroundImage as CommunityImage } from '~/icons/Community';

import {
  Avatar,
  CommunitiesSearchContainer,
  CommunitiesSearchInput,
  SearchIcon,
  CommunitiesSearchResults,
  Text,
  HighlightedText,
  TruncatedText,
} from './styles';

import { Placeholder } from '~/core/components/Menu/styles';

// from https://stackoverflow.com/questions/29652862/highlight-text-using-reactjs
const Highlight = ({ query, text }) => {
  const chunks = text.split(new RegExp(`(${query})`, 'gi'));
  return chunks.map(chunk => {
    if (chunk.toLowerCase() === query.toLowerCase())
      return <HighlightedText key={chunk}>{chunk}</HighlightedText>;
    return <Text key={chunk}>{chunk}</Text>;
  });
};

const CommunitySearch = ({ onSearchResultCommunityClick, className, placeholder }) => {
  const [query, setQuery] = useState('');

  const [isOpen, setIsOpen] = useState(true);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  // open if query not empty
  useEffect(() => {
    query.length && open();
  }, [query]);

  const communities = getCommunities();

  const searchResult = communities.filter(({ name, isPrivate }) => {
    return name.toLowerCase().includes(query.toLowerCase()) && !isPrivate;
  });

  const handleSearchResultClick = community => {
    onSearchResultCommunityClick(community);
    setQuery('');
    close();
  };

  const menu = (
    <CommunitiesSearchResults className={className}>
      <ConditionalRender condition={searchResult.length}>
        {searchResult.map(community => (
          <MenuItem key={community.communityId} onClick={() => handleSearchResultClick(community)}>
            <Avatar size="tiny" avatar={community.avatar} backgroundImage={CommunityImage} />
            <TruncatedText>
              <Highlight text={community.displayName} query={query} />
            </TruncatedText>
          </MenuItem>
        ))}
        <MenuItem>
          <Placeholder>No community found</Placeholder>
        </MenuItem>
      </ConditionalRender>
    </CommunitiesSearchResults>
  );

  const isPopoverOpen = isOpen && query.length;

  return (
    <Popover
      isOpen={isPopoverOpen}
      onClickOutside={close}
      position="bottom"
      align="start"
      content={menu}
    >
      <CommunitiesSearchContainer className={className}>
        <CommunitiesSearchInput
          value={query}
          onChange={e => setQuery(e.target.value)}
          type="text"
          placeholder={placeholder}
        />
        <SearchIcon />
      </CommunitiesSearchContainer>
    </Popover>
  );
};

export default customizableComponent('CommunitySearch', CommunitySearch);
