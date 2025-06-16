import React from 'react';
import { JoinRequestStatusEnum, JoinResultStatusEnum } from '@amityco/ts-sdk';
import { StoryTab } from '~/v4/social/components/StoryTab';
import { CommunityPendingPost } from '~/v4/social/elements/CommunityPendingPost';
import { CommunityCover } from '~/v4/social/elements/CommunityCover';
import { CommunityJoinButton } from '~/v4/social/elements/CommunityJoinButton';
import { useCommunityInfo } from '~/v4/social/hooks/useCommunityInfo';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunityDescription } from '~/v4/social/elements/CommunityDescription';
import { CommunityName } from '~/v4/social/elements/CommunityName';
import { CommunityInfo } from '~/v4/social/elements/CommunityInfo';
import { CommunityCategories } from '~/v4/social/internal-components/CommunityCategories/CommunityCategories';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { CommunityPostSettings, InvitationStatusEnum } from '@amityco/ts-sdk';
import { CommunityPrivateBadge } from '~/v4/social/elements/CommunityPrivateBadge/CommunityPrivateBadge';
import { CommunityOfficialBadge } from '~/v4/social/elements/CommunityOfficialBadge';
import { useNetworkState } from 'react-use';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { InvitationBanner } from '~/v4/social/components';
import { useGetInvitation } from '~/v4/social/hooks';
import { IconButton } from '~/v4/core/components/IconButton';
import { useCommunityActions } from '~/v4/social/hooks/useCommunityActions';
import Clock from '~/v4/icons/Clock';
import styles from './CommunityHeader.module.css';
import { useGetJoinRequests } from '~/v4/social/hooks/useGetJoinRequests';
import { useGetMyJoinRequest } from '~/v4/social/hooks/useGetMyJoinRequest';

//TODO: check needApprovalOnPostCreation and onlyAdminCanPost after postSetting fix from SDK

interface CommunityProfileHeaderProps {
  pageId?: string;
  community: Amity.Community;
  isSticky?: boolean;
  page?: number;
}

