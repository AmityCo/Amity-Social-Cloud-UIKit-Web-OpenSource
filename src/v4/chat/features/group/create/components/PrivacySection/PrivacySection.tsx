import { RadioGroup } from '~/v4/core/components/AriaRadioGroup/RadioGroup';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import World from '~/v4/icons/World';
import { Lock } from '~/v4/icons/Lock';
import styles from './PrivacySection.module.css';

type PrivacySectionProps = {
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
};

export function PrivacySection({ isPublic, onChange }: PrivacySectionProps) {
  const privacyLabel = useString('amity_chat_privacy_label');
  const publicTitle = useString('amity_chat_create_group_public_title');
  const publicDesc = useString('amity_chat_create_group_public_subtitle');
  const privateTitle = useString('amity_chat_create_group_private_title');
  const privateDesc = useString('amity_chat_create_group_private_subtitle');
  const privacyWarning = useString('amity_chat_privacy_warning');
  const selected = isPublic ? 'public' : 'private';

  return (
    <section className={styles.privacySection}>
      <Typography.TitleBold className={styles.privacySection__heading}>
        {privacyLabel}
      </Typography.TitleBold>
      <RadioGroup
        value={selected}
        onChange={(value) => onChange(value === 'public')}
        className={styles.privacySection__group}
        radioContainerClassname={styles.privacySection__options}
        radioProps={{ className: styles.privacySection__optionRow }}
        radios={[
          {
            value: 'public',
            label: (
              <PrivacyRow
                icon={<World className={styles.privacySection__icon} />}
                title={publicTitle}
                description={publicDesc}
              />
            ),
          },
          {
            value: 'private',
            label: (
              <PrivacyRow
                icon={<Lock className={styles.privacySection__icon} />}
                title={privateTitle}
                description={privateDesc}
              />
            ),
          },
        ]}
      />
      <div className={styles.privacySection__banner}>
        <Typography.Caption className={styles.privacySection__bannerText}>
          {privacyWarning}
        </Typography.Caption>
      </div>
    </section>
  );
}

type PrivacyRowProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function PrivacyRow({ icon, title, description }: PrivacyRowProps) {
  return (
    <div className={styles.privacySection__row}>
      <div className={styles.privacySection__iconCircle}>{icon}</div>
      <div className={styles.privacySection__text}>
        <Typography.BodyBold className={styles.privacySection__title}>{title}</Typography.BodyBold>
        <Typography.Caption className={styles.privacySection__description}>
          {description}
        </Typography.Caption>
      </div>
    </div>
  );
}

PrivacySection.Row = PrivacyRow;
