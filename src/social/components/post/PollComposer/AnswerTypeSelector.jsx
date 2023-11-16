import React from 'react';
import { useIntl } from 'react-intl';
import { PollAnswerType } from '@amityco/js-sdk';

import { StyledSelect } from './styles';

const itemRenderer = ({ name }) => <div>{name}</div>;

const AnswerTypeSelector = ({ onChange, parentContainer = null }) => {
  const { formatMessage } = useIntl();

  const options = Object.values(PollAnswerType).map((answerType) => ({
    name: formatMessage({ id: 'select.answerType.item' }, { answerType }),
    value: answerType,
  }));

  return (
    <StyledSelect
      options={options}
      value={[options[0]]}
      parentContainer={parentContainer}
      renderItem={itemRenderer}
      onSelect={({ value }) => onChange(value)}
    />
  );
};

export default AnswerTypeSelector;
