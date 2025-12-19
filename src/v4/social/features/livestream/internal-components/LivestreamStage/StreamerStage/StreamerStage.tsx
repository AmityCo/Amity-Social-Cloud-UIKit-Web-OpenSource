import React, { FC, useEffect, useMemo, useState, useCallback } from 'react';
import {
  isTrackReference,
  LiveKitRoom,
  RoomAudioRenderer,
  TrackLoop,
  TrackRefContext,
  useTracks,
  VideoTrack,
  useDisconnectButton,
  useMediaDeviceSelect,
  useLocalParticipant,
  useRoomContext,
} from '@livekit/components-react';

// Type assertions for LiveKit components to fix TypeScript issues
const LiveKitRoomComponent = LiveKitRoom as any;
const VideoTrackComponent = VideoTrack as any;

import { Room, Track, LocalAudioTrack, LocalVideoTrack } from 'livekit-client';
import { useDeviceManagement } from '~/v4/core/hooks/useDeviceManagement';
import { DeviceControls } from '~/v4/social/features/livestream/internal-components/DeviceControls';
import styles from './StreamerStage.module.css';
import { CoHostPlaceholder } from './CoHostPlaceholder';
import { ParticipantHeader } from './ParticipantHeader';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { useLeaveRoom } from '~/v4/social/features/livestream/hooks/useLeaveRoom';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import useSDK from '~/v4/core/hooks/useSDK';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { InvitationStatusEnum } from '@amityco/ts-sdk';
import { PAGE_ID } from '~/v4/constants/customization';
import MuteMic from '~/v4/icons/MutedMic';

interface StreamerStageProps {
  pageId?: string;
  broadcasterData: Amity.BroadcasterData;
  deviceManagement: ReturnType<typeof useDeviceManagement>;
  onLeaveStreamStage?: () => void;
  onCoHostLeaveRequest?: (handler: () => void) => void;
}

