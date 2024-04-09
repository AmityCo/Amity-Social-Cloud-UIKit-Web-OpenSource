import { CommunityPostSettings } from '@amityco/ts-sdk';
import React from 'react';
import Truncate from 'react-truncate-markup';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '~/core/components/Button';
import { PendingPostsBanner } from '~/social/components/CommunityInfo/PendingPostsBanner';

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
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import millify from 'millify';
import { isNonNullable } from '~/helpers/utils';
import { StoryTab } from '~/social/v4/components/StoryTab';
import { AmityStoryTabComponentType } from '~/social/v4/components/StoryTab/StoryTab';

interface UICommunityInfoProps {
  communityId: string;
  communityCategories: string[];
  pendingPostsCount: number;
  postsCount: number;
  membersCount: number;
  description: string;
  isJoined: boolean;
  isOfficial: boolean;
  isPublic: boolean;
  avatarFileUrl: string | null;
  canEditCommunity: boolean;
  onEditCommunity: (communityId: string) => void;
  joinCommunity: (communityId: string) => void;
  onClickLeaveCommunity: (communityId: string) => void;
  canLeaveCommunity: boolean;
  canReviewPosts: boolean;
  name: string;
  postSetting: ValueOf<typeof CommunityPostSettings>;
}

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
}: UICommunityInfoProps) => {
  const { formatMessage } = useIntl();

  return (
    <Container data-qa-anchor="community-info">
      <Cover backgroundImage={avatarFileUrl!}>
        <CoverContent>
          <CommunityName
            data-qa-anchor="community-info"
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
              <div className="countNumber">{millify(postsCount || 0)}</div>
              <div className="countType">
                <FormattedMessage id="community.posts" />
              </div>
            </Count>
            <Divider />
            <Count>
              <div className="countNumber">{millify(membersCount || 0)}</div>
              <div className="countType">
                <FormattedMessage id="community.members" />
              </div>
            </Count>
          </CountsContainer>

          {isJoined && (
            <OptionMenu
              data-qa-anchor="community-info-options-button"
              options={[
                canEditCommunity
                  ? {
                      name: formatMessage({ id: 'community.settings' }),
                      action: () => onEditCommunity(communityId),
                      dataQaAnchorMenuItem: 'settings',
                    }
                  : null,
                canLeaveCommunity
                  ? {
                      name: formatMessage({ id: 'community.leaveCommunity' }),
                      action: () => onClickLeaveCommunity(communityId),
                      dataQaAnchorMenuItem: 'leave-community',
                    }
                  : null,
              ].filter(isNonNullable)}
            />
          )}
        </Header>

        {description && (
          <Truncate lines={3}>
            <Description data-qa-anchor="community-info-description">{description}</Description>
          </Truncate>
        )}

        {!isJoined && (
          <JoinButton
            data-qa-anchor="community-info-join-button"
            onClick={() => joinCommunity(communityId)}
          >
            <PlusIcon /> <FormattedMessage id="community.join" />
          </JoinButton>
        )}

        <StoryTab type="communityFeed" communityId={communityId} />

        {isJoined && canEditCommunity && (
          <Button
            fullWidth
            data-qa-anchor="community-info-edit-button"
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

export default (props: UICommunityInfoProps) => {
  const CustomComponentFn = useCustomComponent<UICommunityInfoProps>('UICommunityInfo');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UICommunityInfo {...props} />;
};
