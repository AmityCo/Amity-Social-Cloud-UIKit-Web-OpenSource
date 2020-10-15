import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import SideMenuActionItem from '~/core/components/SideMenuActionItem';
import SideMenuSection from '~/core/components/SideMenuSection';
import CommunitiesList from '~/social/components/CommunitiesList';

export const PlusIcon = styled(FaIcon).attrs({ icon: faPlus })`
  font-size: 20px;
`;

const myListQueryParam = { isJoined: true };

const SideSectionMyCommunity = ({
  onClickCreate,
  showCreateButton,
  onClickCommunity,
  getIsCommunityActive,
  className,
}) => (
  <SideMenuSection heading="My Community">
    {showCreateButton && (
      <SideMenuActionItem icon={<PlusIcon />} onClick={onClickCreate} element="button">
        Create Community
      </SideMenuActionItem>
    )}
    <CommunitiesList
      communitiesQueryParam={myListQueryParam}
      onClickCommunity={onClickCommunity}
      getIsCommunityActive={getIsCommunityActive}
      className={className}
    />
  </SideMenuSection>
);

SideSectionMyCommunity.propTypes = {
  onClickCommunity: PropTypes.func,
  onClickCreate: PropTypes.func,
  getIsCommunityActive: PropTypes.func,
  showCreateButton: PropTypes.bool,
  className: PropTypes.string,
};

SideSectionMyCommunity.defaultProps = {
  onClickCommunity: () => {},
  onClickCreate: () => {},
  getIsCommunityActive: () => false,
  showCreateButton: false,
  className: null,
};

export default SideSectionMyCommunity;
