import { useMemo } from 'react';
import { useLocalStorage } from 'react-use';
import useSDK from '~/v4/core/hooks/useSDK';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';

export const useSocialHomePageTab = (): [HomePageTab | null, (tab: HomePageTab) => void] => {
  const { currentUserId } = useSDK();

  const PERSISTED_TABS = useMemo(
    () =>
      new Set([
        HomePageTab.ForYou,
        HomePageTab.Newsfeed,
        HomePageTab.Communities,
        HomePageTab.Events,
      ]),
    [],
  );

  const key = useMemo(() => {
    if (!currentUserId) return null;
    return `amity:socialHome:lastTab:${currentUserId}`;
  }, [currentUserId]);

  const [selectedTab, setSelectedTab] = useLocalStorage<HomePageTab | null>(key ?? '', null);

  const value: HomePageTab | null = useMemo(() => {
    if (!key || !selectedTab) return null;
    if (!Object.values(HomePageTab).includes(selectedTab)) return null;
    if (!PERSISTED_TABS.has(selectedTab)) return null;
    return selectedTab;
  }, [key, selectedTab]);

  const setTab = (tab: HomePageTab) => {
    if (!key || !PERSISTED_TABS.has(tab)) return;
    setSelectedTab(tab);
  };

  return [value, setTab];
};
