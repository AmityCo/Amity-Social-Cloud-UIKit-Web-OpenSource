import React, { useEffect, useRef, useState } from 'react';
import styles from './SocialHomePage.module.css';

import { TopNavigation } from '~/v4/social/components/TopNavigation';
import { MyCommunities } from '~/v4/social/components/MyCommunities';
import { NewsfeedButton } from '~/v4/social/elements/NewsfeedButton';
import { ExploreButton } from '~/v4/social/elements/ExploreButton';
import { MyCommunitiesButton } from '~/v4/social/elements/MyCommunitiesButton';
import { Newsfeed } from '~/v4/social/components/Newsfeed';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CreatePostMenu } from '~/v4/social/components/CreatePostMenu';

enum EnumTabNames {
  Newsfeed = 'Newsfeed',
  Explore = 'Explore',
  MyCommunities = 'My communities',
}

export function SocialHomePage() {
  const pageId = 'social_home_page';
  const { themeStyles } = useAmityPage({
    pageId,
  });

  const [activeTab, setActiveTab] = useState(EnumTabNames.Newsfeed);

  const [isShowCreatePostMenu, setIsShowCreatePostMenu] = useState(false);
  const createPostMenuRef = useRef<HTMLDivElement | null>(null);
  const createPostButtonRef = useRef<HTMLDivElement>(null);

  const handleClickButton = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsShowCreatePostMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        createPostMenuRef.current &&
        !createPostMenuRef.current.contains(event.target as Node) &&
        createPostButtonRef.current !== event.target
      ) {
        setIsShowCreatePostMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.socialHomePage} style={themeStyles}>
      <div className={styles.socialHomePage__topBar}>
        <TopNavigation
          pageId={pageId}
          onClickPostCreationButton={handleClickButton}
          createPostButtonRef={createPostButtonRef}
        />
        {isShowCreatePostMenu && (
          <div ref={createPostMenuRef}>
            <CreatePostMenu pageId={pageId} />
          </div>
        )}
        <div className={styles.socialHomePage__tabs}>
          <NewsfeedButton
            pageId={pageId}
            isActive={activeTab === EnumTabNames.Newsfeed}
            onClick={() => setActiveTab(EnumTabNames.Newsfeed)}
          />
          <ExploreButton pageId={pageId} isActive={activeTab === EnumTabNames.Explore} />
          <MyCommunitiesButton
            pageId={pageId}
            isActive={activeTab === EnumTabNames.MyCommunities}
            onClick={() => setActiveTab(EnumTabNames.MyCommunities)}
          />
        </div>
      </div>
      <div className={styles.socialHomePage__contents}>
        {activeTab === EnumTabNames.Newsfeed && <Newsfeed pageId={pageId} />}
        {activeTab === EnumTabNames.Explore && <div>Explore</div>}
        {activeTab === EnumTabNames.MyCommunities && <MyCommunities pageId={pageId} />}
      </div>
    </div>
  );
}
