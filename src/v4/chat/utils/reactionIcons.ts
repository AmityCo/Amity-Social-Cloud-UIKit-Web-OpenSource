import type { ComponentType, SVGProps } from 'react';
import Like from '~/v4/icons/Like';
import Love from '~/v4/icons/Love';
import Fire from '~/v4/icons/Fire';
import Happy from '~/v4/icons/Happy';
import Crying from '~/v4/icons/Crying';

export const REACTION_ICON_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  like: Like,
  love: Love,
  fire: Fire,
  happy: Happy,
  sad: Crying,
};
