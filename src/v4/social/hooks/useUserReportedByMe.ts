/**
 * Whether the current user has reported `user`, read from the user object's own
 * `isFlaggedByMe` hint: a local Bloom test on `hashFlag`, no request. `false` is exact,
 * `true` can be a false positive. The value follows the user object, so a user delivered
 * by a live object or collection carries the fresh hint after a flag or unflag.
 * `isLoading` and `isFetching` are kept for call-site compatibility and are always `false`.
 */
const useUserReportedByMe = (user?: Amity.User | null) => {
  return {
    isLoading: false,
    isFetching: false,
    isReportedByMe: user?.isFlaggedByMe ?? false,
  };
};

export default useUserReportedByMe;
