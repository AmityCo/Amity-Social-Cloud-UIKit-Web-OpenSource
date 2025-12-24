import { RadioGroup } from '~/v4/core/components/AriaRadioGroup';
import styles from './RSVPButton.module.css';
import { AmityEventResponseStatus } from '@amityco/ts-sdk';
import { Typography } from '~/v4/core/components';

type UpdateStatusBottomSheetProps = {
  rsvp: Amity.EventResponse | undefined;
  onPressChangeStatus: (status: AmityEventResponseStatus) => void;
};

export const UpdateStatusBottomSheet = ({
  rsvp,
  onPressChangeStatus,
}: UpdateStatusBottomSheetProps) => {
  const RSVP_STATUS = [
    {
      label: 'Going',
      value: AmityEventResponseStatus.Going,
    },
    {
      label: 'Not Going',
      value: AmityEventResponseStatus.NotGoing,
    },
  ];

  return (
    <RadioGroup
      value={rsvp?.status}
      onChange={async (value: string) => {
        onPressChangeStatus(value as AmityEventResponseStatus);
      }}
      radios={RSVP_STATUS.map((option) => ({
        ...option,
        label: (
          <Typography.BodyBold className={styles.rsvpButton__radioLabel}>
            {option.label}
          </Typography.BodyBold>
        ),
      }))}
    />
  );
};
