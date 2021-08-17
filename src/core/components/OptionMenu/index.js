import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { POSITION_BOTTOM, POSITION_RIGHT } from '~/helpers/getCssPosition';

import UiKitDropdown from '~/core/components/Dropdown';
import ConditionalRender from '~/core/components/ConditionalRender';

import { OptionsIcon, OptionsButton, Option, Container } from './styles';

const OptionMenu = ({
  className,
  'data-qa-anchor': dataQaAnchor,
  icon,
  options,
  position = POSITION_BOTTOM,
  align = POSITION_RIGHT,
  pullRight = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const attachCanceling = fn => () => {
    close();
    fn && fn();
  };

  const triggerRenderer = props => {
    return <OptionsButton {...props}>{icon || <OptionsIcon />}</OptionsButton>;
  };

  return (
    <ConditionalRender condition={options.length}>
      <Container pullRight={pullRight}>
        <UiKitDropdown
          data-qa-anchor={dataQaAnchor}
          isOpen={isOpen}
          renderTrigger={props => triggerRenderer({ ...props, onClick: toggle, className, icon })}
          position={position}
          align={align}
          handleClose={() => setIsOpen(false)}
        >
          {options.map(({ name, action, className: optionClassName }) => (
            <Option key={name} onClick={attachCanceling(action)} className={optionClassName}>
              <FormattedMessage id={name} />
            </Option>
          ))}
        </UiKitDropdown>
      </Container>
    </ConditionalRender>
  );
};

export default OptionMenu;
