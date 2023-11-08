import React from 'react';
import PropTypes from 'prop-types';

import { toHumanString } from 'human-readable-numbers';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';

import Skeleton from '~/core/components/Skeleton';
import customizableComponent from '~/core/hocs/customization';
// import { backgroundImage as communityCoverPlaceholder } from '~/icons/CommunityCoverPicture';

import {
  CategoriesList,
  CommunityName,
  Container,
  Content,
  Count,
  Cover,
  CoverContent,
  Description,
} from './styles';

const communityCoverPlaceholder =
  'https://c10amity.s3.us-west-2.amazonaws.com/images/large_group.png';

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
      <Cover backgroundImage={avatarFileUrl ?? communityCoverPlaceholder}>
        <CoverContent>
          <CommunityName
            isOfficial={isOfficial}
            isPublic={isPublic}
            isTitle
            name={name}
            truncate={2}
          />
          {/* <Truncate lines={1}>
            <CategoriesList>
              {(communityCategories || []).map((category) => category.name).join(', ')}
            </CategoriesList>
          </Truncate> */}
        </CoverContent>
      </Cover>

      <Content>
        {loading && <Skeleton count={2} style={{ fontSize: 8 }} />}

        {!loading && (
          <Count>
            {toHumanString(membersCount)}{' '}
            <FormattedMessage id="plural.member" values={{ amount: membersCount }} />
          </Count>
        )}

        {!loading && description && (
          <Truncate lines={2}>
            <Description>{description}</Description>
          </Truncate>
        )}
      </Content>
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
  isOfficial: PropTypes.bool,
  isPublic: PropTypes.bool,
  name: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
};

export default customizableComponent('UICommunityCard', UICommunityCard);
