import React from 'react';

import { TargetSelection } from '~/v4/social/internal-components/TargetSelection';
import { PAGE_ID } from '~/v4/constants/customization';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { SelectedTarget } from '~/v4/social/internal-components/TargetSelection/TargetSelection';

export function LivestreamTargetSelectionPage({
  onPressTarget,
}: {
  onPressTarget?: (params: SelectedTarget) => void;
}) {
  const pageId = PAGE_ID.SELECT_LIVESTREAM_TARGET_PAGE;
  const { goToCreateLivestreamPage } = useNavigation();
  const { closePopup } = usePopupContext();
  const onSelectTarget = (params: SelectedTarget) => {
    closePopup();
    onPressTarget ? onPressTarget(params) : goToCreateLivestreamPage?.(params);
  };
  return (
    <TargetSelection pageId={pageId} onSelectTarget={onSelectTarget} testIdPrefix="livestream" />
  );
}
