import { AmityEventStatus, AmityEventType } from '@amityco/ts-sdk';

export const STATUS_LABEL: Record<AmityEventStatus, string> = {
  [AmityEventStatus.Scheduled]: 'Upcoming',
  [AmityEventStatus.Live]: 'Happening now',
  [AmityEventStatus.Ended]: 'Ended',
  [AmityEventStatus.Cancelled]: 'Cancelled',
};

export const EVENT_TYPE = {
  [AmityEventType.InPerson]: 'In-person',
  [AmityEventType.Virtual]: 'Virtual',
};
