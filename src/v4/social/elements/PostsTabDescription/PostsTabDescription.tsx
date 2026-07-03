import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './PostsTabDescription.module.css';
import { Typography } from '~/v4/core/components';

type PostsTabDescriptionProps = {
  pageId?: string;
  componentId?: string;
};

export const PostsTabDescription = ({
  pageId = '*',
  componentId = '*',
}: PostsTabDescriptionProps) => {
  const elementId = 'posts_tab_description';
  const { config, accessibilityId, themeStyles, resolveText } = useAmityElement({
    elementId,
    componentId,
    pageId,
  });

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.postsTabDescription}>
      <Typography.Caption className={styles.postsTabDescription__text}>
        {resolveText('amity_social_button_decline_pending_post_will_permanently_delete_the_select')}
      </Typography.Caption>
    </div>
  );
};
