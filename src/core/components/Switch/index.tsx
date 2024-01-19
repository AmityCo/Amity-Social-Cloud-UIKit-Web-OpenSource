import React, { useCallback } from 'react';
import { SwitchLabel, SwitchInput, SwitchSlider } from './styles';

interface SwitchProps {
  disabled?: boolean;
  value: boolean;
  onChange?: (value: boolean) => void;
  'data-qa-anchor'?: string;
}

const Switch = ({
  disabled,
  value,
  onChange = () => {},
  'data-qa-anchor': dataQaAnchor = '',
  ...props
}: SwitchProps) => {
  return (
    <SwitchLabel {...props} disabled={disabled} data-qa-anchor={`${dataQaAnchor}-label`}>
      <SwitchInput
        type="checkbox"
        checked={value}
        data-qa-anchor={`${dataQaAnchor}-switch`}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <SwitchSlider disabled={disabled} />
    </SwitchLabel>
  );
};

export default Switch;