export const CommunityHeader: React.FC<CommunityProfileHeaderProps> = ({
  pageId = '*',
  community,
  isSticky,
  page,
}) => {
  const componentId = 'community_header';
  const { onBack } = useNavigation();
  const { isDesktop } = useResponsive();
  const { AmityCommunityProfilePageBehavior } = usePageBehavior();
  const { currentUserId } = useSDK();
  const { online } = useNetworkState();
  const notification = useNotifications();
  const { invitation, setInvitation } = useGetInvitation(community);
  const { myJoinRequest, setMyJoinRequest, refreshJoinRequest } = useGetMyJoinRequest(community);
  const { joinRequests } = useGetJoinRequests(community);
  const [isPendingLocal, setIsPendingLocal] = React.useState(false);

  const { avatarFileUrl, pendingPostsCount, reviewingPosts, canReviewCommunityPosts } =
    useCommunityInfo(community.communityId);

  const [isCancelJoinRequestSuccess, setIsCancelJoinRequestSuccess] = React.useState(false);

  const { joinCommunity, cancelJoinCommunity } = useCommunityActions({
    community,
    joinRequest: myJoinRequest,
    onJoinSuccess: ({ data }: { data?: Amity.JoinResult }) => {
      if (data?.status === JoinResultStatusEnum.Pending) {
        setMyJoinRequest(data?.request);
        setIsPendingLocal(true);
      }

      refreshJoinRequest();
    },
    onLeaveSuccess: () => {
      refreshJoinRequest();
    },
    onCancelJoinSuccess: () => {
      refreshJoinRequest();
      setIsCancelJoinRequestSuccess(true);
      setIsPendingLocal(false);
    },
  });

  const isPostOwner = reviewingPosts.some((post) => post.postedUserId === currentUserId);

  const isPendingJoinRequest =
    myJoinRequest?.status === JoinRequestStatusEnum.Pending && !isCancelJoinRequestSuccess;

  const joinRequestCount = (joinRequests && joinRequests?.length) ?? 0;

  const isShowPendingPost =
    pendingPostsCount > 0 &&
    reviewingPosts.length > 0 &&
    (canReviewCommunityPosts || isPostOwner) &&
    ((community as Amity.Community & { needApprovalOnPostCreation?: boolean })
      .needApprovalOnPostCreation ||
      community?.postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED);

  const isShowJoinRequest = joinRequestCount > 0 && canReviewCommunityPosts;
  const isShowPendingBanner = isShowPendingPost || isShowJoinRequest;

  return (
    <>
      <CommunityCover
        pageId={pageId}
        componentId={componentId}
        image={avatarFileUrl}
        community={community}
        onBack={() => onBack(page)}
        isSticky={!isDesktop && isSticky}
        onClickMenu={() => {
          AmityCommunityProfilePageBehavior?.goToCommunitySettingPage?.({
            community: community,
          });
        }}
      />
      <div className={styles.content}>
        <div className={styles.communityProfile__name}>
          {!community.isPublic && (
            <CommunityPrivateBadge
              pageId={pageId}
              componentId={componentId}
              className={styles.communityProfile__privateIcon}
            />
          )}
          <CommunityName pageId={pageId} componentId={componentId} name={community.displayName} />
          {community.isOfficial && (
            <CommunityOfficialBadge className={styles.communityProfile__privateIcon} />
          )}
        </div>

        <div className={styles.communityProfile__communityCategories}>
          <CommunityCategories
            pageId={pageId}
            componentId={componentId}
            community={community}
            minCategoryCharacters={10}
          />
        </div>

        <CommunityDescription
          pageId={pageId}
          componentId={componentId}
          description={community.description || ''}
        />

        <div className={styles.communityProfile__communityInfo__container}>
          <CommunityInfo
            pageId={pageId}
            componentId={componentId}
            count={community.postsCount}
            text={`post${community.postsCount === 1 ? '' : 's'}`}
          />
          <div className={styles.divider}></div>
          <CommunityInfo
            pageId={pageId}
            componentId={componentId}
            count={community.membersCount}
            text={`member${community.membersCount === 1 ? '' : 's'}`}
            onClick={() => {
              community.isJoined &&
                AmityCommunityProfilePageBehavior?.goToMembershipPage?.({ community: community });
            }}
          />
        </div>

        {invitation && invitation.status === InvitationStatusEnum.Pending && (
          <InvitationBanner
            pageId={pageId}
            community={community}
            invitation={invitation}
            removeInvitation={() => setInvitation(undefined)}
          />
        )}
        {(!invitation || invitation.status !== InvitationStatusEnum.Pending) &&
          !community.isJoined &&
          !isPendingJoinRequest &&
          !isPendingLocal && (
            <div className={styles.communityProfile__joinButton__container}>
              <CommunityJoinButton
                size="medium"
                pageId={pageId}
                onClick={() => {
                  if (!online) {
                    notification.info({
                      content: 'Failed to join community. Please try again.',
                    });
                    return;
                  }
                  joinCommunity(community);
                }}
                componentId={componentId}
                className={styles.communityProfile__joinButton}
              />
            </div>
          )}
        {((!community.isJoined && isPendingJoinRequest) || isPendingLocal) && (
          <div className={styles.communityProfile__cancelJoinButton__container}>
            <IconButton
              pageId={pageId}
              componentId={componentId}
              elementId="community_cancel_request_button"
              size="small"
              color="secondary"
              variant="outlined"
              defaultIcon={<Clock className={styles.communityProfile__pendingIcon} />}
              onPress={cancelJoinCommunity}
              text="Cancel request"
              typographyVariant="bodyBold"
              className={styles.communityProfile__cancelJoinButton}
            />
          </div>
        )}
        {(community.isJoined || community.isPublic) && (
          <div>
            <StoryTab type="communityFeed" pageId={pageId} communityId={community.communityId} />
          </div>
        )}

        {isShowPendingBanner && (
          <div className={styles.communityProfile__pendingPost__container}>
            <CommunityPendingPost
              pageId={pageId}
              componentId={componentId}
              pendingPostsCount={pendingPostsCount}
              onClick={() => {
                AmityCommunityProfilePageBehavior?.goToPendingRequestPage?.({
                  community: community,
                });
              }}
              isPostOwner={isPostOwner}
              canReviewCommunityPosts={canReviewCommunityPosts}
              isShowJoinRequest={isShowJoinRequest}
              isShowPendingPost={isShowPendingPost}
              joinRequestsCount={joinRequestCount}
            />
          </div>
        )}
      </div>

      <div className={styles.communityProfile__divider} />
    </>
  );
};
