import { AmityEventStatus, AmityEventType } from '@amityco/ts-sdk';

export const STATUS_LABEL: Record<AmityEventStatus, string> = {
  [AmityEventStatus.Scheduled]: 'amity_social_status_event_detail_header_status_upcoming',
  [AmityEventStatus.Live]: 'amity_social_button_happening_now',
  [AmityEventStatus.Ended]: 'amity_social_event_detail_status_ended',
  [AmityEventStatus.Cancelled]: 'amity_social_button_event_detail_header_status_cancelled',
};

export const EVENT_TYPE = {
  [AmityEventType.InPerson]: 'amity_social_label_event_type_in_person',
  [AmityEventType.Virtual]: 'amity_social_label_event_type_virtual',
};
