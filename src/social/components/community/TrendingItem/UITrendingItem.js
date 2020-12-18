import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { toHumanString } from 'human-readable-numbers';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';
import customizableComponent from '~/core/hocs/customization';
import Avatar from '~/core/components/Avatar';
import ConditionalRender from '~/core/components/ConditionalRender';
import CommunityName from '~/social/components/community/Name';
import { backgroundImage as CommunityImage } from '~/icons/Community';

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  counter-increment: trending;
`;

const Categories = styled.span`
  &:after {
    content: ' • ';
  }
`;

const Category = styled.span`
  font: inherit;
  &:not(:first-child):before {
    content: ' ';
  }
`;

const TextInfos = styled.div`
  /* Full width minus avatar and trending number */
  width: calc(100% - 2.5rem - 64px);
`;

const Infos = styled.div`
  ${({ theme }) => theme.typography.caption}
  color: ${({ theme }) => theme.palette.base.shade1};
  & > * {
    font: inherit;
  }
`;

const Description = styled.p`
  margin: ${({ slim }) => (!slim ? '.5rem' : 0)} 0;
  ${({ theme }) => theme.typography.caption}
`;

const TrendingNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  flex-shrink: 0;
  color: ${({ theme }) => theme.palette.primary.main};
  ${({ theme }) => theme.typography.headline}

  &:before {
    content: counter(trending);
  }
`;

const UITrendingItem = ({
  communityId,
  avatarFileUrl,
  description,
  categories,
  membersCount,
  slim,
  onClick,
}) => (
  <ItemContainer onClick={onClick}>
    <Avatar
      avatar={avatarFileUrl}
      size={!slim ? 'big' : 'regular'}
      backgroundImage={CommunityImage}
    />
    <TrendingNumber />
    <TextInfos>
      <CommunityName communityId={communityId} />
      <Truncate lines={2}>
        <Description slim={slim}>{description}</Description>
      </Truncate>
      <Infos>
        <ConditionalRender condition={categories.length > 0}>
          <Categories>
            {categories.map(({ categoryId, name }) => (
              <Category key={categoryId}>{name}</Category>
            ))}
          </Categories>
        </ConditionalRender>
        <span>
          {toHumanString(membersCount)}{' '}
          <FormattedMessage id="plural.member" values={{ amount: membersCount }} />
        </span>
      </Infos>
    </TextInfos>
  </ItemContainer>
);

UITrendingItem.propTypes = {
  communityId: PropTypes.string.isRequired,
  avatarFileUrl: PropTypes.string,
  description: PropTypes.string,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      categoryId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  membersCount: PropTypes.number,
  slim: PropTypes.bool,
  onClick: PropTypes.func,
};

UITrendingItem.defaultProps = {
  avatarFileUrl: '',
  description: '',
  categories: [],
  membersCount: 0,
  slim: false,
  onClick: () => {},
};

export default customizableComponent('UITrendingItem', UITrendingItem);
