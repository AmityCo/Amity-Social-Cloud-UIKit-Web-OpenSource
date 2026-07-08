import { useSDK } from '~/v4/core/hooks/useSDK';
import { useUser } from '~/v4/core/hooks/objects/useUser';

export default function useOneUser(): Amity.User | null {
  const { currentUserId } = useSDK();
  const { user } = useUser({ userId: currentUserId });
  return user ?? null;
}
