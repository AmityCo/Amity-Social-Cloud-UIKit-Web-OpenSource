export enum MediaTabType {
  IMAGES = 'images',
  VIDEOS = 'videos',
  CLIPS = 'clips',
}

export const MEDIA_TABS = [
  { type: MediaTabType.IMAGES, label: 'Photos' },
  { type: MediaTabType.VIDEOS, label: 'Videos' },
  { type: MediaTabType.CLIPS, label: 'Clips' },
];
