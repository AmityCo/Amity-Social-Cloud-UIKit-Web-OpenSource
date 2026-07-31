import { createElement } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { ChevronRight } from '~/v4/core/design/icons/ChevronRight';
import styles from './SettingMenu.module.css';

type SettingMenuProps = {
  icon?: React.ElementType;
  label: string;
  trailingText?: string;
  destructive?: boolean;
  ariaLabel?: string;
  onPress: () => void;
};

export function SettingMenu({
  icon,
  label,
  trailingText,
  destructive = false,
  ariaLabel,
  onPress,
}: SettingMenuProps) {
  return (
    <AriaButton
      type="button"
      className={styles.settingMenu}
      onPress={onPress}
      data-destructive={destructive ? 'true' : 'false'}
      aria-label={ariaLabel ?? label}
    >
      {destructive ? (
        <Typography.BodyBold className={styles.settingMenu__destructiveLabel}>
          {label}
        </Typography.BodyBold>
      ) : (
        <>
          <span className={styles.settingMenu__leading}>
            {icon && (
              <span className={styles.settingMenu__iconBadge}>
                {createElement(icon, { className: styles.settingMenu__icon })}
              </span>
            )}
            <Typography.Body className={styles.settingMenu__label}>{label}</Typography.Body>
          </span>
          <span className={styles.settingMenu__trailing}>
            {trailingText && (
              <Typography.Body className={styles.settingMenu__trailingText}>
                {trailingText}
              </Typography.Body>
            )}
            <ChevronRight className={styles.settingMenu__chevron} />
          </span>
        </>
      )}
    </AriaButton>
  );
}
