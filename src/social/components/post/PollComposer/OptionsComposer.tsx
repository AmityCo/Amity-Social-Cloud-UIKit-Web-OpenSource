import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 } from 'uuid';

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

interface OptionItemProps {
  option: {
    text: string;
    id: string;
  };
  removeOption: () => void;
  updateOption: (text: string) => void;
}

const OptionItem = ({ option, removeOption, updateOption }: OptionItemProps) => {
  const [text, setText] = useState(option.text);
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setText(e.target.value);
    updateOption(e.target.value);
  };

  return (
    <OptionItemContainer>
      <OptionInputContainer>
        <OptionInput
          data-qa-anchor="poll-composer-option-item-input"
          value={text}
          maxLength={MAX_OPTION_TEXT_LENGTH}
          onChange={handleChange}
        />
        <Counter>{`${text.length}/${MAX_OPTION_TEXT_LENGTH}`}</Counter>
      </OptionInputContainer>
      <CloseButton data-qa-anchor="poll-composer-option-item-close-button" onClick={removeOption}>
        <CloseIcon height={16} />
      </CloseButton>
    </OptionItemContainer>
  );
};

type Option = {
  id: string;
  text: string;
};

interface OptionsComposerProps {
  onChange: (options: { dataType: string; data: string }[]) => void;
  optionsLimit?: number;
}

const OptionsComposer = ({ onChange, optionsLimit }: OptionsComposerProps) => {
  const [internalOptions, setInternalOptions] = useState<Option[]>([]);

  const addOptionEnabled = !optionsLimit || (optionsLimit && internalOptions.length < optionsLimit);

  const handleChange = (values: Option[]) => {
    onChange(
      values.map(({ text: optionText }) => ({
        dataType: 'text',
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

  const updateOption = (id: string, text: string) => {
    const newValue = internalOptions.map((opt) => (opt.id === id ? { ...opt, text } : opt));
    setInternalOptions(newValue);
    handleChange(newValue);
  };

  const removeOption = (id: string) => {
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
          data-qa-anchor="poll-composer-add-option-button"
          fullWidth
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
