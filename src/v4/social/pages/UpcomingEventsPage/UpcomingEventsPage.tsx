import { UpcomingEvents, UpcomingEventsProps } from '~/v4/social/features/events';

export type UpcomingEventsPageProps = UpcomingEventsProps;

function UpcomingEventsPage({ fromExplore }: UpcomingEventsPageProps) {
  return <UpcomingEvents fromExplore={fromExplore} />;
}

export default UpcomingEventsPage;
