import React, { Fragment, useMemo } from 'react';
import clsx from 'clsx';
import { Avatar, Typography } from '~/v4/core/components';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import { ReactionIcon } from '~/v4/social/components/ReactionList/ReactionIcon';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import InfiniteScroll from 'react-infinite-scroll-component';
import useSDK from '~/v4/core/hooks/useSDK';
import styles from './ReactionList.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Button } from '~/v4/core/components/AriaButton';
import { UserAvatar } from '~/v4/social/elements';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';

export const ReactionListPanel = ({
  filteredReactions,
  removeReaction,
  hasMore,
  loadMore,
  isLoading,
  currentRef,
}: {
  filteredReactions: Amity.Reactor[];
  removeReaction: (reaction: string) => Promise<void>;
  hasMore?: boolean;
  loadMore: () => void;
  isLoading: boolean;
  currentRef: HTMLDivElement | null;
}) => {
  const { currentUserId } = useSDK();
  const { goToUserProfilePage } = useNavigation();
  const { socialReactions: config } = useCustomReaction();
  const { closePopup } = usePopupContext();
  const reactionList = useMemo(() => config.map(({ name }) => name), [config]);

  if (!currentRef || !filteredReactions) return null;

  const onClickUserDetails = (userId: string) => {
    closePopup();
    goToUserProfilePage(userId);
  };

  return (
    <div className={styles.infiniteScrollContainer}>
      <InfiniteScroll
        scrollableTarget={currentRef}
        scrollThreshold={0.7}
        hasMore={hasMore ?? false}
        next={loadMore}
        loader={isLoading ? <span key={0}>Loading...</span> : null}
        dataLength={filteredReactions.length || 0}
        style={{ display: 'flex', width: '100%' }}
        height={currentRef.clientHeight}
      >
        <div className={styles.userList}>
          {filteredReactions.map((reaction) => {
            return (
              <Fragment key={reaction.reactionId}>
                <div className={styles.userItem}>
                  <div className={styles.userDetailsContainer}>
                    <div className={styles.userDetailsProfile}>
                      <UserAvatar data-testid="user_avatar_view" userId={reaction.user?.userId} />
                      <div>
                        <Button
                          variant="text"
                          onPress={() => onClickUserDetails(reaction.user?.userId as string)}
                        >
                          <Typography.BodyBold
                            data-testid="user_display_name"
                            className={styles.userDetailsName}
                          >
                            {reaction.user?.displayName}
                          </Typography.BodyBold>
                        </Button>
                        {currentUserId === reaction.user?.userId && (
                          <div onClick={() => removeReaction(reaction.reactionName)}>
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
        </div>
      </InfiniteScroll>
    </div>
  );
};
