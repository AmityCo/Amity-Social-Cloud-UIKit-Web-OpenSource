import React, { useCallback } from 'react';
import { SwitchLabel, SwitchInput, SwitchSlider } from './styles';

const Switch = ({ value = false, onChange = () => {} }) => {
  const cb = useCallback(() => {
    onChange(!value);
  }, [value]);

  return (
    <SwitchLabel>
      <SwitchInput type="checkbox" value={value} checked={value} onChange={cb} />
      <SwitchSlider />
    </SwitchLabel>
  );
};

export default Switch;
