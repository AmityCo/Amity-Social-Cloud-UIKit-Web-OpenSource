import { useState } from 'react';
import { useString } from '~/v4/core/localization';
import { Plus } from '~/v4/icons/Plus';
import useSDK from '~/v4/core/hooks/useSDK';
import { Menu } from '~/v4/core/components/Menu';
import EmptyPost from '~/v4/icons/EmptyPost';
import CreatePoll from '~/v4/icons/CreatePoll';
import { Typography } from '~/v4/core/components';
import { PostContent } from '~/v4/social/components';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { Mode, PostComposerPage } from '~/v4/social/pages';
import { LivestreamFill } from '~/v4/icons/LivestreamFill';
import { useDiscardPostCreation } from '~/v4/social/hooks';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { PostComposer } from '~/v4/social/components/PostComposer';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent';
import { PollTypeSelection } from '~/v4/social/components/PollTypeSelection';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { FloatingActionButton } from '~/v4/core/components/FloatingActionButton';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import { PostSkeleton } from '~/v4/social/internal-components/Skeleton/PostSkeleton';
import { CreatePost } from '~/v4/icons/CreatePost';
import {
  AmityPostCategory,
  AmityPostContentComponentStyle,
} from '~/v4/social/components/PostContent/PostContent';
import styles from './EventDiscussion.module.css';

type EventDiscussionProps = {
  pageId?: string;
  event: Amity.Event;
};

export function EventDiscussion({ pageId = '*', event }: EventDiscussionProps) {
  const componentId = COMPONENT_ID.EVENT_DISCUSSION;

  const { isVisitorOrBot } = useSDK();
  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { discardPostCreation } = useDiscardPostCreation();
  const { AmityEventDetailPageBehavior } = usePageBehavior();
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const { accessibilityId, isExcluded, themeStyles } = useAmityComponent({ pageId, componentId });

  const choosePollTypeLabel = useString('amity_social_label_choose_poll_type');
  const emptyFeedLabel = useString('amity_social_empty_feed_no_posts');

  const { posts, isLoading, isLoadingFirstPage, refresh, hasMore, loadMore } = usePostsCollection({
    targetType: 'community',
    targetId: event.discussionCommunityId,
    limit: 20,
  });

  const actions = [
    {
      id: useString('amity_social_label_community_post_label'),
      label: useString('amity_social_label_community_post_label'),
      icon: CreatePost,
      onPress: () => {
        removeDrawerData();
        AmityEventDetailPageBehavior?.goToPostComposerPage?.({
          mode: Mode.CREATE,
          targetName: event.title,
          targetType: 'community',
          targetId: event.discussionCommunityId!,
        });
      },
    },
    {
      id: 'poll',
      label: useString('amity_social_button_poll'),
      icon: CreatePoll,
      onPress: () => {
        setDrawerData({
          content: (
            <PollTypeSelection
              targetType="community"
              targetName={event.title}
              onClickNext={removeDrawerData}
              target={event.targetCommunity}
              targetId={event.discussionCommunityId!}
            />
          ),
        });
      },
    },
    {
      id: 'livestream',
      label: useString('amity_social_status_live_stream'),
      icon: LivestreamFill,
      onPress: () => {
        removeDrawerData();
        AmityEventDetailPageBehavior?.goToCreateLivestreamPage?.({
          targetType: 'community',
          targetId: event.discussionCommunityId!,
        });
      },
    },
  ];

  useIntersectionObserver({
    node: intersectionNode,
    options: { threshold: 0.7 },
    onIntersect: () => !isLoading && hasMore && loadMore(),
  });

  if (isExcluded) return null;

  return (
    <section data-testid={accessibilityId} style={themeStyles} className={styles.eventDiscussion}>
      {event?.targetCommunity?.isJoined && !isVisitorOrBot && isDesktop && (
        <PostComposer
          isDisableStory
          isDisableEvent
          onClickPost={() => {
            openPopup({
              pageId,
              view: 'desktop',
              isDismissable: false,
              onClose: ({ close }) => discardPostCreation({ pageId, onDiscard: close }),
              header: (
                <CommunityDisplayName
                  pageId={pageId}
                  typography="Headline"
                  displayName={event.title}
                />
              ),
              children: (
                <PostComposerPage
                  mode={Mode.CREATE}
                  targetType="community"
                  community={event.targetCommunity}
                  targetId={event.discussionCommunityId!}
                />
              ),
            });
          }}
          onClickPoll={() => {
            openPopup({
              pageId,
              view: 'desktop',
              isDismissable: false,
              header: <Typography.Headline>{choosePollTypeLabel}</Typography.Headline>,
              children: ({ close }) => (
                <PollTypeSelection
                  onClickNext={close}
                  targetType="community"
                  targetName={event.title}
                  target={event.targetCommunity}
                  targetId={event.discussionCommunityId!}
                />
              ),
            });
          }}
          onClickLivestream={() => {
            AmityEventDetailPageBehavior?.goToCreateLivestreamPage?.({
              targetType: 'community',
              targetId: event.discussionCommunityId!,
            });
          }}
        />
      )}
      <div className={styles.eventDiscussion__posts}>
        {!isLoadingFirstPage &&
          posts.filter((post) => post.postId !== event.postId).length === 0 && (
            <EmptyContent
              variant="container"
              text={emptyFeedLabel}
              defaultIcon={() => <EmptyPost className={styles.emptyUserFeed__emptyIcon} />}
            />
          )}
        {posts.length > 0 &&
          posts
            .filter((post) => post.postId !== event.postId)
            .map((post) => {
              return (
                <PostContent
                  hideTarget
                  post={post}
                  pageId={pageId}
                  key={post.postId}
                  eventCreatorId={event.userId}
                  onPollPostDeleted={() => refresh()}
                  category={AmityPostCategory.GENERAL}
                  className={styles.eventDiscussion__post}
                  style={AmityPostContentComponentStyle.FEED}
                  onClick={(context) => {
                    AmityEventDetailPageBehavior?.goToPostDetailPage?.({
                      postId: post.postId,
                      commentId: context?.commentId,
                      parentId: context?.parentId,
                      eventCreatorId: event.userId,
                      selectedReplyComment: context?.selectedReplyComment,
                      showReplyCommentAt: context?.showReplyCommentAt,
                      isFromCommentClick: context?.isFromCommentClick,
                    });
                  }}
                />
              );
            })}
        {(isLoadingFirstPage || isLoading) &&
          Array.from({ length: 3 }).map((_, index) => <PostSkeleton key={index} />)}
        {!isLoadingFirstPage && !isLoading && hasMore && (
          <div ref={(node) => setIntersectionNode(node)} />
        )}
      </div>
      {!isDesktop && event?.targetCommunity?.isJoined && !isVisitorOrBot && (
        <FloatingActionButton
          icon={Plus}
          onPress={() =>
            setDrawerData({
              content: (
                <Menu container="drawer">
                  {actions.map((action) => (
                    <Menu.Item {...action} key={action.id} />
                  ))}
                </Menu>
              ),
            })
          }
        />
      )}
    </section>
  );
}
