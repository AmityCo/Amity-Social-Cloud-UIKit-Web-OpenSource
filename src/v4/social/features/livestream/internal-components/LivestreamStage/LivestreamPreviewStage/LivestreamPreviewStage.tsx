import React, { useCallback } from 'react';
import styles from './LivestreamPreviewStage.module.css';
import { CameraPreview } from './CameraPreview';
import { DeviceControls } from '~/v4/social/features/livestream/internal-components/DeviceControls';
import { useDeviceManagement } from '~/v4/core/hooks/useDeviceManagement';
import { usePreviewTracks, useMediaDeviceSelect } from '@livekit/components-react';
import { Track, LocalAudioTrack, LocalVideoTrack } from 'livekit-client';

export interface LivestreamPreviewStageProps {
  // Device management - passed from parent since it's also needed for permissions
  deviceManagement: ReturnType<typeof useDeviceManagement>;
}

export const LivestreamPreviewStage: React.FC<LivestreamPreviewStageProps> = ({
  deviceManagement,
}) => {
  // LiveKit preview tracks for device management
  const tracks = usePreviewTracks({
    audio: deviceManagement.currentDevices.audioEnabled,
    video: deviceManagement.currentDevices.videoEnabled
      ? { deviceId: deviceManagement.currentDevices.videoDeviceId || 'default' }
      : false,
  });

  // Find audio and video tracks with proper typing
  const audioTrack = tracks?.find((track) => track.kind === Track.Kind.Audio) as
    | LocalAudioTrack
    | undefined;
  const videoTrack = tracks?.find((track) => track.kind === Track.Kind.Video) as
    | LocalVideoTrack
    | undefined;

  const {
    devices: livekitDevices,
    activeDeviceId: livekitActiveDeviceId,
    setActiveMediaDevice,
  } = useMediaDeviceSelect({
    kind: 'audioinput',
  });

  const {
    devices: livekitVideoDevices,
    activeDeviceId: livekitActiveVideoDeviceId,
    setActiveMediaDevice: setActiveVideoMediaDevice,
  } = useMediaDeviceSelect({
    kind: 'videoinput',
  });

  const {
    devices: livekitAudioOutputDevices,
    activeDeviceId: livekitActiveAudioOutputDeviceId,
    setActiveMediaDevice: setActiveAudioOutputMediaDevice,
  } = useMediaDeviceSelect({
    kind: 'audiooutput',
  });

  // Handle audio toggle for LiveKit
  const handleLiveKitAudioToggle = useCallback(() => {
    if (audioTrack) {
      if (audioTrack.isMuted) {
        audioTrack.unmute();
      } else {
        audioTrack.mute();
      }
    }
    deviceManagement.handleAudioToggle();
  }, [audioTrack, deviceManagement]);

  // Handle video toggle for LiveKit
  const handleLiveKitVideoToggle = useCallback(() => {
    if (videoTrack) {
      if (videoTrack.isMuted) {
        videoTrack.unmute();
      } else {
        videoTrack.mute();
      }
    }
    // Update device management state
    deviceManagement.setCurrentDevices((prev) => ({
      ...prev,
      videoEnabled: !prev.videoEnabled,
    }));
  }, [videoTrack, deviceManagement]);

  // Handle device selection for LiveKit
  const handleLiveKitDeviceSelect = useCallback(
    (deviceType: 'audio' | 'video' | 'speaker', deviceId: string) => {
      switch (deviceType) {
        case 'audio':
          setActiveMediaDevice(deviceId);
          break;
        case 'video':
          setActiveVideoMediaDevice(deviceId);
          break;
        case 'speaker':
          setActiveAudioOutputMediaDevice(deviceId);
          break;
      }
      deviceManagement.handleDeviceSelect(deviceType, deviceId);
    },
    [
      setActiveMediaDevice,
      setActiveVideoMediaDevice,
      setActiveAudioOutputMediaDevice,
      deviceManagement,
    ],
  );

  // Convert LiveKit devices to our format
  const audioDevices = livekitDevices.map((device) => ({
    deviceId: device.deviceId,
    label: device.label,
    kind: device.kind as MediaDeviceKind,
  }));

  const videoDevices = livekitVideoDevices.map((device) => ({
    deviceId: device.deviceId,
    label: device.label,
    kind: device.kind as MediaDeviceKind,
  }));

  const audioOutputDevices = livekitAudioOutputDevices.map((device) => ({
    deviceId: device.deviceId,
    label: device.label,
    kind: device.kind as MediaDeviceKind,
  }));

  // Device controls props - using LiveKit integration
  const controlsProps = {
    currentDevices: {
      audioEnabled: !!(audioTrack && !audioTrack?.isMuted),
      videoEnabled: !videoTrack?.isMuted,
      audioDeviceId: livekitActiveDeviceId || deviceManagement.currentDevices.audioDeviceId,
      videoDeviceId: livekitActiveVideoDeviceId || deviceManagement.currentDevices.videoDeviceId,
      speakerDeviceId:
        livekitActiveAudioOutputDeviceId || deviceManagement.currentDevices.speakerDeviceId,
    },
    audioDevices,
    videoDevices,
    audioOutputDevices,
    onAudioToggle: handleLiveKitAudioToggle,
    onVideoToggle: handleLiveKitVideoToggle,
    onDeviceSelect: handleLiveKitDeviceSelect,
  };

  const cameraProps = {
    videoDevices: deviceManagement.videoDevices,
    permissionDenied: deviceManagement.permissionDenied,
    currentDevices: deviceManagement.currentDevices,
    cameraPermission: deviceManagement.cameraPermission,
    microphonePermission: deviceManagement.microphonePermission,
    videoTrack: videoTrack, // Pass the LiveKit video track
    onValidate: (values: any) => {
      deviceManagement.setCurrentDevices((prev) => ({
        ...prev,
        audioDeviceId: values.audioDeviceId,
        videoDeviceId: values.videoDeviceId,
        audioEnabled: values.audioEnabled ?? true,
        videoEnabled: values.videoEnabled ?? true,
      }));
    },
  };

  return (
    <div className={styles.livestreamStage__stageContainer}>
      <div className={styles.livestreamStage__stageContainer__inner}>
        <CameraPreview {...cameraProps} />
        <div className={styles.livestreamStage__deviceControls}>
          <DeviceControls {...controlsProps} />
        </div>
      </div>
    </div>
  );
};
