import * as z from 'zod';
import { getTimeZones } from '@vvo/tzdb';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { getLocalTimeZone, now } from '@internationalized/date';
import { ERROR_CODE } from '~/v4/social/constants/errorResponse';
import { useEventMutation } from '~/v4/social/features/events/hooks';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { AmityEventOriginType, AmityEventType } from '@amityco/ts-sdk';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { EventSetupMode, EventSetupProps } from '~/v4/social/features/events/EventSetup/EventSetup';
import {
  getCurrentTimeZone,
  getFormattedTimeZone,
  checkIsWithinMinutes,
  convertToTimezoneISO,
  convertToTimezoneDate,
} from '~/v4/social/utils/timezone';

export enum Platform {
  Livestream = 'livestream',
  External = 'external',
}

const schema = z
  .object({
    image: z.custom<Amity.File<'image'>>().nullable(),
    title: z.string().trim().min(1).max(60),
    description: z.string().trim().min(1).max(1000),
    timezone: z
      .object({
        id: z.string(),
        name: z.string(),
      })
      .required(),
    startOn: z.date(),
    endOn: z.date().nullable(),
    type: z.enum([AmityEventType.InPerson, AmityEventType.Virtual]).default(AmityEventType.Virtual),
    platform: z.string().trim().min(1),
    location: z.string().trim(),
    externalUrl: z.string().trim(),
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

export type EventSetupValues = z.infer<typeof schema>;

export function useEventSetup(props: EventSetupProps) {
  const { onBack } = useNavigation();
  const { isDesktop } = useResponsive();
  const { AmityEventSetupPageBehavior } = usePageBehavior();
  const { info, loading, remove, success } = useNotifications();
  const { createEventMutation, updateEventMutation } = useEventMutation();

  const isCreateEvent = props.mode === EventSetupMode.CREATE;
  const tomorrow = now(getLocalTimeZone()).add({ days: 1 });
  const defaultStartOn = tomorrow.set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
  const defaultEndOn = defaultStartOn.add({ hours: 1 });
  const targetName = isCreateEvent ? props.targetName : undefined;
  const targetId = isCreateEvent ? props.targetId : props.event.originId;

  const defaultValues = isCreateEvent
    ? {
        image: null,
        title: '',
        description: '',
        timezone: {
          id: getCurrentTimeZone(),
          name: getFormattedTimeZone(getTimeZones().find((tz) => tz.name === getCurrentTimeZone())),
        },
        startOn: defaultStartOn.toDate(),
        endOn: defaultEndOn.toDate(),
        type: AmityEventType.Virtual,
        platform: '',
        externalUrl: '',
        location: '',
      }
    : {
        image: props.event.coverImage ?? null,
        title: props.event.title,
        description: props.event.description,
        timezone: {
          id: props.event.metadata?.timezone || getCurrentTimeZone(),
          name: getFormattedTimeZone(
            getTimeZones().find(
              (tz) => tz.name === (props.event.metadata?.timezone || getCurrentTimeZone()),
            ),
          ),
        },
        startOn: convertToTimezoneDate(props.event.startTime, props.event.metadata?.timezone),
        endOn: convertToTimezoneDate(props.event.endTime, props.event.metadata?.timezone),
        type: props.event.type,
        platform:
          props.event.type === AmityEventType.Virtual && props.event.externalUrl
            ? Platform.External
            : Platform.Livestream,
        externalUrl:
          props.event.type === AmityEventType.Virtual ? props.event.externalUrl || '' : '',
        location: props.event.type === AmityEventType.InPerson ? props.event.location || '' : '',
      };

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isDirty, isSubmitting, isValid },
  } = useForm<EventSetupValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    values: defaultValues,
  });

  const values = watch();

  const setDefaultEndOn = (startOn: Date) => {
    if (!values.endOn || startOn > values.endOn) {
      const endDateWithOneHour = new Date(startOn);
      endDateWithOneHour.setHours(endDateWithOneHour.getHours() + 1);
      setValue('endOn', endDateWithOneHour);
    }
  };

  const preparePayload = (data: EventSetupValues) => {
    const startTime = convertToTimezoneISO(data.startOn, data.timezone.id);

    const getTwelveHoursAfterStartTime = () => {
      const endOnWithOneHour = new Date(data.startOn);
      endOnWithOneHour.setHours(endOnWithOneHour.getHours() + 12);
      return convertToTimezoneISO(endOnWithOneHour, data.timezone.id);
    };

    const endTime = data.endOn
      ? convertToTimezoneISO(data.endOn, data.timezone.id)
      : getTwelveHoursAfterStartTime();

    const externalUrl =
      data.type === AmityEventType.Virtual && data.platform === 'external' ? data.externalUrl : '';

    const location = data.type === AmityEventType.InPerson ? data.location : '';

    return {
      title: data.title,
      description: data.description,
      type: data.type,
      coverImageFileId: data.image?.fileId || undefined,
      startTime,
      endTime,
      externalUrl,
      location,
      metadata: { timezone: data.timezone.id },
    };
  };

  const createEvent = async (data: EventSetupValues) => {
    loading({ content: 'Creating...', id: 'create-event-loading' });

    const payload = {
      ...preparePayload(data),
      originId: targetId,
      originType: AmityEventOriginType.Community,
    };

    await createEventMutation.mutateAsync(payload, {
      onSettled: () => remove('create-event-loading'),
      onSuccess: ({ data }) => {
        success({ content: 'Successfully created event.' });
        AmityEventSetupPageBehavior?.goToEventDetailPage?.({
          eventId: data.eventId,
          pop: isDesktop ? 2 : 3,
        });
      },
      onError: (error) => {
        if (error.message?.includes(ERROR_CODE.BLOCKED_WORD)) {
          info({ content: "Your event wasn't created as it contains an inappropriate word." });
        } else if (error.message?.includes(ERROR_CODE.BLOCKED_URL)) {
          info({
            content: "Your event wasn't created as it contains a link that's not allowed.",
          });
        } else {
          info({ content: 'Failed to create event. Please try again.' });
        }
      },
    });
  };

  const editEvent = async (eventId: string, data: EventSetupValues) => {
    loading({ content: 'Saving...', id: 'edit-event-loading' });

    await updateEventMutation.mutateAsync([eventId, preparePayload(data)], {
      onSettled: () => remove('edit-event-loading'),
      onSuccess: () => {
        success({ content: 'Successfully updated event.' });
        onBack?.();
      },
      onError: (error) => {
        if (error.message?.includes(ERROR_CODE.BLOCKED_WORD)) {
          info({ content: "Your event wasn't updated as it contains an inappropriate word." });
        } else if (error.message?.includes(ERROR_CODE.BLOCKED_URL)) {
          info({
            content: "Your event wasn't updated as it contains a link that's not allowed.",
          });
        } else {
          info({ content: 'Failed to update event. Please try again.' });
        }
      },
    });
  };

  const onSubmit = async (data: EventSetupValues) => {
    if (checkIsWithinMinutes(data.startOn.toISOString())) {
      return info({
        content: isCreateEvent
          ? "Your event wasn't created as it needs to start at least 15 minutes from now."
          : "Your event wasn't updated as it needs to start at least 15 minutes from now.",
      });
    }
    isCreateEvent ? await createEvent(data) : await editEvent(props.event.eventId, data);
  };

  return {
    onBack,
    isDirty,
    isValid,
    values,
    control,
    onSubmit,
    setValue,
    isDesktop,
    handleSubmit,
    isCreateEvent,
    isSubmitting,
    targetName,
    setDefaultEndOn,
  };
}
