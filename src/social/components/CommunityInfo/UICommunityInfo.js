import { CommunityPostSettings } from '@amityco/js-sdk';
import React from 'react';
import PropTypes from 'prop-types';
import { toHumanString } from 'human-readable-numbers';
import Truncate from 'react-truncate-markup';
import { FormattedMessage, useIntl } from 'react-intl';

import customizableComponent from '~/core/hocs/customization';
import Button from '~/core/components/Button';
import { PendingPostsBanner } from '~/social/components/CommunityInfo/PendingPostsBanner';
import { backgroundImage as communityCoverPlaceholder } from '~/icons/CommunityCoverPicture';
import {
  Count,
  Container,
  Header,
  OptionMenu,
  CategoriesList,
  Description,
  JoinButton,
  PlusIcon,
  PencilIcon,
  CountsContainer,
  Cover,
  CoverContent,
  Divider,
  Content,
  CommunityName,
} from './styles';

const UICommunityInfo = ({
  communityId,
  communityCategories,
  pendingPostsCount,
  postsCount,
  membersCount,
  description,
  isJoined,
  isOfficial,
  isPublic,
  avatarFileUrl,
  canEditCommunity,
  onEditCommunity,
  joinCommunity,
  onClickLeaveCommunity,
  canLeaveCommunity,
  canReviewPosts,
  name,
  postSetting,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Container>
      <Cover backgroundImage={avatarFileUrl ?? communityCoverPlaceholder}>
        <CoverContent>
          <CommunityName
            isOfficial={isOfficial}
            isPublic={isPublic}
            isTitle
            name={name}
            truncate={2}
          />
          <CategoriesList>{(communityCategories || []).join(', ')}</CategoriesList>
        </CoverContent>
      </Cover>
      <Content>
        <Header>
          <CountsContainer>
            <Count>
              <div className="countNumber">{toHumanString(postsCount || 0)}</div>
              <div className="countType">
                <FormattedMessage id="community.posts" />
              </div>
            </Count>
            <Divider />
            <Count>
              <div className="countNumber">{toHumanString(membersCount || 0)}</div>
              <div className="countType">
                <FormattedMessage id="community.members" />
              </div>
            </Count>
          </CountsContainer>

          {isJoined && (
            <OptionMenu
              data-qa-anchor="social-community-3dots"
              options={[
                canEditCommunity && {
                  name: formatMessage({ id: 'community.settings' }),
                  action: () => onEditCommunity(communityId),
                },
                canLeaveCommunity && {
                  name: formatMessage({ id: 'community.leaveCommunity' }),
                  action: () => onClickLeaveCommunity(communityId),
                },
              ].filter(Boolean)}
            />
          )}
        </Header>

        {description && (
          <Truncate lines={3}>
            <Description>{description}</Description>
          </Truncate>
        )}

        {!isJoined && (
          <JoinButton onClick={() => joinCommunity(communityId)}>
            <PlusIcon /> <FormattedMessage id="community.join" />
          </JoinButton>
        )}

        {isJoined && canEditCommunity && (
          <Button
            fullWidth
            data-qa-anchor="social-edit-community-button"
            onClick={() => onEditCommunity(communityId)}
          >
            <PencilIcon /> <FormattedMessage id="community.editProfile" />
          </Button>
        )}

        {postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED &&
          isJoined &&
          pendingPostsCount > 0 && (
            <PendingPostsBanner canReviewPosts={canReviewPosts} postsCount={pendingPostsCount} />
          )}
      </Content>
    </Container>
  );
};
UICommunityInfo.propTypes = {
  communityId: PropTypes.string.isRequired,
  communityCategories: PropTypes.arrayOf(PropTypes.string),
  pendingPostsCount: PropTypes.number,
  postsCount: PropTypes.number,
  membersCount: PropTypes.number,
  description: PropTypes.string,
  isJoined: PropTypes.bool,
  isOfficial: PropTypes.bool,
  isPublic: PropTypes.bool,
  avatarFileUrl: PropTypes.string,
  canEditCommunity: PropTypes.bool,
  joinCommunity: PropTypes.func,
  canLeaveCommunity: PropTypes.bool,
  canReviewPosts: PropTypes.bool,
  name: PropTypes.string,
  postSetting: PropTypes.string,
  onClickLeaveCommunity: PropTypes.func,
  onEditCommunity: PropTypes.func,
};

export default customizableComponent('UICommunityInfo', UICommunityInfo);
