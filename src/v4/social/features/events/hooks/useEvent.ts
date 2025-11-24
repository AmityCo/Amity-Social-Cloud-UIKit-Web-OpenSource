import { EventRepository } from '@amityco/ts-sdk';
import useLiveObjectV4 from '~/v4/core/hooks/useLiveObjectV4';

type UseEventProps = {
  eventId: Parameters<typeof EventRepository.getEvent>[0];
  shouldCall?: boolean;
};

export function useEvent({ eventId, shouldCall = true }: UseEventProps) {
  const { item: event, ...props } = useLiveObjectV4({
    fetcher: EventRepository.getEvent,
    params: eventId,
    shouldCall: !!eventId && !!shouldCall,
  });

  return { event, ...props };
}
