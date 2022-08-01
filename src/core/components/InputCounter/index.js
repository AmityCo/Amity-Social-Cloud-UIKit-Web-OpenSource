import React, { useState } from 'react';

import { CounterContainer, ResultContainer, CircleButton, MinusIcon, PlusIcon } from './styles';

export const COUNTER_VALUE_PLACEHOLDER = '{counter}';

const DefaultButtonRenderer = ({ icon = null, onClick, disabled }) => {
  return (
    <CircleButton disabled={disabled} onClick={onClick}>
      {icon}
    </CircleButton>
  );
};

const DefaultResultRenderer = ({ output = '' }) => <ResultContainer>{output}</ResultContainer>;

const InputCounter = ({
  // decrease counter
  renderDecButton = DefaultButtonRenderer,
  // increase counter
  renderIncButton = DefaultButtonRenderer,
  // counter output
  renderResult = DefaultResultRenderer,
  resultFormat = '{counter}',
  defaultValue = 0,
  onChange,
  onlyPositiveNumber = true,
  minValue,
  maxValue,
}) => {
  const [counter, setCounter] = useState(defaultValue);

  return (
    <CounterContainer>
      {renderDecButton({
        onClick: (e) => {
          e.preventDefault();
          const newValue = minValue ? Math.max(counter - 1, minValue) : minValue;
          setCounter(newValue);
          onChange(newValue);
        },
        icon: <MinusIcon />,
        disabled: onlyPositiveNumber && counter - 1 < 0,
      })}
      {renderResult({ output: resultFormat.replace(COUNTER_VALUE_PLACEHOLDER, counter) })}
      {renderIncButton({
        onClick: (e) => {
          e.preventDefault();
          const newValue = maxValue ? Math.min(counter + 1, maxValue) : maxValue;
          setCounter(newValue);
          onChange(newValue);
        },
        icon: <PlusIcon />,
      })}
    </CounterContainer>
  );
};

export default InputCounter;
