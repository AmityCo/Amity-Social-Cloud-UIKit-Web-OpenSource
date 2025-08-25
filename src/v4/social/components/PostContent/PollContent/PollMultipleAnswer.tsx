import React, { FC, useState } from 'react';
import styles from './PollContent.module.css';
import { Typography } from '~/v4/core/components';
import clsx from 'clsx';
import { CheckboxGroup } from '~/v4/core/components/AriaCheckboxGroup/CheckboxGroup';
import { ImagePollAnswer } from './ImagePollAnswer';

type PollMultipleAnswerProps = {
  caption: string;
  disabled?: boolean;
  answers: (Amity.PollAnswer & { isTopVoted: boolean })[];
  isOwner?: boolean;
  onAnswerChanged?: (answers: string[]) => void;
};

export const PollMultipleAnswer: FC<PollMultipleAnswerProps> = ({
  caption,
  answers,
  disabled = false,
  isOwner,
  onAnswerChanged,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const handleAnswerChange = (value: string[]) => {
    setSelected(value);
    onAnswerChanged?.(value);
  };

  const isImagePoll = answers?.[0]?.dataType === 'image';

  return (
    <CheckboxGroup
      onChange={handleAnswerChange}
      value={selected}
      labelClassName={styles.pollContent__pollLabel}
      optionContainerClassname={styles.pollContent__checkboxGroup}
      isImageOption={isImagePoll}
      label={<Typography.CaptionBold data-testid="poll-caption">{caption}</Typography.CaptionBold>}
      checkboxProps={{
        className: clsx(
          styles.pollContent__checkbox,
          disabled ? styles.pollContent__checkbox__disabled : '',
        ),
        isDisabled: disabled,
        checkboxIconClassname: isImagePoll ? styles.pollContent__imageCheckbox__icon : '',
      }}
      checkboxes={answers.map((answer) => ({
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
