const FIVE_SECONDS = 5000;
const SEVEN_SECONDS = 7000;
const TEN_SECONDS = 10000;

export const DURATION = {
  FIVE_SECONDS,
  SEVEN_SECONDS,
  TEN_SECONDS,
} as const;

export interface StoryViewerProps {
  targetId: string;
  onClose: () => void;
  duration?: typeof DURATION[keyof typeof DURATION];
  commentIcon?: React.ReactNode;
  likeIcon?: React.ReactNode;
}
