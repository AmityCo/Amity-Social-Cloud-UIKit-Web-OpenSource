import React, { useState } from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/pro-solid-svg-icons';

import { EkoPostTargetType } from 'eko-sdk';
import Popover from '~/core/components/Popover';
import Menu, { MenuItem } from '~/core/components/Menu';
import customizableComponent from '~/core/hocs/customization';
import UIAvatar from '~/core/components/Avatar';

import { backgroundImage as UserImage } from '~/icons/User';
import { backgroundImage as CommunityImage } from '~/icons/Community';

const SelectIcon = styled(FaIcon).attrs({ icon: faSortDown })`
  font-size: 18px;
  margin-right: 8px;
  margin-top: -4px;
`;

const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;

const PostTargetSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const CommunitySeparator = styled.div`
  ${({ theme }) => theme.typography.caption}
  border-top: 1px solid #e3e4e8;
  color: ${({ theme }) => theme.palette.base.shade1};
  padding: 12px;
`;

const CommunityList = styled.div`
  position: relative;
  height: 350px;
  overflow: auto;
`;

const PostTargetSelector = ({
  user,
  communities,
  hasMoreCommunities,
  loadMoreCommunities,
  currentTargetId,
  onChange,

  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const menu = (
    <Menu>
      <MenuItem
        active={user.userId === currentTargetId}
        onClick={() => {
          onChange({ targetId: user.userId, targetType: EkoPostTargetType.UserFeed });
          close();
        }}
      >
        <Avatar size="tiny" avatar={user.avatarFileUrl} backgroundImage={UserImage} /> My Timeline
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
              active={community.communityId === currentTargetId}
              onClick={() => {
                onChange({
                  targetId: community.communityId,
                  targetType: EkoPostTargetType.CommunityFeed,
                });
                close();
              }}
            >
              <Avatar
                avatar={community.avatarFileUrl}
                size="tiny"
                backgroundImage={CommunityImage}
              />
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
        <PostTargetSelectorContainer onClick={open}>
          {children} <SelectIcon />
        </PostTargetSelectorContainer>
      </Popover>
    </div>
  );
};

export default customizableComponent('PostTargetSelector', PostTargetSelector);
