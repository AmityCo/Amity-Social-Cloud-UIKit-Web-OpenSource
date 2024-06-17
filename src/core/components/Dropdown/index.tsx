import React, { useState, useEffect, useCallback, MutableRefObject } from 'react';

import Button from '~/core/components/Button';
import { ChevronDown } from '~/icons';
import useActiveElement from '~/core/hooks/useActiveElement';
import useElementSize from '~/core/hooks/useElementSize';
import useObserver from '~/core/hooks/useObserver';
import { POSITION_TOP, POSITION_BOTTOM, POSITION_LEFT } from '~/helpers/getCssPosition';
import { DropdownContainer, Frame, FrameContainer, ButtonContainer } from './styles';

const SCROLLABLE_HEIGHT = 200;

export const useDropdown = ({
  parentContainer,
  dropdownRef,
  align = POSITION_LEFT,
  scrollableHeight = SCROLLABLE_HEIGHT,
  position = POSITION_BOTTOM,
  buttonContainerHeight,
}: {
  scrollableHeight?: number;
  position?: string;
  align?: string;
  dropdownRef: MutableRefObject<HTMLElement | null>;
  parentContainer?: Element | null;
  buttonContainerHeight: number;
}) => {
  const [currentPosition, setCurrentPosition] = useState(position);
  const entry = useObserver(dropdownRef.current, {
    root: parentContainer,
    rootMargin: parentContainer
      ? `0px 0px -${Math.ceil(
          (scrollableHeight * 100) /
            (parentContainer.getBoundingClientRect().height - buttonContainerHeight),
        )}% 0px`
      : undefined,
  });

  // handling reposition for dropdown list
  useEffect(() => {
    if (entry?.isIntersecting === false) {
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
  }, [entry, position]);

  return {
    align,
    currentPosition,
    scrollableHeight,
  };
};

const triggerRenderer: DropdownProps['renderTrigger'] = (props) => {
  return (
    <Button {...props}>
      <ChevronDown height={14} width={14} />
    </Button>
  );
};

interface DropdownProps {
  'data-qa-anchor'?: string;
  isOpen?: boolean;
  renderTrigger?: (props: {
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    disabled: boolean;
    'data-qa-anchor': string;
  }) => React.ReactNode;
  children?: React.ReactNode;
  position?: string;
  align?: string;
  handleClose?: () => void;
  fullSized?: boolean;
  scrollable?: boolean;
  scrollableHeight?: number;
  parentContainer?: Element | null;
  disabled?: boolean;
  className?: string;
}

const Dropdown = ({
  'data-qa-anchor': dataQaAnchor = '',
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
}: DropdownProps) => {
  const [isOpenInternal, setIsOpenInternal] = useState(isOpen);
  const [currentPosition, setCurrentPosition] = useState(position);

  const [dropdownRef, isActiveElement] = useActiveElement(isOpen);
  const [buttonContainerRef, buttonContainerHeight] = useElementSize();

  const close = useCallback(() => {
    if (handleClose) {
      if (isOpen) {
        handleClose();
      }
    } else {
      setIsOpenInternal(false);
    }
  }, [handleClose, isOpen]);

  const entry = useObserver(dropdownRef.current, {
    root: parentContainer,
    rootMargin: parentContainer
      ? `0px 0px -${Math.ceil(
          (scrollableHeight * 100) /
            (parentContainer.getBoundingClientRect().height - buttonContainerHeight),
        )}% 0px`
      : undefined,
  });

  const defaultTriggerParams = {
    onClick: () => setIsOpenInternal(!isOpenInternal),
    disabled,
  };

  // handling close on click outside
  useEffect(() => {
    if (!isActiveElement) {
      close();
    }
  }, [close, isActiveElement]);

  // sync internal state
  useEffect(() => {
    setIsOpenInternal(isOpen);
  }, [isOpen]);

  // handling reposition for dropdown list
  useEffect(() => {
    if (entry?.isIntersecting === false) {
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
  }, [entry, position]);

  return (
    <DropdownContainer ref={dropdownRef} className={className}>
      <ButtonContainer ref={buttonContainerRef}>
        {renderTrigger({ ...defaultTriggerParams, 'data-qa-anchor': dataQaAnchor })}
      </ButtonContainer>
      {(isOpen || isOpenInternal) && (
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
      )}
    </DropdownContainer>
  );
};

export default Dropdown;
