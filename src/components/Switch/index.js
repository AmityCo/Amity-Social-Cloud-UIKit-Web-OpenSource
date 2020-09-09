import React from 'react';
import { SwitchLabel, SwitchInput, SwitchSlider } from './styles';

const Switch = ({ value, onChange }) => (
  <SwitchLabel>
    <SwitchInput type="checkbox" value={value} onChange={onChange} />
    <SwitchSlider />
  </SwitchLabel>
);

export default Switch;
