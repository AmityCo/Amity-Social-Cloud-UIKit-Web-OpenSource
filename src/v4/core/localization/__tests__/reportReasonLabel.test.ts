import { AmityContentFlagReasonType, getContentFlagReasons } from '@amityco/ts-sdk';
import {
  setStringOverrides,
  _resetLocalizationState,
} from '~/v4/core/localization/resolveString';
import {
  getReportReasonLabelKey,
  resolveReportReasonLabel,
} from '~/v4/core/localization/reportReasonLabel';
import { defaultLocaleBundle } from '~/v4/core/localization/defaults/en';

beforeEach(() => {
  _resetLocalizationState();
});

describe('report reason labels', () => {
  it('builds the string key from the SDK key', () => {
    expect(getReportReasonLabelKey(AmityContentFlagReasonType.ChildEndangerment)).toBe(
      'amity_social_label_report_reason_child_endangerment',
    );
    expect(getReportReasonLabelKey(AmityContentFlagReasonType.SellingRestrictedItems)).toBe(
      'amity_social_label_report_reason_selling_restricted',
    );
  });

  it('every SDK reason except Others has an English string', () => {
    getContentFlagReasons()
      .filter((reason) => reason !== AmityContentFlagReasonType.Others)
      .forEach((reason) => {
        const key = getReportReasonLabelKey(reason);
        expect(defaultLocaleBundle[key]).toBeTruthy();
      });
  });

  it('resolves the bundled English label', () => {
    expect(resolveReportReasonLabel(AmityContentFlagReasonType.ChildEndangerment)).toBe(
      'Child endangerment',
    );
  });

  it('applies a customer override', () => {
    setStringOverrides({ amity_social_label_report_reason_child_endangerment: 'Child safety' });
    expect(resolveReportReasonLabel(AmityContentFlagReasonType.ChildEndangerment)).toBe(
      'Child safety',
    );
  });

  it('falls back to the SDK default label when no string exists for the key', () => {
    const unknownReason = 'Brand new reason' as AmityContentFlagReasonType;
    expect(resolveReportReasonLabel(unknownReason)).toBe('Brand new reason');
  });
});
