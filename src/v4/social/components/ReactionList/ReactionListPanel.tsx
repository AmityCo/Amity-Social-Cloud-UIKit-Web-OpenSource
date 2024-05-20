import styles from './ReactionList.module.css';
import React, { Fragment, useMemo } from 'react';
import { Avatar, Typography } from '~/v4/core/components';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import { ReactionIcon } from '~/v4/social/components/ReactionList/ReactionIcon';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';

export const ReactionListPanel = ({
  filteredReactions,
}: {
  filteredReactions: Amity.Reactor[];
}) => {
  const { config } = useCustomReaction();
  const reactionList = useMemo(() => config.map(({ name }) => name), [config]);

  return (
    <div className={styles.userList}>
      {filteredReactions.map((reaction) => {
        return (
          <Fragment key={reaction.reactionId}>
            <div className={styles.userItem}>
              <div className={styles.userDetailsContainer}>
                <div className={styles.userDetailsProfile}>
                  <Avatar
                    data-qa-anchor="user_avatar_view"
                    size="small"
                    avatar={reaction.user?.avatar?.fileUrl}
                  />
                  <Typography.BodyBold data-qa-anchor="user_display_name">
                    {reaction.user?.displayName}
                  </Typography.BodyBold>
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
                    <FallbackReaction className={styles.reactionIcon} />
                  )}
                </div>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};
