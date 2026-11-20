import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { Toggle } from '~/v4/core/design/atoms/Toggle';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BackButton } from '~/v4/social/elements/BackButton';
import { Title } from '~/v4/social/elements/Title';
import { useFeedVideoAutoplay } from '~/v4/social/features/feed-video-autoplay';
import styles from './AutoplaySetting.module.css';

type AutoplaySettingProps = {
  pageId: string;
};

export function AutoplaySetting({ pageId }: AutoplaySettingProps) {
  const { onBack } = useNavigation();
  const { isDesktop } = useResponsive();
  const { isMemberAutoplayOn, setMemberAutoplayOn } = useFeedVideoAutoplay();
  const label = useString('amity_social_autoplay_setting_row');
  const description = useString('amity_social_autoplay_setting_web_description');

  return (
    <div className={styles.autoplaySetting}>
      <div className={styles.autoplaySetting__header}>
        <BackButton pageId={pageId} onPress={() => onBack()} />
        <Title
          pageId={pageId}
          variant={isDesktop ? 'headline' : 'title'}
          textKey="amity_social_autoplay_setting_row"
          titleClassName={styles.autoplaySetting__title}
        />
        <span className={styles.autoplaySetting__headerSpacer} aria-hidden="true" />
      </div>
      <div className={styles.autoplaySetting__row}>
        <div className={styles.autoplaySetting__text}>
          <Typography.BodyBold className={styles.autoplaySetting__label}>
            {label}
          </Typography.BodyBold>
          <Typography.Caption className={styles.autoplaySetting__description}>
            {description}
          </Typography.Caption>
        </div>
        <Toggle
          className={styles.autoplaySetting__toggle}
          isOn={isMemberAutoplayOn}
          onChange={setMemberAutoplayOn}
          aria-label={label}
          data-testid="autoplay_setting/switch"
          data-state={isMemberAutoplayOn ? 'on' : 'off'}
        />
      </div>
    </div>
  );
}
