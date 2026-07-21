import clsx from 'clsx';
import { forwardRef, type ReactNode } from 'react';
import { Switch as AriaSwitch } from 'react-aria-components';
import styles from './Toggle.module.css';

export type ToggleProps = {
  isOn: boolean;
  isDisabled?: boolean;
  icon?: ReactNode;
  onChange?: (isOn: boolean) => void;
  className?: string;
  'aria-label'?: string;
};

export const Toggle = forwardRef<HTMLLabelElement, ToggleProps>(function Toggle(
  { isOn, isDisabled = false, icon, onChange, className, ...props },
  ref,
) {
  return (
    <AriaSwitch
      {...props}
      ref={ref}
      isSelected={isOn}
      isDisabled={isDisabled}
      onChange={onChange}
      className={clsx(styles.toggle, icon && styles['toggle--icon'], className)}
    >
      <span className={styles.toggle__thumb}>
        {icon ? <span className={styles.toggle__icon}>{icon}</span> : null}
      </span>
    </AriaSwitch>
  );
});
