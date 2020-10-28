import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Popover from '~/core/components/Popover';
import Menu, { MenuItem } from '~/core/components/Menu';
import customizableComponent from '~/core/hocs/customization';
import { backgroundImage as CommunityImage } from '~/icons/Community';

import {
  AuthorSelectorContainer,
  CommunitySeparator,
  SelectIcon,
  Avatar,
  CommunityList,
} from './styles';

const AuthorSelector = ({
  author,
  user,
  communities,
  onChange,
  postAvatar,
  setPostAvatar,
  hasMoreCommunities,
  loadMoreCommunities,
}) => {
  if (!communities || !communities.length) return <Avatar avatar={author.avatar} />;

  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const menu = (
    <Menu>
      <MenuItem
        onClick={() => {
          onChange(user);
          setPostAvatar(user.avatar);
          close();
        }}
      >
        <Avatar size="tiny" avatar={user.avatar} /> My Timeline
      </MenuItem>
      <CommunitySeparator>Community</CommunitySeparator>
      <CommunityList>
        <InfiniteScroll
          dataLength={communities.length}
          next={loadMoreCommunities}
          hasMore={hasMoreCommunities}
          loader={<h4>Loading...</h4>}
          onScroll={loadMoreCommunities}
        >
          {communities.map(community => (
            <MenuItem
              key={community.communityId}
              active={author.communityId === community.communityId}
              onClick={() => {
                onChange(community);
                setPostAvatar(community.avatar);
                close();
              }}
            >
              <Avatar avatar={community.avatar} size="tiny" backgroundImage={CommunityImage} />
              {` ${community.displayName}`}
            </MenuItem>
          ))}
        </InfiniteScroll>
      </CommunityList>
    </Menu>
  );

  return (
    <div>
      <Popover
        isOpen={isOpen}
        onClickOutside={close}
        position="bottom"
        align="start"
        content={menu}
      >
        <AuthorSelectorContainer onClick={open}>
          <Avatar avatar={postAvatar} /> <SelectIcon />
        </AuthorSelectorContainer>
      </Popover>
    </div>
  );
};

export default customizableComponent('AuthorSelector', AuthorSelector);
