import { useEffect } from 'react';
import { resolveString } from '~/v4/core/localization';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useDeviceManagement } from '~/v4/core/hooks/useDeviceManagement';

export interface UseMicrophoneValidationProps {
  pageId: string;
  deviceManagement: ReturnType<typeof useDeviceManagement>;
  enabled?: boolean;
}

export const useMicrophoneValidation = ({
  pageId,
  deviceManagement,
  enabled = true,
}: UseMicrophoneValidationProps) => {
  const { info } = useConfirmContext();

  useEffect(() => {
    if (!enabled) return;

    if (!deviceManagement.isLoading && deviceManagement.audioDevices.length === 0) {
      info({
        pageId,
        title: resolveString('amity_social_toast_create_livestream_no_microphone_found'),
        content: resolveString(
          'amity_social_toast_create_livestream_no_microphone_found_description',
        ),
        okText: resolveString('amity_social_button_ok'),
      });
    }
  }, [enabled, deviceManagement.isLoading, deviceManagement.audioDevices.length, info, pageId]);
};
