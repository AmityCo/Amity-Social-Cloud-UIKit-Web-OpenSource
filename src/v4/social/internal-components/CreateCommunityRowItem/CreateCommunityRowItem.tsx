import { Plus } from '~/v4/icons/Plus';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import styles from './CreateCommunityRowItem.module.css';

function CreateCommunityRowItem() {
  const { AmityMyCommunitiesComponentBehavior } = usePageBehavior();
  return (
    <Button
      variant="default"
      aria-label="Create new community"
      className={styles.createCommunityRowItem}
      onPress={() =>
        AmityMyCommunitiesComponentBehavior?.goToCommunitySetupPage?.({
          mode: AmityCommunitySetupPageMode.CREATE,
        })
      }
    >
      <span aria-hidden="true" className={styles.createCommunityRowItem__iconContainer}>
        <Plus className={styles.createCommunityRowItem__icon} />
      </span>
      <Typography.BodyBold className={styles.createCommunityRowItem__label}>
        {useString('amity_social_label_community_setup_create_title')}
      </Typography.BodyBold>
    </Button>
  );
}

export default CreateCommunityRowItem;
