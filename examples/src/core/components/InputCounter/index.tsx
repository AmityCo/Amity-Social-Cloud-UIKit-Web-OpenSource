import React, { useState } from 'react';

import { CounterContainer, ResultContainer, CircleButton, MinusIcon, PlusIcon } from './styles';

export const COUNTER_VALUE_PLACEHOLDER = '{counter}';

const DefaultButtonRenderer = ({ icon = null, onClick, disabled }: any) => {
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
}: any) => {
  const [counter, setCounter] = useState(defaultValue);

  return (
    <CounterContainer>
      {renderDecButton({
        onClick: (e: any) => {
          e.preventDefault();
          const newValue = counter - 1;
          setCounter(newValue);
          onChange(newValue);
        },
        icon: <MinusIcon />,
        disabled: onlyPositiveNumber && counter - 1 < 0,
      })}
      {renderResult({ output: resultFormat.replace(COUNTER_VALUE_PLACEHOLDER, counter) })}
      {renderIncButton({
        onClick: (e: any) => {
          e.preventDefault();
          const newValue = counter + 1;
          setCounter(newValue);
          onChange(newValue);
        },
        icon: <PlusIcon />,
      })}
    </CounterContainer>
  );
};

export default InputCounter;
