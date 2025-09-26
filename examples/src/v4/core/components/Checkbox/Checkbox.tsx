import React from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  ariaLabel?: string; // Made required for accessibility when no visual label
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  name?: string;
  disabled?: boolean;
  error?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  ariaLabel, // Required for accessibility
  checked,
  onChange,
  id = `checkbox-${Math.random().toString(36).substr(2, 9)}`,
  name,
  disabled = false,
  error = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(event.target.checked);
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={handleChange}
        className={styles.checkbox}
        aria-label={ariaLabel} // Essential for accessibility
        disabled={disabled}
      />
      {/* This span will be the visual representation of the checkbox */}
      <span
        className={`${styles.customBox} ${disabled ? styles.disabled : ''} ${error ? styles.error : ''} ${checked ? styles.checked : ''}`}
      ></span>
    </div>
  );
};

export default Checkbox;
