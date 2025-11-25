import { EventAttendeesProps } from '~/v4/social/features';
import { EventAttendees } from '~/v4/social/features/events/EventAttendees';

export type EventAttendeesPageProps = EventAttendeesProps;

function EventAttendeesPage({ event }: EventAttendeesPageProps) {
  return <EventAttendees event={event} />;
}

export default EventAttendeesPage;
