import { sortPollAnswers } from '~/v4/social/features/content-widget/utils';
import { getTotalVoteCount, getVotePercentage } from '~/v4/social/features/shared/utils';
import {
  POLL_TEXT_OPTIONS_VISIBLE,
  POLL_IMAGE_OPTIONS_VISIBLE,
} from '~/v4/social/features/content-widget/constants';
import { TextOption } from './components/TextOption';
import { ImageOption } from './components/ImageOption';
import { Footer } from './components/Footer';
import styles from './Poll.module.css';

type PollProps = {
  post: Amity.Post;
};

export function Poll({ post }: PollProps) {
  const pollChild = (post.childrenPosts ?? []).find((child) => child.dataType === 'poll') as
    | Amity.Post<'poll'>
    | undefined;

  const poll = pollChild?.getPollInfo();

  if (!poll) return null;

  const answers = poll.answers ?? [];

  const isImageLayout = answers[0]?.dataType === 'image';

  const totalVoteCount = getTotalVoteCount(answers);

  const isEnded = poll.status === 'closed';

  const sorted = sortPollAnswers(answers);

  const visibleCount = isImageLayout ? POLL_IMAGE_OPTIONS_VISIBLE : POLL_TEXT_OPTIONS_VISIBLE;

  const visible = sorted.slice(0, visibleCount);

  return (
    <div className={styles.widgetPoll}>
      <div className={styles.widgetPoll__options} data-layout={isImageLayout ? 'image' : 'text'}>
        {visible.map((answer) => {
          const percentage = getVotePercentage(answer.voteCount, totalVoteCount);
          return isImageLayout ? (
            <ImageOption key={answer.id} answer={answer} percentage={percentage} />
          ) : (
            <TextOption key={answer.id} answer={answer} percentage={percentage} />
          );
        })}
      </div>
      <Footer voteCount={totalVoteCount} isEnded={isEnded} closedInMs={poll.closedIn} />
    </div>
  );
}
