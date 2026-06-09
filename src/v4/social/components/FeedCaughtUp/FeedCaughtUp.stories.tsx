import { FeedCaughtUp } from './FeedCaughtUp';

export default {
  title: 'v4-social/components/FeedCaughtUp',
};

export const FeedCaughtUpStory = {
  render: () => {
    return <FeedCaughtUp pageId="social_home_page" onSwitchRequested={() => {}} />;
  },

  name: 'FeedCaughtUp',
};