const Stage = ({
  pageId,
  onLeaveStreamStage,
  deviceManagement,
  onCoHostLeaveRequest,
}: {
  pageId?: string;
  onLeaveStreamStage?: () => void;
  deviceManagement: ReturnType<typeof useDeviceManagement>;
  onCoHostLeaveRequest?: (handler: () => void) => void;
}) => {
  // Get values from context
  const [isLeaving, setIsLeaving] = useState(false);

  const { room, hostId, invitationByMe, coHost } = useLivestreamData();

  const { currentUserId } = useSDK();
  const { confirm } = useConfirmContext();
  const { buttonProps } = useDisconnectButton({});
  const { leaveRoom } = useLeaveRoom({ room });

  // LiveKit device management (inside room context)
  const { localParticipant } = useLocalParticipant();
  const liveKitRoom = useRoomContext();

  // Get current audio and video tracks
  const audioTrack = Array.from(localParticipant.audioTrackPublications.values()).find(
    (pub) => pub.track,
  )?.track as LocalAudioTrack | undefined;

  const videoTrack = Array.from(localParticipant.videoTrackPublications.values()).find(
    (pub) => pub.track,
  )?.track as LocalVideoTrack | undefined;

  // Device selection hooks
  const {
    devices: livekitAudioDevices,
    activeDeviceId: livekitActiveAudioDeviceId,
    setActiveMediaDevice: setActiveAudioMediaDevice,
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
  const handleLiveKitAudioToggle = useCallback(async () => {
    if (audioTrack) {
      // Audio track exists, just toggle mute state
      if (audioTrack.isMuted) {
        audioTrack.unmute();
      } else {
        audioTrack.mute();
      }
    } else {
      // No audio track exists, need to enable audio on the room
      try {
        await liveKitRoom.localParticipant.setMicrophoneEnabled(true);
      } catch (error) {
        console.error('Failed to enable microphone:', error);
      }
    }
  }, [audioTrack, liveKitRoom]);

  // Handle video toggle for LiveKit
  const handleLiveKitVideoToggle = useCallback(async () => {
    if (videoTrack) {
      // Video track exists, just toggle mute state
      if (videoTrack.isMuted) {
        videoTrack.unmute();
      } else {
        videoTrack.mute();
      }
    } else {
      // No video track exists, need to enable camera on the room
      try {
        await liveKitRoom.localParticipant.setCameraEnabled(true);
      } catch (error) {
        console.error('Failed to enable camera:', error);
      }
    }
  }, [videoTrack, liveKitRoom]);

  // Handle device selection for LiveKit
  const handleLiveKitDeviceSelect = useCallback(
    (deviceType: 'audio' | 'video' | 'speaker', deviceId: string) => {
      switch (deviceType) {
        case 'audio':
          setActiveAudioMediaDevice(deviceId);
          break;
        case 'video':
          setActiveVideoMediaDevice(deviceId);
          break;
        case 'speaker':
          setActiveAudioOutputMediaDevice(deviceId);
          break;
      }
    },
    [setActiveAudioMediaDevice, setActiveVideoMediaDevice, setActiveAudioOutputMediaDevice],
  );

  // Convert LiveKit devices to our format
  const audioDevices = livekitAudioDevices.map((device) => ({
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

  // Audio is considered enabled if we have a track that's not muted,
  // or if we don't have a track but audio was enabled initially
  const audioEnabled = audioTrack
    ? !audioTrack.isMuted
    : deviceManagement.currentDevices.audioEnabled;

  // Video is considered enabled if we have a track that's not muted,
  // or if we don't have a track but video was enabled initially
  const videoEnabled = videoTrack
    ? !videoTrack.isMuted
    : deviceManagement.currentDevices.videoEnabled;

  // Device controls props for LiveKit - with fallback to deviceManagement initial states
  const controlsProps = {
    currentDevices: {
      audioEnabled,
      videoEnabled,
      audioDeviceId:
        livekitActiveAudioDeviceId || deviceManagement.currentDevices.audioDeviceId || '',
      videoDeviceId:
        livekitActiveVideoDeviceId || deviceManagement.currentDevices.videoDeviceId || '',
      speakerDeviceId:
        livekitActiveAudioOutputDeviceId || deviceManagement.currentDevices.speakerDeviceId || '',
    },
    audioDevices: audioDevices.length > 0 ? audioDevices : deviceManagement.audioDevices,
    videoDevices: videoDevices.length > 0 ? videoDevices : deviceManagement.videoDevices,
    audioOutputDevices:
      audioOutputDevices.length > 0 ? audioOutputDevices : deviceManagement.audioOutputDevices,
    onAudioToggle: handleLiveKitAudioToggle,
    onVideoToggle: handleLiveKitVideoToggle,
    onDeviceSelect: handleLiveKitDeviceSelect,
  };

  const handleLeaveAsCoHost = () => {
    buttonProps.onClick();
    leaveRoom();
    // Co-host leave any stage, change ui back to player
    onLeaveStreamStage?.();
  };

  const onCoHostLeaveLiveKitRoom = useCallback(() => {
    confirm({
      type: 'confirm',
      okButtonColor: 'alert',
      onOk: () => handleLeaveAsCoHost(),
      okText: 'Leave',
      cancelText: 'Cancel',
      title: 'Leave as co-host',
      pageId: '*',
      content:
        "Are you sure you want to stop co-hosting? You'll leave the stage and continue watching as a viewer.",
    });
  }, [confirm, handleLeaveAsCoHost]);

  // Expose the leave handler to parent via callback
  useEffect(() => {
    if (hostId !== currentUserId && onCoHostLeaveRequest) {
      onCoHostLeaveRequest(() => {
        // only for leaving the state
        buttonProps.onClick();
        leaveRoom();
      });
    }
  }, [hostId, currentUserId, onCoHostLeaveRequest, onCoHostLeaveLiveKitRoom]);

  const onLeaveByKickout = () => {
    buttonProps.onClick();
    onLeaveStreamStage?.();
  };

  const allTracks = useTracks([
    {
      source: Track.Source.Camera,
      withPlaceholder: false,
    },
  ]);

  // Sort tracks to put host first
  const tracks = useMemo(() => {
    // Filter out local participant track from allTracks
    const filteredTracks = allTracks.filter(
      (track) => track.participant?.identity !== localParticipant.identity,
    );

    // Create local participant track object
    const localTrack = {
      participant: localParticipant,
      publication: videoTrack
        ? Array.from(localParticipant.videoTrackPublications.values())[0]
        : undefined,
      source: Track.Source.Camera,
    };

    const hasLocalTrack = localTrack.publication;

    // If on create livestream page, add local track at the beginning
    if (pageId === PAGE_ID.CREATE_LIVESTREAM_PAGE && hasLocalTrack) {
      return [localTrack, ...filteredTracks];
    }

    // For other pages, sort by host first, then add local track at the end
    if (filteredTracks.length <= 1) {
      return hasLocalTrack ? [...filteredTracks, localTrack] : filteredTracks;
    }

    const hostTrack = filteredTracks.find((track) => track.participant?.name === hostId);
    const otherTracks = filteredTracks.filter((track) => track.participant?.name !== hostId);
    const sortedTracks = hostTrack ? [hostTrack, ...otherTracks] : filteredTracks;

    // Add local track at the end for non-create-livestream pages
    return hasLocalTrack ? [...sortedTracks, localTrack] : sortedTracks;
  }, [allTracks, room?.participants, hostId, localParticipant, videoTrack, pageId]);

  const isCoHostView =
    tracks.length === 2 || (tracks.length === 1 && (!!invitationByMe || !!coHost));

  useEffect(() => {
    if (hostId !== currentUserId && !coHost && tracks?.length === 2 && !isLeaving) {
      setIsLeaving(true);
      onLeaveByKickout();
    }
  }, [coHost, tracks?.length, currentUserId, hostId, isLeaving]);

  return (
    <>
      <div className={styles.streamerStage__videoContainer} data-co-host={isCoHostView}>
        <TrackLoop tracks={tracks}>
          <TrackRefContext.Consumer>
            {(trackRef) =>
              trackRef && (
                <div
                  className={styles.streamerStage_videoItem__container}
                  data-co-host={isCoHostView}
                >
                  {isTrackReference(trackRef) && (
                    <div
                      className={styles.streamerStage_videoItem__container__inner}
                      data-co-host={isCoHostView}
                    >
                      <VideoTrackComponent
                        trackRef={trackRef}
                        className={styles.streamerStage_video}
                      />
                      {((pageId === PAGE_ID.CREATE_LIVESTREAM_PAGE &&
                        trackRef.participant.identity === localParticipant.identity) ||
                        (pageId !== PAGE_ID.CREATE_LIVESTREAM_PAGE &&
                          trackRef.participant.identity !== localParticipant.identity)) &&
                        !trackRef.participant.isMicrophoneEnabled && (
                          <div className={styles.streamerStage__localMutedIndicator}>
                            <MuteMic className={styles.streamerStage__localMutedIndicator__icon} />
                          </div>
                        )}

                      {((pageId !== PAGE_ID.CREATE_LIVESTREAM_PAGE &&
                        trackRef.participant.identity === localParticipant.identity) ||
                        (pageId === PAGE_ID.CREATE_LIVESTREAM_PAGE &&
                          trackRef.participant.identity !== localParticipant.identity)) && (
                        <ParticipantHeader
                          showOptions={true}
                          onCoHostLeaveLiveKitRoom={onCoHostLeaveLiveKitRoom}
                          isMuted={!trackRef.participant.isMicrophoneEnabled}
                        />
                      )}
                    </div>
                  )}
                </div>
              )
            }
          </TrackRefContext.Consumer>
        </TrackLoop>
        {tracks.length !== 2 && (invitationByMe || coHost) && <CoHostPlaceholder />}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <DeviceControls {...controlsProps} />
      </div>
    </>
  );
};

export const StreamerStage: FC<StreamerStageProps> = ({
  pageId = '*',
  broadcasterData,
  deviceManagement,
  onLeaveStreamStage,
  onCoHostLeaveRequest,
}) => {
  // Get values from context
  const { room, invitationByMe, setInvitationByMe } = useLivestreamData();
  const { success } = useNotifications();
  const [liveKitRoom] = useState(new Room());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (room?.participants.length === 2) setInvitationByMe?.(undefined);
  }, [room?.participants?.length]);

  useEffect(() => {
    if (invitationByMe?.status === InvitationStatusEnum.Approved) {
      success({ content: 'Co-host accepted the invitation.' });
      setInvitationByMe?.(undefined);
    }
  }, [invitationByMe?.status]);

  useEffect(() => {
    if (invitationByMe?.status === InvitationStatusEnum.Rejected) {
      success({ content: 'Co-host declined the invitation.' });
      setInvitationByMe?.(undefined);
    }
  }, [invitationByMe?.status]);

  useEffect(() => {
    if (invitationByMe?.status === InvitationStatusEnum.Cancelled) {
      setInvitationByMe?.(undefined);
    }
  }, [invitationByMe?.status]);

  const { audioDeviceId, audioEnabled, videoDeviceId, videoEnabled } =
    deviceManagement.currentDevices;

  const handleDisconnect = () => {
    setConnected(false);
  };

  return (
    <div className={styles.streamerStage}>
      <LiveKitRoomComponent
        room={liveKitRoom}
        token={broadcasterData.coHostToken}
        serverUrl={broadcasterData.coHostUrl}
        connect={true}
        onConnected={() => {
          setConnected(true);
        }}
        onDisconnected={handleDisconnect}
        audio={audioEnabled ? (audioDeviceId ? { deviceId: audioDeviceId } : true) : false}
        video={videoEnabled ? (videoDeviceId ? { deviceId: videoDeviceId } : true) : false}
        onError={(e: any) => {
          console.error('LiveKitRoom Error:', e);
        }}
        className={styles.streamerStage__roomContainer}
      >
        <RoomAudioRenderer />
        {connected && (
          <Stage
            onLeaveStreamStage={onLeaveStreamStage}
            deviceManagement={deviceManagement}
            pageId={pageId}
            onCoHostLeaveRequest={onCoHostLeaveRequest}
          />
        )}
      </LiveKitRoomComponent>
    </div>
  );
};
