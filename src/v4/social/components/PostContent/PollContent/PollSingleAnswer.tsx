import React, { FC, useState } from 'react';
import styles from './PollContent.module.css';
import clsx from 'clsx';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup';
import { Typography } from '~/v4/core/components';
import { ImagePollAnswer } from './ImagePollAnswer';

type PollSingleAnswerProps = {
  caption: string;
  disabled?: boolean;
  answers: (Amity.PollAnswer & { isTopVoted: boolean })[];
  isOwner?: boolean;
  onAnswerChanged?: (answer: string) => void;
};

export const PollSingleAnswer: FC<PollSingleAnswerProps> = ({
  caption,
  answers,
  disabled = false,
  isOwner,
  onAnswerChanged,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const handleAnswerChange = (value: string) => {
    setSelected(value);
    onAnswerChanged?.(value);
  };

  const isImagePoll = answers?.[0]?.dataType === 'image';

  return (
    <RadioGroup
      onChange={handleAnswerChange}
      value={selected}
      radioContainerClassname={styles.pollContent__radioGroup}
      labelClassName={styles.pollContent__pollLabel}
      label={<Typography.CaptionBold>{caption}</Typography.CaptionBold>}
      radioProps={{
        className: clsx(
          styles.pollContent__formRadio,
          disabled ? styles.pollContent__formRadio__disabled : '',
        ),
        isDisabled: disabled,
      }}
      isImageOption={isImagePoll}
      radios={answers.map((answer) => ({
        value: answer.id,
        label: isImagePoll ? (
          <ImagePollAnswer
            fileId={answer.fileId}
            label={answer.data}
            isOwner={isOwner}
            isDisabled={disabled}
          />
        ) : (
          <Typography.BodyBold>{answer.data}</Typography.BodyBold>
        ),
      }))}
    />
  );
};
