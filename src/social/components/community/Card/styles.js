import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { toHumanString } from 'human-readable-numbers';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';
import Card from '~/core/components/Card';
import Skeleton from '~/core/components/Skeleton';
import customizableComponent from '~/core/hocs/customization';

import Avatar from '~/core/components/Avatar';
import { backgroundImage as CommunityImage } from '~/icons/Community';

import CommunityName from '~/social/components/community/Name';

import ConditionalRender from '~/core/components/ConditionalRender';

const Container = styled(Card)`
  width: 10rem;
  height: 12rem;
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
  isOfficial,
  isPublic,
  name,
  loading,
  ...props
}) => {
  const handleClick = () => onClick(communityId);

  return (
    <Container onClick={handleClick} {...props}>
      <StyledAvatar avatar={avatarFileUrl} backgroundImage={CommunityImage} loading={loading} />

      <CommunityName
        isOfficial={isOfficial}
        isPublic={isPublic}
        isTitle
        name={name}
        loading={loading}
      />

      <Infos>
        {loading && <Skeleton count={2} style={{ fontSize: 8 }} />}

        {!loading && (
          <>
            <ConditionalRender condition={!!communityCategories.length}>
              <Categories>
                {communityCategories.map(category => (
                  <Category key={category.categoryId}>{category.name}</Category>
                ))}
              </Categories>
            </ConditionalRender>

            <Count>
              <strong>{toHumanString(membersCount)}</strong>{' '}
              <FormattedMessage id="plural.member" values={{ amount: membersCount }} />
            </Count>
          </>
        )}
      </Infos>

      {description && (
        <Truncate lines={3}>
          <Description>{description}</Description>
        </Truncate>
      )}
    </Container>
  );
};

UICommunityCard.defaultProps = {
  communityCategories: [],
  onClick: () => {},
  isOfficial: false,
  isPublic: false,
  name: '',
  loading: false,
};

UICommunityCard.propTypes = {
  avatarFileUrl: PropTypes.string,
  communityId: PropTypes.string,
  communityCategories: PropTypes.arrayOf(
    PropTypes.shape({
      categoryId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  membersCount: PropTypes.number,
  description: PropTypes.string,
  onClick: PropTypes.func,
  isOfficial: PropTypes.bool,
  isPublic: PropTypes.bool,
  name: PropTypes.string,
  loading: PropTypes.bool,
};

export default customizableComponent('UICommunityCard', UICommunityCard);
