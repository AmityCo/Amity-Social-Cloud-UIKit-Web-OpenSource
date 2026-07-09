const MAX_AXIS_REM = 7.5;
const MIN_AXIS_REM = 2.5;
const RATIO_THRESHOLD = 3;

export type ReplyThumbnailSize = {
  widthRem: number;
  heightRem: number;
};

export function getReplyThumbnailSize(
  intrinsicWidth: number,
  intrinsicHeight: number,
): ReplyThumbnailSize {
  if (intrinsicWidth <= 0 || intrinsicHeight <= 0) {
    return { widthRem: MAX_AXIS_REM, heightRem: MAX_AXIS_REM };
  }
  if (intrinsicHeight >= intrinsicWidth) {
    const heightRem = MAX_AXIS_REM;
    const ratio = intrinsicHeight / intrinsicWidth;
    const widthRem = ratio > RATIO_THRESHOLD ? MIN_AXIS_REM : MAX_AXIS_REM / ratio;
    return { widthRem, heightRem };
  }
  const widthRem = MAX_AXIS_REM;
  const ratio = intrinsicWidth / intrinsicHeight;
  const heightRem = ratio > RATIO_THRESHOLD ? MIN_AXIS_REM : MAX_AXIS_REM / ratio;
  return { widthRem, heightRem };
}
