import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '~/core/components/Button';
import ConditionalRender from '~/core/components/ConditionalRender';
import { ChevronDown } from '~/icons';

import useActiveElement from '~/core/hooks/useActiveElement';
import useElementHeight from '~/core/hooks/useElementHeight';
import useObserver from '~/core/hooks/useObserver';
import { POSITION_TOP, POSITION_BOTTOM, POSITION_LEFT } from '~/helpers/getCssPosition';

import { DropdownContainer, Frame, FrameContainer, ButtonContainer } from './styles';

const Dropdown = ({
  isOpen,
  trigger,
  children,
  position = POSITION_BOTTOM,
  align = POSITION_LEFT,
  // we use handleClose to handle special cases: in current flow for close on click outside
  handleClose,
}) => {
  const [isOpenInternal, setIsOpenInternal] = useState(isOpen);
  const [currentPosition, setCurrentPosition] = useState(position);

  const [dropdownRef, isActiveElement] = useActiveElement(isOpen);
  const [buttonContainerRef, buttonContainerHeight] = useElementHeight();
  const entry = useObserver(dropdownRef.current);

  // handling close on click outside
  useEffect(() => {
    if (!isActiveElement) {
      if (handleClose) {
        isOpen && handleClose();
      } else {
        setIsOpenInternal(false);
      }
    }
  }, [isActiveElement]);

  // handling reposition for dropdown list
  useEffect(() => {
    if (entry.isIntersecting === false) {
      // handling vertical re-position
      if (entry.boundingClientRect?.top < 0) {
        setCurrentPosition(POSITION_BOTTOM);
      } else {
        setCurrentPosition(POSITION_TOP);
      }
    } else {
      // reset to default
      setCurrentPosition(position);
    }
  }, [entry]);

  return (
    <DropdownContainer ref={dropdownRef}>
      <ButtonContainer ref={buttonContainerRef}>
        <ConditionalRender condition={trigger}>
          {trigger}
          <Button onClick={() => setIsOpenInternal(!isOpenInternal)}>
            <ChevronDown />
          </Button>
        </ConditionalRender>
      </ButtonContainer>
      <ConditionalRender condition={isOpen || isOpenInternal}>
        <FrameContainer>
          <Frame position={currentPosition} align={align} offset={buttonContainerHeight}>
            {children}
          </Frame>
        </FrameContainer>
      </ConditionalRender>
    </DropdownContainer>
  );
};

Dropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  trigger: PropTypes.instanceOf(React.Component),
  children: PropTypes.node,
  position: PropTypes.string,
  align: PropTypes.string,
  handleClose: PropTypes.func,
};

export default Dropdown;
