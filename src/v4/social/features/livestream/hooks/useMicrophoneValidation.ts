import { useEffect } from 'react';
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
        okText: 'OK',
        title: 'No microphone found',
        pageId,
        content: "We couldn't found your microphone. Make sure it's properly connected,",
      });
    }
  }, [enabled, deviceManagement.isLoading, deviceManagement.audioDevices.length, info, pageId]);
};
