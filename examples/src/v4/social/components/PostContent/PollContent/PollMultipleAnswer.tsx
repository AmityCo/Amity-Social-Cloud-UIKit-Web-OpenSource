import React, { FC, useState } from 'react';
import styles from './PollContent.module.css';
import { Typography } from '~/v4/core/components';
import clsx from 'clsx';
import { CheckboxGroup } from '~/v4/core/components/AriaCheckboxGroup/CheckboxGroup';

type PollMultipleAnswerProps = {
  caption: string;
  disabled?: boolean;
  answers: (Amity.PollAnswer & { isTopVoted: boolean })[];
  onAnswerChanged?: (answers: string[]) => void;
};

export const PollMultipleAnswer: FC<PollMultipleAnswerProps> = ({
  caption,
  answers,
  disabled = false,
  onAnswerChanged,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const handleAnswerChange = (value: string[]) => {
    setSelected(value);
    onAnswerChanged?.(value);
  };

  return (
    <CheckboxGroup
      onChange={handleAnswerChange}
      value={selected}
      labelClassName={styles.pollContent__pollLabel}
      label={<Typography.CaptionBold>{caption}</Typography.CaptionBold>}
      checkboxProps={{
        className: clsx(
          styles.pollContent__checkbox,
          disabled ? styles.pollContent__checkbox__disabled : '',
        ),
        isDisabled: disabled,
      }}
      checkboxes={answers.map((answer) => ({
        value: answer.id,
        label: <Typography.BodyBold>{answer.data}</Typography.BodyBold>,
      }))}
    />
  );
};
