import { useString } from '~/v4/core/localization';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import { NoPage } from '~/v4/icons/NoPage';
import { Button } from '~/v4/core/components/AriaButton';
import clsx from 'clsx';
import styles from './FailedToShow.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

type FailedToShowProps = {
  pageId?: string;
  allowBack?: boolean;
  className?: string;
  onBack?: () => void;
};

export const FailedToShow = ({
  pageId = '*',
  className,
  onBack: $onBack,
  allowBack = true,
}: FailedToShowProps) => {
  const componentId = 'failed_to_show';
  const { onBack } = useNavigation();
  const { accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  return (
    <div data-testid={accessibilityId} className={clsx(styles.failedToShow, className)}>
      <IconComponent
        imgIcon={() => <NoPage className={styles.failedToShow__icon} />}
        defaultIcon={() => <NoPage className={styles.failedToShow__icon} />}
      />
      <Typography.Headline className={styles.failedToShow__title}>
        {useString('amity_social_label_livestream_deleted_page_title')}
      </Typography.Headline>
      <Typography.Body className={styles.failedToShow__desc}>
        {useString('amity_social_button_livestream_unavailable_desc')}
      </Typography.Body>
      {allowBack && (
        <Button
          onPress={() => ($onBack ? $onBack() : onBack())}
          className={styles.failedToShow__button}
        >
          <Typography.Body>{useString('amity_social_button_go_back')}</Typography.Body>
        </Button>
      )}
    </div>
  );
};
