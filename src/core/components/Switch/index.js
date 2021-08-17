import React, { useCallback } from 'react';
import { SwitchLabel, SwitchInput, SwitchSlider } from './styles';

const Switch = ({
  value = false,
  onChange = () => {},
  'data-qa-anchor': dataQaAnchor,
  ...props
}) => {
  const cb = useCallback(() => {
    onChange(!value);
  }, [value]);

  return (
    <SwitchLabel {...props} data-qa-anchor={dataQaAnchor}>
      <SwitchInput
        type="checkbox"
        value={value}
        checked={value}
        onChange={cb}
        data-qa-anchor={`${dataQaAnchor}-checkbox`}
      />
      <SwitchSlider />
    </SwitchLabel>
  );
};

export default Switch;
