import { Plus } from '~/v4/icons/Plus';
import { Controller } from 'react-hook-form';
import { Button } from '~/v4/core/components/AriaButton';
import { FormLabel } from '~/v4/core/components/FormLabel';
import { CalendarDate, Time } from '@internationalized/date';
import { FormInput } from '~/v4/core/components/FormInput/FormInput';
import {
  EventSetupValues,
  useEventSetup,
} from '~/v4/social/features/events/EventSetup/hooks/useEventSetup';
import {
  Header,
  CoverImage,
  EndTime,
  Location,
  StartTime,
  TimeZone,
} from '~/v4/social/features/events/EventSetup/components';
import styles from './EventSetup.module.css';

export enum EventSetupMode {
  CREATE = 'create',
  EDIT = 'edit',
}

type CreateEventOptions = {
  targetId: string;
  targetName: string;
  mode: EventSetupMode.CREATE;
};

type EditEventOptions = {
  event: Amity.Event;
  mode: EventSetupMode.EDIT;
};

export type EventSetupProps = CreateEventOptions | EditEventOptions;

export const EventSetup = (props: EventSetupProps) => {
  const {
    values,
    isValid,
    control,
    isDirty,
    onSubmit,
    setValue,
    targetName,
    handleSubmit,
    isSubmitting,
    isCreateEvent,
    setDefaultEndOn,
  } = useEventSetup(props);

  return (
    <section className={styles.eventSetup}>
      <Header targetName={targetName} showDiscardPopup={isDirty} isCreateEvent={isCreateEvent} />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.eventSetup__form}>
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CoverImage value={value} onChange={onChange} />
          )}
        />
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              maxLength={60}
              id="event-name"
              label="Event name"
              placeholder="Name your event"
              className={styles.eventSetup__input}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              multiLine
              maxLength={1000}
              id="event-details"
              label="Event details"
              className={styles.eventSetup__input}
              placeholder="Share what this event is all about"
            />
          )}
        />
        <div className={styles.eventSetup__dateTime}>
          <FormLabel label="Date and time" />
          <div className={styles.eventSetup__dateTimeInputs}>
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => <TimeZone {...field} />}
            />
            <Controller
              name="startOn"
              control={control}
              render={({ field }) => (
                <StartTime
                  value={field.value}
                  onChange={(value) => {
                    setDefaultEndOn(value);
                    field.onChange(value);
                  }}
                />
              )}
            />
            <Controller
              name="endOn"
              control={control}
              render={({ field }) => {
                const minDate = values.startOn
                  ? new CalendarDate(
                      values.startOn.getFullYear(),
                      values.startOn.getMonth() + 1,
                      values.startOn.getDate(),
                    )
                  : undefined;

                const minTime = values.startOn
                  ? new Time(values.startOn.getHours(), values.startOn.getMinutes())
                  : undefined;

                return (
                  <EndTime
                    {...field}
                    minDate={minDate}
                    minTime={minTime}
                    setDefaultEndOn={() => setDefaultEndOn(values.startOn)}
                  />
                );
              }}
            />
          </div>
        </div>
        <div className={styles.eventSetup__dateTime}>
          <FormLabel label="Location" />
          <Location
            value={values}
            onChange={(values) => {
              Object.entries(values).forEach(([key, value]) => {
                setValue(key as keyof EventSetupValues, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              });
            }}
          />
        </div>
        <div className={styles.eventSetup__submitButton}>
          <Button
            fullWidth
            type="submit"
            variant="fill"
            color="primary"
            icon={isCreateEvent ? <Plus /> : null}
            isDisabled={!isDirty || isSubmitting || !isValid}
          >
            {isCreateEvent ? 'Create event' : 'Save'}
          </Button>
        </div>
      </form>
    </section>
  );
};
