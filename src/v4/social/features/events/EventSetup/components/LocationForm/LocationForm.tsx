import * as z from 'zod';
import { useString } from '~/v4/core/localization';
import { useState } from 'react';
import { Record } from '~/v4/icons/Record';
import { AmityEventType } from '@amityco/ts-sdk';
import { Typography } from '~/v4/core/components';
import { LivestreamFill } from '~/v4/icons/LivestreamFill';
import { ChevronDown } from '~/v4/icons/ChevronDown';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '~/v4/core/components/AriaButton';
import { Popover } from '~/v4/core/components/AriaPopover';
import { FormLabel } from '~/v4/core/components/FormLabel';
import { FormInput } from '~/v4/core/components/FormInput';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup';
import {
  EventSetupValues,
  Platform,
} from '~/v4/social/features/events/EventSetup/hooks/useEventSetup';
import styles from './LocationForm.module.css';

type LocationFormProps = {
  onCancel: () => void;
  value: Pick<EventSetupValues, 'type' | 'platform' | 'externalUrl' | 'location'>;
  onChange: (
    value: Pick<EventSetupValues, 'type' | 'platform' | 'externalUrl' | 'location'>,
  ) => void;
};

const schema = z
  .object({
    type: z.enum([AmityEventType.Virtual, AmityEventType.InPerson]).default(AmityEventType.Virtual),
    platform: z.enum([Platform.Livestream, Platform.External]).default(Platform.Livestream),
    externalUrl: z.string().trim(),
    location: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.type === AmityEventType.Virtual && data.platform === Platform.External) {
      if (!data.externalUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['externalUrl'],
        });
      }
    }

    if (data.type === AmityEventType.InPerson) {
      if (!data.location) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['location'],
        });
      }
    }
  });

type LocationFormValues = z.infer<typeof schema>;

