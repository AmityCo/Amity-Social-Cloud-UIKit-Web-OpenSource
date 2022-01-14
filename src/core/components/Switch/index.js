import React, { useCallback } from 'react';
import { SwitchLabel, SwitchInput, SwitchSlider } from './styles';

const Switch = ({
  disabled = false,
  value = false,
  onChange = () => {},
  'data-qa-anchor': dataQaAnchor,
  ...props
}) => {
  const cb = useCallback(() => {
    onChange(!value);
  }, [value, onChange]);

  return (
    <SwitchLabel {...props} disabled={disabled} data-qa-anchor={dataQaAnchor}>
      <SwitchInput
        type="checkbox"
        value={value}
        checked={value}
        data-qa-anchor={`${dataQaAnchor}-checkbox`}
        onChange={cb}
      />
      <SwitchSlider disabled={disabled} />
    </SwitchLabel>
  );
};

export default Switch;
