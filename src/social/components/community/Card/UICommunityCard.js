import React from 'react';
import PropTypes from 'prop-types';
import { Button, Stack, Icon } from '@noom/wax-component-library';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';

import { toHumanString } from '~/helpers/toHumanString';
import Skeleton from '~/core/components/Skeleton';
import customizableComponent from '~/core/hocs/customization';
import { backgroundImage as communityCoverPlaceholder } from '~/icons/CommunityCoverPicture';

import { CommunityName, Container, Content, Count, Cover, Description } from './styles';

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
  onClickJoin,
  isJoining,
  isJoined,
  showMemberCount,
  ...props
}) => {
  const handleClick = () => onClick(communityId);
  const handleButtonClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onClickJoin();
  };

  return (
    <Container onClick={handleClick} {...props}>
      <Cover backgroundImage={avatarFileUrl ?? communityCoverPlaceholder} />

      <Content>
        <Stack spacing={3}>
          {loading ? (
            <Skeleton count={1} style={{ fontSize: 14 }} />
          ) : (
            <CommunityName
              isOfficial={isOfficial}
              isPublic={isPublic}
              isTitle
              name={name}
              truncate={2}
            />
          )}

          {loading && <Skeleton count={2} style={{ fontSize: 8 }} />}

          {!loading && (
            <Truncate lines={2}>
              <Description title={description}>{description}</Description>
            </Truncate>
          )}

          {!loading && showMemberCount && (
            <Count>
              {toHumanString(membersCount)}{' '}
              <FormattedMessage id="plural.member" values={{ amount: membersCount }} />
            </Count>
          )}

          <Button
            width="100%"
            size="lg"
            colorScheme="secondary"
            isLoading={loading || isJoining}
            isDisabled={isJoined}
            onClick={handleButtonClick}
          >
            {isJoined ? <Icon icon="check" /> : <FormattedMessage id="community.join" />}
          </Button>
        </Stack>
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
  showMemberCount: false,
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
  showMemberCount: PropTypes.bool,
  onClickJoin: PropTypes.func,
  isJoining: PropTypes.bool,
  isJoined: PropTypes.bool,
};

export default customizableComponent('UICommunityCard', UICommunityCard);
