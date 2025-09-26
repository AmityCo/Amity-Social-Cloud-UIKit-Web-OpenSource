import React from 'react';
import { useIntl } from 'react-intl';

import { StyledSelect } from './styles';

interface AnswerTypeSelectorProps {
  onChange: (value: string) => void;
  parentContainer?: HTMLElement | null;
}

const AnswerTypeSelector = ({ onChange, parentContainer = null }: AnswerTypeSelectorProps) => {
  const { formatMessage } = useIntl();

  const options = Object.values(['single', 'multiple']).map((answerType) => ({
    name: formatMessage({ id: 'select.answerType.item' }, { answerType }),
    value: answerType,
  }));

  return (
    <StyledSelect
      options={options}
      value={[options[0]]}
      parentContainer={parentContainer}
      renderItem={({ name }) => <div>{name}</div>}
      onSelect={({ value }) => onChange(value)}
    />
  );
};

export default AnswerTypeSelector;
