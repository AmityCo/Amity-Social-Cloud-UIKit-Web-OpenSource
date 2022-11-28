import React from 'react';

import { Box, Switch, SwitchProps, Text, FormLabel } from '@noom/wax-component-library';

export type SwitchSettingProps = {
  label: string | React.ReactNode;
  name: string;
  helper?: string;
  isChecked?: boolean;
  onChange: (isChecked: boolean) => void;
  size?: SwitchProps['size'];
  isDisabled?: SwitchProps['isDisabled'];
};

export function SwitchSetting({
  name,
  label,
  helper,
  isChecked,
  onChange,
  size,
  isDisabled,
}: SwitchSettingProps) {
  const handleChange = () => {
    if (!isDisabled) {
      onChange(!isChecked);
    }
  };

  return (
    <Box display="flex" flexDir="row" cursor={!isDisabled ? 'pointer' : 'auto'}>
      <Box display="flex" flexDir="column" flex={1} mr={2}>
        <FormLabel
          htmlFor={name}
          m={0}
          noOfLines={1}
          title={typeof label === 'string' ? label : ''}
        >
          {label}
        </FormLabel>

        <Text noOfLines={2}>{helper}</Text>
      </Box>
      <Box display="flex" alignItems="center">
        <Switch
          size={size}
          name={name}
          onChange={handleChange}
          isChecked={isChecked}
          isDisabled={isDisabled}
          colorScheme="primary"
        />
      </Box>
    </Box>
  );
}
