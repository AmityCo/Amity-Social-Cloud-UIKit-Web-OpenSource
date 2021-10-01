import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '~/core/components/Button';
import ConditionalRender from '~/core/components/ConditionalRender';
import { ChevronDown } from '~/icons';

import useActiveElement from '~/core/hooks/useActiveElement';
import useElementSize from '~/core/hooks/useElementSize';
import useObserver from '~/core/hooks/useObserver';
import { POSITION_TOP, POSITION_BOTTOM, POSITION_LEFT } from '~/helpers/getCssPosition';

import { DropdownContainer, Frame, FrameContainer, ButtonContainer } from './styles';

const SCROLLABLE_HEIGHT = 200;

const triggerRenderer = props => {
  return (
    <Button {...props}>
      <ChevronDown />
    </Button>
  );
};

const Dropdown = ({
  'data-qa-anchor': dataQaAnchor,
  isOpen,
  renderTrigger = triggerRenderer,
  children,
  position = POSITION_BOTTOM,
  align = POSITION_LEFT,
  handleClose,
  // if true, Frame will have width of Trigger
  fullSized = false,
  scrollable = false,
  scrollableHeight = SCROLLABLE_HEIGHT,
  // we calculate re-position relatively to parentContainer (document.body by default)
  parentContainer = null,
  disabled = false,
  className = '',
}) => {
  const [isOpenInternal, setIsOpenInternal] = useState(isOpen);
  const [currentPosition, setCurrentPosition] = useState(position);

  const [dropdownRef, isActiveElement] = useActiveElement(isOpen);
  const [buttonContainerRef, buttonContainerHeight] = useElementSize();

  const close = () => (handleClose ? isOpen && handleClose() : setIsOpenInternal(false));

  const entry = useObserver(dropdownRef.current, {
    root: parentContainer,
    rootMargin:
      parentContainer &&
      `0px 0px -${Math.ceil(
        (scrollableHeight * 100) /
          (parentContainer?.getBoundingClientRect()?.height - buttonContainerHeight),
      )}% 0px`,
  });

  const defaultTriggerParams = {
    onClick: () => setIsOpenInternal(!isOpenInternal),
    disabled,
  };

  // handling close on click outside
  useEffect(() => {
    !isActiveElement && close();
  }, [isActiveElement]);

  // sync internal state
  useEffect(() => {
    setIsOpenInternal(isOpen);
  }, [isOpen]);

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
    <DropdownContainer ref={dropdownRef} className={className}>
      <ButtonContainer ref={buttonContainerRef}>
        {renderTrigger({ ...defaultTriggerParams, 'data-qa-anchor': dataQaAnchor })}
      </ButtonContainer>
      <ConditionalRender condition={isOpen || isOpenInternal}>
        <FrameContainer>
          <Frame
            position={currentPosition}
            align={align}
            fullSized={fullSized}
            scrollable={scrollable}
            scrollableHeight={scrollableHeight}
          >
            {children}
          </Frame>
        </FrameContainer>
      </ConditionalRender>
    </DropdownContainer>
  );
};

Dropdown.propTypes = {
  'data-qa-anchor': PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  renderTrigger: PropTypes.func,
  children: PropTypes.node,
  position: PropTypes.string,
  align: PropTypes.string,
  handleClose: PropTypes.func,
  fullSized: PropTypes.bool,
  scrollable: PropTypes.bool,
  scrollableHeight: PropTypes.number,
  parentContainer: PropTypes.instanceOf(Element),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Dropdown;
