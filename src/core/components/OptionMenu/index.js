import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { POSITION_BOTTOM, POSITION_RIGHT } from '~/helpers/getCssPosition';

import UiKitDropdown from '~/core/components/Dropdown';

import { OptionsIcon, OptionsButton, Option, Container } from './styles';

const Trigger = ({ className, open, icon }) => (
  <OptionsButton className={className} onClick={open}>
    {icon || <OptionsIcon />}
  </OptionsButton>
);

const OptionMenu = ({
  className,
  icon,
  options,
  position = POSITION_BOTTOM,
  align = POSITION_RIGHT,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const attachCanceling = fn => () => {
    close();
    fn && fn();
  };

  return (
    <Container>
      <UiKitDropdown
        isOpen={isOpen}
        trigger={<Trigger className={className} open={open} icon={icon} />}
        position={position}
        align={align}
        handleClose={() => setIsOpen(false)}
      >
        {options.map(({ name, action }) => (
          <Option key={name} onClick={attachCanceling(action)}>
            <FormattedMessage id={name} />
          </Option>
        ))}
      </UiKitDropdown>
    </Container>
  );
};

export default OptionMenu;