export function LocationForm({ value, onChange, onCancel }: LocationFormProps) {
  const [shownEventTypeOption, setShownEventTypeOption] = useState(false);

  const {
    watch,
    formState: { isSubmitting, isValid },
    handleSubmit,
    control,
  } = useForm<LocationFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    values: {
      type: value.type,
      platform: value.externalUrl ? Platform.External : Platform.Livestream,
      externalUrl: value.externalUrl || '',
      location: value.location || '',
    },
  });

  const values = watch();

  const onSubmit = (data: LocationFormValues) => {
    onCancel();
    onChange({
      type: data.type,
      platform: data.platform,
      externalUrl:
        data.type === AmityEventType.Virtual && data.platform === 'external'
          ? data.externalUrl
          : '',
      location: data.type === AmityEventType.InPerson ? data.location : '',
    });
  };

  if (shownEventTypeOption) {
    return (
      <Controller
        name="type"
        control={control}
        render={({ field: { onChange } }) => (
          <div className={styles.locationForm__popoverContent}>
            {[AmityEventType.Virtual, AmityEventType.InPerson].map((eventType) => (
              <Button
                type="button"
                key={eventType}
                variant="default"
                className={styles.locationForm__popoverItem}
                onPress={() => {
                  setShownEventTypeOption(false);
                  onChange(eventType);
                }}
              >
                <Typography.BodyBold className={styles.locationForm__eventTypeLabel}>
                  {eventType === AmityEventType.Virtual
                    ? useString('amity_social_button_virtual')
                    : useString('amity_social_button_in_person')}
                </Typography.BodyBold>
              </Button>
            ))}
          </div>
        )}
      />
    );
  }

  return (
    <form className={styles.locationForm} onSubmit={handleSubmit(onSubmit)} id="location-form">
      <div className={styles.locationForm__header}>
        <div className={styles.locationForm__mobileActions}>
          <Button
            type="reset"
            variant="text"
            color="secondary"
            size="small"
            form="location-form"
            onPress={() => onCancel()}
          >
            {useString('amity_social_button_cancel')}
          </Button>
          <Typography.TitleBold>{useString('amity_social_button_location')}</Typography.TitleBold>
          <Button
            type="submit"
            variant="text"
            color="primary"
            size="small"
            form="location-form"
            isDisabled={isSubmitting || !isValid}
          >
            {useString('amity_social_button_done')}
          </Button>
        </div>
        <hr className={styles.locationForm__divider} />
      </div>
      <Controller
        name="type"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Popover
            trigger={({ openPopover, isDesktop }) => (
              <div>
                <FormLabel
                  label={useString('amity_social_button_event_type')}
                  className={styles.locationForm__eventTypeLabel}
                />
                <Button
                  type="button"
                  variant="default"
                  className={styles.locationForm__button}
                  aria-label="Click to open event type selection"
                  onPress={() => (isDesktop ? openPopover() : setShownEventTypeOption(true))}
                >
                  <Typography.Body className={styles.locationForm__eventTypeLabel}>
                    {value === AmityEventType.Virtual
                      ? useString('amity_social_button_virtual')
                      : useString('amity_social_button_in_person')}
                  </Typography.Body>
                  <ChevronDown className={styles.locationForm__icon} />
                </Button>
              </div>
            )}
          >
            {({ closePopover }) => (
              <div className={styles.locationForm__popoverContent}>
                {[AmityEventType.Virtual, AmityEventType.InPerson].map((eventType) => (
                  <Button
                    type="button"
                    key={eventType}
                    variant="default"
                    className={styles.locationForm__popoverItem}
                    onPress={() => {
                      closePopover();
                      onChange(eventType);
                    }}
                  >
                    <Typography.BodyBold className={styles.locationForm__eventTypeLabel}>
                      {eventType === AmityEventType.Virtual
                        ? useString('amity_social_button_virtual')
                        : useString('amity_social_button_in_person')}
                    </Typography.BodyBold>
                  </Button>
                ))}
              </div>
            )}
          </Popover>
        )}
      />
      {values.type === AmityEventType.Virtual && (
        <div>
          <FormLabel
            className={styles.locationForm__eventTypeLabel}
            label={useString('amity_social_event_platform')}
          />
          <Controller
            name="platform"
            control={control}
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                value={value}
                onChange={onChange}
                radios={[
                  {
                    value: Platform.Livestream,
                    label: (
                      <div className={styles.locationForm__radioItem}>
                        <div className={styles.locationForm__radioIconContainer}>
                          <LivestreamFill className={styles.locationForm__radioIcon} />
                        </div>
                        <div className={styles.locationForm__radioLabel}>
                          <Typography.BodyBold className={styles.locationForm__eventTypeLabel}>
                            {useString('amity_social_status_live_stream')}
                          </Typography.BodyBold>
                          <Typography.Caption className={styles.locationForm__radioDescription}>
                            {useString('amity_social_label_event_platform_livestream_description')}
                          </Typography.Caption>
                        </div>
                      </div>
                    ),
                  },
                  {
                    value: Platform.External,
                    label: (
                      <div className={styles.locationForm__radioItem}>
                        <div className={styles.locationForm__radioIconContainer}>
                          <Record className={styles.locationForm__radioIcon} />
                        </div>
                        <div className={styles.locationForm__radioLabel}>
                          <Typography.BodyBold className={styles.locationForm__eventTypeLabel}>
                            {useString('amity_social_label_event_platform_external')}
                          </Typography.BodyBold>
                          <Typography.Caption className={styles.locationForm__radioDescription}>
                            {useString('amity_social_label_event_platform_external_description')}
                          </Typography.Caption>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            )}
          />
          {values.platform === Platform.External && (
            <Controller
              control={control}
              name="externalUrl"
              render={({ field: { onChange, value } }) => (
                <div className={styles.locationForm__externalUrlInput}>
                  <FormInput
                    value={value}
                    variant="boxed"
                    maxLength={200}
                    placeholder={useString('amity_social_placeholder_event_link_hint')}
                    onChange={(e) => onChange(e.target.value)}
                  />
                </div>
              )}
            />
          )}
        </div>
      )}
      {values.type === AmityEventType.InPerson && (
        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, value } }) => (
            <FormInput
              multiLine
              label={useString('amity_social_button_address')}
              maxLength={180}
              variant="underlined"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={styles.locationForm__addressInput}
              placeholder={useString(
                'amity_social_label_enter_address_of_where_this_event_will_be_happening',
              )}
            />
          )}
        />
      )}
      <div className={styles.locationForm__desktopActions}>
        <Button
          type="reset"
          form="location-form"
          variant="outlined"
          color="secondary"
          onPress={() => onCancel()}
        >
          {useString('amity_social_button_cancel')}
        </Button>
        <Button
          type="submit"
          variant="fill"
          color="primary"
          form="location-form"
          isDisabled={isSubmitting || !isValid}
        >
          {useString('amity_social_button_done')}
        </Button>
      </div>
    </form>
  );
}
