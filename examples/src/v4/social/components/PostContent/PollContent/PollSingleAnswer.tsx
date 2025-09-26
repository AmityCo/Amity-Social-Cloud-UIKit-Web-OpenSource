import React, { FC, useState } from 'react';
import styles from './PollContent.module.css';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup';
import { Typography } from '~/v4/core/components';
import clsx from 'clsx';

type PollSingleAnswerProps = {
  caption: string;
  disabled?: boolean;
  answers: (Amity.PollAnswer & { isTopVoted: boolean })[];
  onAnswerChanged?: (answer: string) => void;
};

export const PollSingleAnswer: FC<PollSingleAnswerProps> = ({
  caption,
  answers,
  disabled = false,
  onAnswerChanged,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const handleAnswerChange = (value: string) => {
    setSelected(value);
    onAnswerChanged?.(value);
  };

  return (
    <RadioGroup
      onChange={handleAnswerChange}
      value={selected}
      labelClassName={styles.pollContent__pollLabel}
      label={<Typography.CaptionBold>{caption}</Typography.CaptionBold>}
      radioProps={{
        className: clsx(
          styles.pollContent__formRadio,
          disabled ? styles.pollContent__formRadio__disabled : '',
        ),
        isDisabled: disabled,
      }}
      radios={answers.map((answer) => ({
        value: answer.id,
        label: <Typography.BodyBold>{answer.data}</Typography.BodyBold>,
      }))}
    />
  );
};
