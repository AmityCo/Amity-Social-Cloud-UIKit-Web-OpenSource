import { AmityContentFlagReasonType, getContentFlagReasonKey } from '@amityco/ts-sdk';
import { resolveString } from './resolveString';

export const REPORT_REASON_LABEL_KEY_PREFIX = 'amity_social_label_report_reason_';

export function getReportReasonLabelKey(reason: AmityContentFlagReasonType): string {
  return `${REPORT_REASON_LABEL_KEY_PREFIX}${getContentFlagReasonKey(reason)}`;
}

export function resolveReportReasonLabel(reason: AmityContentFlagReasonType): string {
  const key = getReportReasonLabelKey(reason);
  const label = resolveString(key);
  return label === key ? reason : label;
}
