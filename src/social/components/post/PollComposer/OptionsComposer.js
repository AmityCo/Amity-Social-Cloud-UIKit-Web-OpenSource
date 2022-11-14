import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 } from 'uuid';
import { PollDataType } from '@amityco/js-sdk';

import {
  OptionsComposerContainer,
  OptionItemContainer,
  OptionInput,
  CloseIcon,
  CloseButton,
  OptionInputContainer,
  Counter,
  TitleContainer,
} from './styles';
import { PlusIcon } from '~/social/components/UserInfo/styles';
import Button from '~/core/components/Button';

const MAX_OPTION_TEXT_LENGTH = 200;

const OptionItem = ({ option, removeOption, updateOption }) => {
  const [text, setText] = useState(option.text);
  const handleChange = (e) => {
    setText(e.target.value);
    updateOption(e.target.value);
  };

  return (
    <OptionItemContainer>
      <OptionInputContainer>
        <OptionInput value={text} maxLength={MAX_OPTION_TEXT_LENGTH} onChange={handleChange} />
        <Counter>{`${text.length}/${MAX_OPTION_TEXT_LENGTH}`}</Counter>
      </OptionInputContainer>
      <CloseButton onClick={removeOption}>
        <CloseIcon height={16} />
      </CloseButton>
    </OptionItemContainer>
  );
};

const OptionsComposer = ({ onChange, optionsLimit }) => {
  const [internalOptions, setInternalOptions] = useState([]);

  const addOptionEnabled = !optionsLimit || (optionsLimit && internalOptions.length < optionsLimit);

  const handleChange = (values) => {
    onChange(
      values.map(({ text: optionText }) => ({
        dataType: PollDataType.Text,
        data: optionText,
      })),
    );
  };

  const addOption = () => {
    if (addOptionEnabled) {
      const newValue = [
        ...internalOptions,
        {
          text: '',
          id: v4(),
        },
      ];

      setInternalOptions(newValue);
      handleChange(newValue);
    }
  };

  const updateOption = (id, text) => {
    const newValue = internalOptions.map((opt) => (opt.id === id ? { ...opt, text } : opt));
    setInternalOptions(newValue);
    handleChange(newValue);
  };

  const removeOption = (id) => {
    const index = internalOptions.findIndex((option) => option.id === id);
    const newValue = [...internalOptions.slice(0, index), ...internalOptions.slice(index + 1)];

    setInternalOptions(newValue);
    handleChange(newValue);
  };

  return (
    <OptionsComposerContainer>
      <TitleContainer>
        <FormattedMessage id="options_composer.title" />
      </TitleContainer>
      {internalOptions.map((option) => (
        <OptionItem
          key={option.id}
          option={option}
          removeOption={() => removeOption(option.id)}
          updateOption={(text) => updateOption(option.id, text)}
        />
      ))}
      <div>
        <Button
          isFullWidth
          disabled={!addOptionEnabled}
          onClick={(e) => {
            e.preventDefault();
            addOption();
          }}
        >
          <PlusIcon /> <FormattedMessage id="options_composer.button.add" />
        </Button>
      </div>
    </OptionsComposerContainer>
  );
};

export default OptionsComposer;
