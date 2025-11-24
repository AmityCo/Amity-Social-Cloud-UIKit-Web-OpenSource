import { useState, useCallback, useEffect } from 'react';

export type PermissionState = 'granted' | 'denied' | 'prompt' | 'checking' | 'no-devices';

export interface MediaDeviceInfo {
  deviceId: string;
  label: string;
  kind: string;
}

export interface UseMediaPermissionsReturn {
  // Permission states
  microphonePermission: PermissionState;
  cameraPermission: PermissionState;

  // Device lists
  audioDevices: MediaDeviceInfo[];
  videoDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];

  // Loading state
  isLoading: boolean;

  // Functions
  enumerateDevices: () => Promise<void>;
  checkPermissionsStatus: () => Promise<void>;
}

export const useMediaPermissions = (): UseMediaPermissionsReturn => {
  // Permission states
  const [microphonePermission, setMicrophonePermission] = useState<PermissionState>('checking');
  const [cameraPermission, setCameraPermission] = useState<PermissionState>('checking');

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Device lists
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);

  // Enumerate available media devices
  const enumerateDevices = useCallback(async () => {
    try {
      setIsLoading(true);
      // Reset to checking state
      setMicrophonePermission('checking');
      setCameraPermission('checking');

      // Check permissions first
      let audioPermissionGranted = false;
      let videoPermissionGranted = false;

      try {
        // Try to get audio permission
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioPermissionGranted = true;
        audioStream.getTracks().forEach((track) => track.stop());
        setMicrophonePermission('granted');
      } catch (audioError) {
        console.error('Audio permission error:', audioError);
        // Check if it's a permission error or device error
        const errorName = (audioError as Error).name;
        if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
          setMicrophonePermission('denied');
        } else if (errorName === 'NotFoundError') {
          setMicrophonePermission('no-devices');
        } else {
          setMicrophonePermission('prompt');
        }
      }

      try {
        // Try to get video permission
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoPermissionGranted = true;
        videoStream.getTracks().forEach((track) => track.stop());
        setCameraPermission('granted');
      } catch (videoError) {
        console.error('Video permission error:', videoError);
        // Check if it's a permission error or device error
        const errorName = (videoError as Error).name;
        if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
          setCameraPermission('denied');
        } else if (errorName === 'NotFoundError') {
          setCameraPermission('no-devices');
        } else {
          setCameraPermission('prompt');
        }
      }

      // Always try to enumerate devices, even if permissions failed
      const devices = await navigator.mediaDevices.enumerateDevices();

      const audioInputs = devices
        .filter((device) => device.kind === 'audioinput')
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone ${device.deviceId.slice(0, 5)}`,
          kind: device.kind,
        }));

      const videoInputs = devices
        .filter((device) => device.kind === 'videoinput')
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 5)}`,
          kind: device.kind,
        }));

      const audioOutputs = devices
        .filter((device) => device.kind === 'audiooutput')
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Speaker ${device.deviceId.slice(0, 5)}`,
          kind: device.kind,
        }));

      setAudioDevices(audioInputs);
      setVideoDevices(videoInputs);
      setAudioOutputDevices(audioOutputs);

      // Handle case where permission is granted but no devices are found
      if (audioPermissionGranted && audioInputs.length === 0) {
        setMicrophonePermission('no-devices');
      }
      if (videoPermissionGranted && videoInputs.length === 0) {
        setCameraPermission('no-devices');
      }
    } catch (error) {
      console.error('Error enumerating devices:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check permissions using Permissions API when available
  const checkPermissionsStatus = useCallback(async () => {
    if (!navigator.permissions) return;

    try {
      const cameraResult = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      });
      const microphoneResult = await navigator.permissions.query({
        name: 'microphone' as PermissionName,
      });

      setCameraPermission(cameraResult.state);
      setMicrophonePermission(microphoneResult.state);

      // Listen for permission changes
      cameraResult.addEventListener('change', () => {
        setCameraPermission(cameraResult.state);
        if (cameraResult.state === 'denied' || cameraResult.state === 'granted') {
          enumerateDevices(); // Re-enumerate when permission changes
        }
      });

      microphoneResult.addEventListener('change', () => {
        setMicrophonePermission(microphoneResult.state);
        if (microphoneResult.state === 'denied' || microphoneResult.state === 'granted') {
          enumerateDevices(); // Re-enumerate when permission changes
        }
      });
    } catch (error) {
      console.error('Permissions API not fully supported, falling back to getUserMedia check');
    }
  }, [enumerateDevices]);

  // Initialize permissions and devices on mount
  useEffect(() => {
    checkPermissionsStatus().then(() => {
      enumerateDevices();
    });
  }, [enumerateDevices, checkPermissionsStatus]);

  return {
    // Permission states
    microphonePermission,
    cameraPermission,

    // Device lists
    audioDevices,
    videoDevices,
    audioOutputDevices,

    // Loading state
    isLoading,

    // Functions
    enumerateDevices,
    checkPermissionsStatus,
  };
};
