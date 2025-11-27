import { EventDetail, EventDetailProps } from '~/v4/social/features';

export type EventDetailPageProps = EventDetailProps;

function EventDetailPage(props: EventDetailPageProps) {
  return <EventDetail {...props} />;
}

export default EventDetailPage;
