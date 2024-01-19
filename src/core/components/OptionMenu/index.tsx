import React, { ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  POSITION_BOTTOM,
  POSITION_LEFT,
  POSITION_RIGHT,
  POSITION_TOP,
} from '~/helpers/getCssPosition';
import UiKitDropdown from '~/core/components/Dropdown';
import { OptionsIcon, OptionsButton, Option, Container } from './styles';

export interface OptionMenuProps {
  className?: string;
  'data-qa-anchor'?: string;
  icon?: ReactNode;
  options?: {
    name: string;
    action?: () => void;
    className?: string;
  }[];
  position?:
    | typeof POSITION_BOTTOM
    | typeof POSITION_RIGHT
    | typeof POSITION_LEFT
    | typeof POSITION_TOP;
  align?:
    | typeof POSITION_BOTTOM
    | typeof POSITION_RIGHT
    | typeof POSITION_LEFT
    | typeof POSITION_TOP;
  pullRight?: boolean;
}

const OptionMenu: React.FC<OptionMenuProps> = ({
  className = '',
  'data-qa-anchor': dataQaAnchor = '',
  icon,
  options,
  position = POSITION_BOTTOM,
  align = POSITION_RIGHT,
  pullRight = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const attachCanceling = (fn?: () => void) => () => {
    close();
    fn && fn();
  };

  if (!options || options.length === 0) return null;

  return (
    <Container className={className} pullRight={pullRight}>
      <UiKitDropdown
        data-qa-anchor={dataQaAnchor}
        isOpen={isOpen}
        renderTrigger={(props) => (
          <OptionsButton {...props} onClick={toggle} className={className} icon={icon}>
            {icon || <OptionsIcon />}
          </OptionsButton>
        )}
        position={position}
        align={align}
        handleClose={() => setIsOpen(false)}
      >
        {options.map(({ name, action, className: optionClassName }) => (
          <Option
            key={name}
            data-qa-anchor={`${dataQaAnchor}-${name}`}
            className={optionClassName}
            onClick={attachCanceling(action)}
          >
            {name}
          </Option>
        ))}
      </UiKitDropdown>
    </Container>
  );
};

export default OptionMenu;
