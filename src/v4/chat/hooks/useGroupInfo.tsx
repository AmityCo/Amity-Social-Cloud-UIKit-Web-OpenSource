import React, { useState } from 'react';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { GroupInfo } from '../components/GroupInfo/GroupInfo';

interface UseGroupInfoProps {
  pageId?: string;
  componentId?: string;
}

export const useGroupInfo = ({ pageId = '*', componentId = '*' }: UseGroupInfoProps = {}) => {
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);

  const openGroupInfo = (channel: Amity.Channel | null) => {
    if (isDesktop) {
      // Desktop: Apri in modale
      openPopup({
        pageId,
        componentId,
        header: null,
        children: (
          <GroupInfo
            channel={channel}
            onClose={closePopup}
            pageId={pageId}
            componentId={componentId}
          />
        ),
      });
    } else {
      // Mobile: Apri come pagina a schermo intero
      setIsGroupInfoOpen(true);
    }
  };

  const closeGroupInfo = () => {
    if (isDesktop) {
      closePopup();
    } else {
      setIsGroupInfoOpen(false);
    }
  };

  const GroupInfoComponent = ({ channel }: { channel: Amity.Channel | null }) => {
    if (!isGroupInfoOpen || isDesktop) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          backgroundColor: 'white',
        }}
      >
        <GroupInfo
          channel={channel}
          onClose={closeGroupInfo}
          pageId={pageId}
          componentId={componentId}
        />
      </div>
    );
  };

  return {
    openGroupInfo,
    closeGroupInfo,
    isGroupInfoOpen,
    GroupInfoComponent,
  };
};
