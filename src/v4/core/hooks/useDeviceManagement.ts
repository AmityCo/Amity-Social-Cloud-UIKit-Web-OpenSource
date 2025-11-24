import { useState, useCallback, useEffect } from 'react';
import { useMediaPermissions, MediaDeviceInfo } from '~/v4/core/hooks/useMediaPermissions';

export interface CurrentDevices {
  audioDeviceId?: string;
  videoDeviceId?: string;
  speakerDeviceId?: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

export interface UseDeviceManagementReturn {
  // Device state
  currentDevices: CurrentDevices;

  // Device lists from permissions hook
  audioDevices: MediaDeviceInfo[];
  videoDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];

  // Permission states
  microphonePermission: string;
  cameraPermission: string;
  isLoading: boolean;

  // Computed states
  permissionDenied: boolean;

  // Device handlers
  setCurrentDevices: React.Dispatch<React.SetStateAction<CurrentDevices>>;
  handleAudioToggle: () => void;
  handleDeviceSelect: (deviceType: 'audio' | 'video' | 'speaker', deviceId: string) => void;
}

export const useDeviceManagement = (): UseDeviceManagementReturn => {
  // Device management state
  const [currentDevices, setCurrentDevices] = useState<CurrentDevices>({
    audioDeviceId: undefined,
    videoDeviceId: undefined,
    speakerDeviceId: undefined,
    audioEnabled: true,
    videoEnabled: true,
  });

  // Use media permissions hook
  const {
    microphonePermission,
    cameraPermission,
    audioDevices,
    videoDevices,
    audioOutputDevices,
    isLoading,
  } = useMediaPermissions();

  // Computed permission state
  const permissionDenied =
    cameraPermission === 'denied' ||
    microphonePermission === 'denied' ||
    cameraPermission === 'checking' ||
    microphonePermission === 'checking';

  // Set default selected devices when devices are available
  useEffect(() => {
    if (audioDevices.length > 0 || videoDevices.length > 0 || audioOutputDevices.length > 0) {
      setCurrentDevices((prev) => ({
        ...prev,
        audioDeviceId: audioDevices.length > 0 ? audioDevices[0].deviceId : prev.audioDeviceId,
        videoDeviceId: videoDevices.length > 0 ? videoDevices[0].deviceId : prev.videoDeviceId,
        speakerDeviceId:
          audioOutputDevices.length > 0 ? audioOutputDevices[0].deviceId : prev.speakerDeviceId,
      }));
    }
  }, [audioDevices, videoDevices, audioOutputDevices]);

  // Handle audio toggle
  const handleAudioToggle = useCallback(() => {
    setCurrentDevices((prev) => ({
      ...prev,
      audioEnabled: !prev.audioEnabled,
    }));
  }, []);

  // Handle device selection
  const handleDeviceSelect = useCallback(
    (deviceType: 'audio' | 'video' | 'speaker', deviceId: string) => {
      setCurrentDevices((prev) => ({
        ...prev,
        [`${deviceType}DeviceId`]: deviceId,
      }));
    },
    [],
  );

  return {
    // Device state
    currentDevices,

    // Device lists
    audioDevices,
    videoDevices,
    audioOutputDevices,

    // Permission states
    microphonePermission,
    cameraPermission,
    isLoading,

    // Computed states
    permissionDenied,

    // Handlers
    setCurrentDevices,
    handleAudioToggle,
    handleDeviceSelect,
  };
};
