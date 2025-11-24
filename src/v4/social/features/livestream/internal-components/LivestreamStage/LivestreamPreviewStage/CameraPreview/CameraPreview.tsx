import React, { useCallback, useRef, useEffect } from 'react';
import { CurrentDevices } from '~/v4/core/hooks/useDeviceManagement';
import { MediaDeviceInfo } from '~/v4/core/hooks/useMediaPermissions';
import { CameraPlaceholder } from './CameraPlaceholder';
import { LocalVideoTrack } from 'livekit-client';
import styles from './CameraPreview.module.css';
import clsx from 'clsx';

export interface CameraPreviewProps {
  className?: string;
  videoDevices: MediaDeviceInfo[];
  permissionDenied: boolean;
  currentDevices: CurrentDevices;
  cameraPermission: string;
  microphonePermission: string;
  videoTrack?: LocalVideoTrack; // Optional video track from LiveKit
  onValidate: (values: any) => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  className,
  videoDevices,
  permissionDenied,
  currentDevices,
  cameraPermission,
  microphonePermission,
  videoTrack,
  onValidate,
}) => {
  const lastValidationRef = useRef<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Update video element when track changes
  useEffect(() => {
    if (videoRef.current && videoTrack?.mediaStreamTrack) {
      const mediaStream = new MediaStream([videoTrack.mediaStreamTrack]);
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(console.error);
    }
  }, [videoTrack?.mediaStreamTrack]);

  // Check if we should show permission message
  const shouldShowPermissionMessage = useCallback(() => {
    const isChecking = cameraPermission === 'checking' || microphonePermission === 'checking';
    const needsCamera = cameraPermission === 'denied';
    const needsMicrophone = microphonePermission === 'denied';

    return !isChecking && (needsCamera || needsMicrophone);
  }, [cameraPermission, microphonePermission]);

  const handleValidate = useCallback(
    (values: any) => {
      // Create a hash of current values to prevent infinite loops
      const currentValuesHash = JSON.stringify({
        audioDeviceId: values.audioDeviceId,
        videoDeviceId: values.videoDeviceId,
        audioEnabled: values.audioEnabled ?? true,
        videoEnabled: values.videoEnabled ?? true,
      });

      // Only update state if values have actually changed
      if (lastValidationRef.current !== currentValuesHash) {
        lastValidationRef.current = currentValuesHash;
        onValidate(values);
      }

      return true;
    },
    [onValidate],
  );

  // Show appropriate placeholder based on state
  if (videoDevices.length === 0) {
    return <CameraPlaceholder.NoCameraFound className={className} />;
  }

  if (permissionDenied || shouldShowPermissionMessage()) {
    return <CameraPlaceholder.NoPermission className={className} />;
  }

  // If we have a videoTrack from LiveKit, use a video element directly
  if (videoTrack) {
    if (!videoTrack.mediaStreamTrack) {
      // Track exists but media stream not ready yet, show loading or fallback to PreJoin
      return (
        <div className={clsx(styles.cameraPreview__cameraContainer, className)}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            Loading camera...
          </div>
        </div>
      );
    }

    const mediaStream = new MediaStream([videoTrack.mediaStreamTrack]);

    return (
      <div className={clsx(styles.cameraPreview__cameraContainer, className)}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    );
  }

  return null;
};
