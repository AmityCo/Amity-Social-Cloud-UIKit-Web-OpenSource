import React, { useCallback } from 'react';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components';
import { Popover } from '~/v4/core/components/AriaPopover';
import { ChevronDown } from '~/v4/icons/ChevronDown';
import { ChevronTop } from '~/v4/icons/ChevronTop';
import MuteMic from '~/v4/icons/MutedMic';
import Mic from '~/v4/icons/Mic';
import VideoCamera from '~/v4/icons/VideoCamera';
import Speaker from '~/v4/icons/Speaker';
import { CurrentDevices } from '~/v4/core/hooks/useDeviceManagement';
import { MediaDeviceInfo } from '~/v4/core/hooks/useMediaPermissions';
import styles from './DeviceControls.module.css';

export interface DeviceControlsProps {
  currentDevices: CurrentDevices;
  audioDevices: MediaDeviceInfo[];
  videoDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  onAudioToggle: () => void;
  onDeviceSelect: (deviceType: 'audio' | 'video' | 'speaker', deviceId: string) => void;
}

type ControlButtonInput = {
  icon: React.JSX.Element;
  onPressIcon?: () => void;
  devices?: MediaDeviceInfo[];
  selectedDevice?: string;
  onDeviceSelect?: (deviceId: string) => void;
};

export const DeviceControls: React.FC<DeviceControlsProps> = ({
  currentDevices,
  audioDevices,
  videoDevices,
  audioOutputDevices,
  onAudioToggle,
  onDeviceSelect,
}) => {
  const renderDeviceMenu = useCallback(
    (
      devices: MediaDeviceInfo[],
      selectedDevice: string,
      onDeviceSelectLocal: (deviceId: string) => void,
    ) => {
      return (
        <div className={styles.deviceControls__deviceMenu}>
          {devices.map((device) => (
            <Button
              key={device.deviceId}
              variant="default"
              className={styles.deviceControls__deviceMenu__item}
              onPress={() => onDeviceSelectLocal(device.deviceId)}
              data-selected={selectedDevice === device.deviceId}
            >
              <Typography.Body className={styles.deviceControls__deviceMenu__itemText}>
                {device.label}
              </Typography.Body>
            </Button>
          ))}
        </div>
      );
    },
    [],
  );

  const renderControlButton = useCallback(
    ({
      icon,
      onPressIcon,
      devices,
      selectedDevice,
      onDeviceSelect: onDeviceSelectLocal,
    }: ControlButtonInput) => {
      return (
        <>
          {devices && devices.length > 0 ? (
            <Popover
              placement="top start"
              offset={20}
              trigger={({ openPopover, closePopover, isOpen }) => (
                <div className={styles.deviceControls__controls__button}>
                  <Button
                    className={styles.deviceControls__controls__iconButton}
                    variant="default"
                    data-pressable={!onPressIcon}
                    onPress={onPressIcon}
                  >
                    {icon}
                  </Button>
                  {isOpen ? (
                    <Button variant="default" onPress={closePopover}>
                      <ChevronTop className={styles.deviceControls__controls__dropdownIcon} />
                    </Button>
                  ) : (
                    <Button variant="default" onPress={openPopover}>
                      <ChevronDown className={styles.deviceControls__controls__dropdownIcon} />
                    </Button>
                  )}
                </div>
              )}
            >
              {({ closePopover }) =>
                devices && selectedDevice && onDeviceSelectLocal
                  ? renderDeviceMenu(devices, selectedDevice, (deviceId) => {
                      onDeviceSelectLocal(deviceId);
                      closePopover();
                    })
                  : null
              }
            </Popover>
          ) : (
            <Button variant="default" isDisabled={true} onPress={() => {}}>
              <ChevronDown className={styles.deviceControls__controls__dropdownIcon} />
            </Button>
          )}
        </>
      );
    },
    [renderDeviceMenu],
  );

  return (
    <div className={styles.deviceControls__controls}>
      <div className={styles.deviceControls__controls__buttonWrap}>
        {renderControlButton({
          icon: currentDevices.audioEnabled ? (
            <Mic className={styles.deviceControls__controls__icon} />
          ) : (
            <MuteMic className={styles.deviceControls__controls__icon} />
          ),
          onPressIcon: onAudioToggle,
          devices: audioDevices,
          selectedDevice: currentDevices.audioDeviceId,
          onDeviceSelect: (deviceId) => onDeviceSelect('audio', deviceId),
        })}
        {renderControlButton({
          icon: (
            <VideoCamera className={styles.deviceControls__controls__icon} data-disabled={true} />
          ),
          devices: videoDevices,
          selectedDevice: currentDevices.videoDeviceId,
          onDeviceSelect: (deviceId) => onDeviceSelect('video', deviceId),
        })}
        {renderControlButton({
          icon: <Speaker className={styles.deviceControls__controls__icon} data-disabled={true} />,
          devices: audioOutputDevices,
          selectedDevice: currentDevices.speakerDeviceId,
          onDeviceSelect: (deviceId) => onDeviceSelect('speaker', deviceId),
        })}
      </div>
    </div>
  );
};
