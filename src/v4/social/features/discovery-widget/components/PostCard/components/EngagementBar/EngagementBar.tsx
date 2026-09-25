import { useMemo } from 'react';
import millify from 'millify';
import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import styles from './EngagementBar.module.css';

type EngagementBarProps = {
  post: Amity.Post;
};

export function EngagementBar({ post }: EngagementBarProps) {
  const { socialReactions } = useCustomReaction();

  const reactions = post.reactions ?? {};
  const reactionsCount = post.reactionsCount ?? 0;
  const commentsCount = post.commentsCount ?? 0;

  const reactionCountPlural = useString('amity_social_label_reaction_count_plural');
  const commentCountPlural = useString('amity_social_button_feed_comment_count_plural');
  const commentCountSingular = useString('amity_social_button_feed_comment_count_singular');

  const configuredNames = useMemo(
    () => socialReactions.map((reaction) => reaction.name),
    [socialReactions],
  );

  const sortedReactions = useMemo(() => {
    const configured = socialReactions
      .filter((reaction) => (reactions[reaction.name] ?? 0) > 0)
      .sort(
        (a, b) =>
          (reactions[b.name] ?? 0) - (reactions[a.name] ?? 0) || a.name.localeCompare(b.name),
      )
      .map((reaction) => ({ type: 'configured' as const, reaction }));

    const unknown = Object.keys(reactions)
      .filter((name) => !configuredNames.includes(name) && (reactions[name] ?? 0) > 0)
      .map((name) => ({ type: 'unknown' as const, name }));

    return [...configured, ...unknown];
  }, [socialReactions, configuredNames, reactions]);

  const reactionLabel = reactionCountPlural.replace('%@', millify(reactionsCount));
  const commentLabel = (commentsCount === 1 ? commentCountSingular : commentCountPlural).replace(
    '%d',
    millify(commentsCount),
  );

  return (
    <div className={styles.cardEngagementBar}>
      <div className={styles.cardEngagementBar__reactions}>
        {reactionsCount > 0 ? (
          <>
            <div className={styles.cardEngagementBar__reactionIcons}>
              {sortedReactions.map((item) =>
                item.type === 'configured' ? (
                  <img
                    key={item.reaction.name}
                    src={item.reaction.image}
                    alt=""
                    aria-hidden="true"
                    className={styles.cardEngagementBar__reactionIcon}
                  />
                ) : (
                  <FallbackReaction
                    key={item.name}
                    aria-hidden="true"
                    className={styles.cardEngagementBar__reactionIcon}
                  />
                ),
              )}
            </div>
            <Typography.Caption className={styles.cardEngagementBar__count}>
              {millify(reactionsCount)}
            </Typography.Caption>
          </>
        ) : (
          <Typography.Caption className={styles.cardEngagementBar__count}>
            {reactionLabel}
          </Typography.Caption>
        )}
      </div>
      <Typography.Caption className={styles.cardEngagementBar__count}>
        {commentLabel}
      </Typography.Caption>
    </div>
  );
}
