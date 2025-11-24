import { EventDetail, EventDetailProps } from '~/v4/social/features';

export type EventDetailPageProps = EventDetailProps;

function EventDetailPage({ eventId }: EventDetailPageProps) {
  return <EventDetail eventId={eventId} />;
}

export default EventDetailPage;
