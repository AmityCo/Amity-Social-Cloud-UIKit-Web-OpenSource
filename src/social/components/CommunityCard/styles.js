import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { toHumanString } from 'human-readable-numbers';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';
import customizableComponent from '~/core/hocs/customization';

import Avatar from '~/core/components/Avatar';
import { backgroundImage as CommunityImage } from '~/icons/Community';

import CommunityName from '~/social/components/CommunityName';

import ConditionalRender from '~/core/components/ConditionalRender';

// TODO: Replace with Card component (no title) after merge of UKT-1098
const Container = styled.div`
  width: 10rem;
  height: 12rem;
  padding: 1.25rem;
  background: #fff;
  border: 1px solid #ebecef;
  border-radius: 4px;
  cursor: pointer;
`;

const StyledAvatar = styled(Avatar)`
  margin-bottom: 0.6rem;
`;

const Infos = styled.div`
  margin: 0.3rem 0;

  ${({ theme }) => theme.typography.caption}
  & > * {
    font: inherit;
  }
`;

const Categories = styled.div``;

const Category = styled.span`
  color: ${({ theme }) => theme.palette.base.shade1};
  font: inherit;

  &:not(:first-child):before {
    content: ' ';
  }
`;

const Count = styled.div`
  & > strong {
    font-weight: bold;
  }
`;

const Description = styled.div`
  ${({ theme }) => theme.typography.caption}
`;

const UICommunityCard = ({
  avatarFileUrl,
  communityId,
  communityCategories,
  membersCount,
  description,
  onClick,
}) => {
  const handleClick = () => onClick(communityId);

  return (
    <Container onClick={handleClick}>
      <StyledAvatar avatar={avatarFileUrl} backgroundImage={CommunityImage} />

      <CommunityName key={communityId} communityId={communityId} isTitle />

      <Infos>
        <ConditionalRender condition={!!communityCategories.length}>
          <Categories>
            {communityCategories.map(({ categoryId, name }) => (
              <Category key={categoryId}>{name}</Category>
            ))}
          </Categories>
        </ConditionalRender>

        <Count>
          <strong>{toHumanString(membersCount)}</strong>{' '}
          <FormattedMessage id="plural.member" values={{ amount: membersCount }} />
        </Count>
      </Infos>

      <Truncate lines={3}>
        <Description>{description}</Description>
      </Truncate>
    </Container>
  );
};

UICommunityCard.defaultProps = {
  communityCategories: [],
  onClick: () => {},
};

UICommunityCard.propTypes = {
  avatarFileUrl: PropTypes.string,
  communityId: PropTypes.string.isRequired,
  communityCategories: PropTypes.arrayOf(
    PropTypes.shape({
      categoryId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  membersCount: PropTypes.number,
  description: PropTypes.string,
  onClick: PropTypes.func,
};

export default customizableComponent('UICommunityCard', UICommunityCard);
