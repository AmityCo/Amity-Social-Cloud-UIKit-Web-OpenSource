import React, { useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

import { PostTargetType } from '@amityco/js-sdk';
import Popover from '~/core/components/Popover';
import Menu, { MenuItem } from '~/core/components/Menu';
import customizableComponent from '~/core/hocs/customization';
import useImage from '~/core/hooks/useImage';
import { Avatar } from './styles';

import { SortDown } from '~/icons';
import { backgroundImage as UserImage } from '~/icons/User';
import CommunityItem from './CommunityItem';

const COMMUNITY_LIST_HEIGHT = 350;
const SCROLL_THRESHOLD = 0.98;

const SelectIcon = styled(SortDown).attrs({ width: 18, height: 18 })`
  margin-right: 8px;
  margin-top: -4px;
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
  max-width: 200px;
  height: ${COMMUNITY_LIST_HEIGHT}px;
  overflow: auto;
`;

const CommunityListLoader = styled.h4`
  text-align: center;
`;

const StyledPopover = styled(Popover)`
  transform: none !important;
  position: absolute !important;
  top: 45px !important;
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
  const popupContainerRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const fileUrl = useImage({ fileId: user.avatarFileId });

  const menu = (
    <Menu>
      <MenuItem
        active={user.userId === currentTargetId}
        onClick={() => {
          onChange({ targetId: user.userId, targetType: PostTargetType.UserFeed });
          close();
        }}
      >
        <Avatar size="tiny" avatar={user.avatarCustomUrl || fileUrl} backgroundImage={UserImage} />{' '}
        <FormattedMessage id="post.myTimeline" />
      </MenuItem>

      <CommunitySeparator>
        <FormattedMessage id="post.community" />
      </CommunitySeparator>
      <CommunityList>
        <InfiniteScroll
          dataLength={communities.length}
          next={loadMoreCommunities}
          hasMore={hasMoreCommunities}
          height={COMMUNITY_LIST_HEIGHT}
          loader={
            <CommunityListLoader>
              <FormattedMessage id="loading" />
            </CommunityListLoader>
          }
          scrollThreshold={SCROLL_THRESHOLD}
        >
          {communities.map((community) => (
            <CommunityItem
              key={community.communityId}
              community={community}
              currentTargetId={currentTargetId}
              onChange={onChange}
              onClose={close}
            />
          ))}
        </InfiniteScroll>
      </CommunityList>
    </Menu>
  );

  return (
    <div ref={popupContainerRef} style={{ position: 'relative' }}>
      <StyledPopover
        isOpen={isOpen}
        position={['bottom']}
        align="start"
        content={menu}
        parentElement={popupContainerRef.current}
        onClickOutside={close}
      >
        <PostTargetSelectorContainer onClick={open}>
          {children} <SelectIcon />
        </PostTargetSelectorContainer>
      </StyledPopover>
    </div>
  );
};

export default customizableComponent('PostTargetSelector', PostTargetSelector);
