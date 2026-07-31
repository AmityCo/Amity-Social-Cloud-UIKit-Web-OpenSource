export type BadgeShape = 'round' | 'square';
export type BadgeFill = 'filled' | 'ghost';
export type BadgeSize = 14 | 16 | 20 | 24 | 28 | 32;
export type BadgePreset = { family: string; case: string };

export type BadgeBaseProps = {
  shape?: BadgeShape;
  fill?: BadgeFill;
  size?: BadgeSize;
  border?: boolean;
  preset?: BadgePreset;
  className?: string;
};

export const presetSlug = (preset?: BadgePreset) =>
  preset ? `${preset.family}-${preset.case}`.toLowerCase() : undefined;
