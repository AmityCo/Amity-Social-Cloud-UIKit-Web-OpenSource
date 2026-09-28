import { Typography } from '~/v4/core/components';
import { Skeleton } from '~/v4/core/components/Skeleton';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { useString } from '~/v4/core/localization';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import ChevronRight from '~/v4/icons/ChevronRight';
import styles from './Heading.module.css';

type HeadingProps = {
  title?: string;
  showNavigation: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  isLoading?: boolean;
};

export function Heading({
  title,
  showNavigation,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  isLoading = false,
}: HeadingProps) {
  const previousLabel = useString('amity_social_button_previous');
  const nextLabel = useString('amity_social_button_next');

  return (
    <div className={styles.heading}>
      {isLoading ? (
        <Skeleton className={styles.heading__titleSkeleton}>
          <Skeleton.Square width="4.5rem" height="1rem" radius="0.75rem" />
        </Skeleton>
      ) : (
        <Typography.Headline as="p" className={styles.heading__title}>
          {title}
        </Typography.Headline>
      )}
      {showNavigation && (
        <div className={styles.heading__navigation}>
          <Button
            variant="default"
            className={styles.heading__navButton}
            aria-label={previousLabel}
            isDisabled={!canGoPrevious}
            onPress={onPrevious}
          >
            <ChevronLeft className={styles.heading__navIcon} />
          </Button>
          <Button
            variant="default"
            className={styles.heading__navButton}
            aria-label={nextLabel}
            isDisabled={!canGoNext}
            onPress={onNext}
          >
            <ChevronRight className={styles.heading__navIcon} />
          </Button>
        </div>
      )}
    </div>
  );
}
