export type FrameRatio = '16:9' | '1:1' | '4:5';

export const FRAME_RATIO_CSS: Record<FrameRatio, string> = {
  '16:9': '16 / 9',
  '1:1': '1 / 1',
  '4:5': '4 / 5',
};

const LANDSCAPE_THRESHOLD = 1.25;
const PORTRAIT_THRESHOLD = 0.8;

export const DEFAULT_FRAME_RATIO: FrameRatio = '1:1';

export function getVideoDisplayDims(video?: {
  width?: number;
  height?: number;
  rotation?: number;
}): { width?: number; height?: number } {
  const { width, height, rotation } = video ?? {};
  if (width == null || height == null) return { width, height };
  if (Math.abs(rotation ?? 0) % 180 === 90) return { width: height, height: width };
  return { width, height };
}

export function getFrameRatio(width?: number, height?: number): FrameRatio {
  if (!width || !height || height <= 0) return DEFAULT_FRAME_RATIO;

  const ratio = width / height;

  if (ratio >= LANDSCAPE_THRESHOLD) return '16:9';
  if (ratio <= PORTRAIT_THRESHOLD) return '4:5';
  return '1:1';
}
