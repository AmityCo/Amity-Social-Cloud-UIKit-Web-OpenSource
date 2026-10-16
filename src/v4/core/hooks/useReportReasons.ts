import { useContext } from 'react';
import {
  AmityContentFlagReasonType,
  getContentFlagReasonKey,
  getContentFlagReasons,
} from '@amityco/ts-sdk';
import { LocaleContext, resolveReportReasonLabel } from '~/v4/core/localization';

export type ReportReasonOption = {
  reason: AmityContentFlagReasonType;
  key: string;
  label: string;
};

export function useReportReasons(): ReportReasonOption[] {
  useContext(LocaleContext);

  return getContentFlagReasons()
    .filter((reason) => reason !== AmityContentFlagReasonType.Others)
    .map((reason) => ({
      reason,
      key: getContentFlagReasonKey(reason),
      label: resolveReportReasonLabel(reason),
    }));
}
