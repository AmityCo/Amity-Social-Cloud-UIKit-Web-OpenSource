/// <reference types="jest" />
import { VisitorUsageLimitPage } from './VisitorUsageLimitPage';

describe('VisitorUsageLimitPage', () => {
  it('is exported as a function (React component)', () => {
    expect(typeof VisitorUsageLimitPage).toBe('function');
  });

  it('accepts optional onSignIn prop in its type signature', () => {
    const onSignIn = jest.fn();
    const props: Parameters<typeof VisitorUsageLimitPage>[0] = { onSignIn };
    expect(props.onSignIn).toBe(onSignIn);
  });

  it('accepts empty props (onSignIn is optional)', () => {
    const props: Parameters<typeof VisitorUsageLimitPage>[0] = {};
    expect(props.onSignIn).toBeUndefined();
  });
});
