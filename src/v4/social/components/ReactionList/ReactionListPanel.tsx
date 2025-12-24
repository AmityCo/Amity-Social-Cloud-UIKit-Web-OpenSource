import React, { Fragment, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import { ReactionIcon } from '~/v4/social/components/ReactionList/ReactionIcon';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import useSDK from '~/v4/core/hooks/useSDK';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Button } from '~/v4/core/components/AriaButton';
import { BrandBadge, UserAvatar } from '~/v4/social/elements';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { ReactionListLoadingState } from './ReactionListLoadingState';
import styles from './ReactionList.module.css';

export const ReactionListPanel = ({
  filteredReactions,
  removeReaction,
  hasMore,
  loadMore,
  isLoading,
}: {
  filteredReactions: Amity.Reactor[];
  removeReaction: (reaction: string) => Promise<void>;
  hasMore?: boolean;
  loadMore: () => void;
  isLoading: boolean;
}) => {
  const { currentUserId } = useSDK();
  const { goToUserProfilePage } = useNavigation();
  const { socialReactions: config } = useCustomReaction();
  const { closePopup } = usePopupContext();
  const reactionList = useMemo(() => config.map(({ name }) => name), [config]);
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  useIntersectionObserver({
    onIntersect: () => {
      if (!isLoading) {
        loadMore();
      }
    },
    node: intersectionNode,
    options: {
      threshold: 0.7,
    },
  });

  const onClickUserDetails = (userId: string) => {
    closePopup();
    goToUserProfilePage(userId);
  };

  return (
    <div className={styles.userList}>
      {filteredReactions.map((reaction) => {
        return (
          <Fragment key={reaction.reactionId}>
            <div className={styles.userItem}>
              <div className={styles.userDetailsContainer}>
                <div className={styles.userDetailsProfile}>
                  <UserAvatar
                    data-testid="user_avatar_view"
                    userId={reaction.user?.userId}
                    className={styles.userAvatar}
                  />
                  <div>
                    <Button
                      variant="text"
                      onPress={() => onClickUserDetails(reaction.user?.userId as string)}
                      className={styles.userDetailsNameContainer}
                    >
                      <Typography.BodyBold
                        testId="user_display_name"
                        className={styles.userDetailsName}
                      >
                        {reaction.user?.displayName}
                      </Typography.BodyBold>
                      {reaction.user?.isBrand && (
                        <div className={styles.userDetailsBrandBadge}>
                          <BrandBadge pageId="reaction_list_panel" componentId="brand_badge" />
                        </div>
                      )}
                    </Button>
                    {currentUserId === reaction.user?.userId && (
                      <div
                        role="button"
                        tabIndex={0}
                        aria-label="Click to remove reaction"
                        onClick={() => removeReaction(reaction.reactionName)}
                      >
                        <Typography.Caption className={styles.removeBtn}>
                          Click to remove reaction
                        </Typography.Caption>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.userDetailsReaction}>
                  {reactionList.includes(reaction.reactionName) ? (
                    <ReactionIcon
                      reactionConfigItem={
                        config.find(({ name }) => name === reaction.reactionName)!
                      }
                      className={styles.reactionIcon}
                    />
                  ) : (
                    <FallbackReaction
                      className={clsx(styles.reactionIcon, styles.reactionIcon__fallbackIcon)}
                    />
                  )}
                </div>
              </div>
            </div>
          </Fragment>
        );
      })}
      {isLoading && <ReactionListLoadingState length={5} />}
      {hasMore && (
        <div
          ref={(node) => setIntersectionNode(node)}
          className={styles.reactionList__bottomHeight}
        />
      )}
    </div>
  );
};
