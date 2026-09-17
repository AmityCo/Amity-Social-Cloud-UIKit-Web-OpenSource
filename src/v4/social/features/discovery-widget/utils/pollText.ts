import millify from 'millify';
import { resolveString } from '~/v4/core/localization';

export function getParticipantLineText(voteCount: number): string {
  if (voteCount <= 0) return resolveString('amity_social_button_no_votes');
  if (voteCount === 1) return resolveString('amity_social_label_voted_by_1_participant');
  return resolveString('amity_social_label_voted_by_participants', millify(voteCount));
}

export function getVoterCountText(voteCount: number): string {
  if (voteCount <= 0) return resolveString('amity_social_button_no_votes');
  if (voteCount === 1) return resolveString('amity_social_button_poll_voter', millify(1));
  return resolveString('amity_social_button_poll_voters', millify(voteCount));
}

export function formatPercentage(percentage: number): string {
  return `${Math.round(percentage)}%`;
}
