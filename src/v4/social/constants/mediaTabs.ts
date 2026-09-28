import { ELEMENT_ID } from '~/v4/constants/customization';

export enum MediaTabType {
  IMAGES = 'images',
  VIDEOS = 'videos',
  CLIPS = 'clips',
}

export const MEDIA_TABS: { type: MediaTabType; label: string; elementId?: string }[] = [
  { type: MediaTabType.IMAGES, label: 'Photos' },
  { type: MediaTabType.VIDEOS, label: 'Videos', elementId: ELEMENT_ID.VIDEOS_BUTTON },
  { type: MediaTabType.CLIPS, label: 'Clips', elementId: ELEMENT_ID.CLIPS_BUTTON },
];
