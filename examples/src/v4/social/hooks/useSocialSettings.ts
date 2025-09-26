import useSDK from '~/v4/core/hooks/useSDK';
import { useEffect, useState } from 'react';

type SocialSettings = Amity.SocialSettings & {
  story?: {
    allowAllUserToCreateStory: boolean;
  };
};

export default function useSocialSettings() {
  const { client } = useSDK();
  const [socialSettings, setSocialSettings] = useState<SocialSettings | null>(null);

  useEffect(() => {
    if (!client) return;

    const fetchSocialSettings = async () => {
      const socialSettings = await client?.getSocialSettings();
      if (socialSettings) setSocialSettings(socialSettings);
    };

    fetchSocialSettings();
  }, [client]);

  return { socialSettings };
}
