import { useEffect, useState } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';

export function useGetInvitation(community: Amity.Community) {
  const { isVisitorOrBot } = useSDK();
  const [invitation, setInvitation] = useState<Amity.Invitation | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (community && community.getInvitation && !isVisitorOrBot) {
      setIsLoading(true);
      community
        .getInvitation()
        .then((invitation) => {
          setInvitation(invitation);
          setIsLoading(false);
        })
        .catch(() => {
          setInvitation(undefined);
          setIsLoading(false);
        });
    }
  }, [community]);

  return {
    isLoading,
    invitation,
    setInvitation,
  };
}
