import { EventRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';

type DeleteEventParams = Parameters<typeof EventRepository.deleteEvent>[0];

type DeleteEventResponse = Awaited<ReturnType<typeof EventRepository.deleteEvent>>;

export type CreateEventPayload = Parameters<typeof EventRepository.createEvent>[0];

type CreateEventResponse = Awaited<ReturnType<typeof EventRepository.createEvent>>;

export type UpdateEventPayload = Parameters<typeof EventRepository.updateEvent>;

type UpdateEventResponse = Awaited<ReturnType<typeof EventRepository.updateEvent>>;

export function useEventMutation() {
  const createEventMutation = useMutation<CreateEventResponse, Error, CreateEventPayload>({
    mutationFn: EventRepository.createEvent,
  });

  const updateEventMutation = useMutation<UpdateEventResponse, Error, UpdateEventPayload>({
    mutationFn: ([eventId, payload]) => EventRepository.updateEvent(eventId, payload),
  });

  const deleteEventMutation = useMutation<DeleteEventResponse, Error, DeleteEventParams>({
    mutationFn: EventRepository.deleteEvent,
  });

  return {
    createEventMutation,
    updateEventMutation,
    deleteEventMutation,
  };
}
