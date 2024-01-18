import React, { useState, ChangeEvent, ReactNode } from 'react';
import { FileRepository } from '@amityco/ts-sdk';

import styled from 'styled-components';
import { readFileAsync } from '~/helpers';
import { FileInput, Label } from './styles';

import { backgroundImage as UserImage } from '~/icons/User';
import CameraIcon from '~/icons/Camera';

import {
  Avatar,
  AvatarUploadContainer,
  AvatarWrapper,
} from '~/social/components/CommunityForm/styles';

interface AvatarUploadProps {
  disabled: boolean;
  setAvatarFileId: React.Dispatch<React.SetStateAction<string>>;
  value: string;
}

const StyledCameraIcon = styled(CameraIcon)<{ icon?: ReactNode }>`
  font-size: 20px;
  z-index: 3;
  position: absolute;
  left: 22px;
  top: 20px;
  cursor: pointer;
  color: #fff;
`;

export const AvatarUpload = ({ disabled, setAvatarFileId, value }: AvatarUploadProps) => {
  const [avatar, setAvatar] = useState(value);

  const upload: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    event.persist();
    const imageUrl = await readFileAsync(event.target.files![0]);
    setAvatar(imageUrl);

    // FIXME: SSR issue formData is client only
    const formData = new FormData();
    formData.append('files', event.target.files![0]);
    const result = await FileRepository.createFile(formData);
    setAvatarFileId(result.data[0].fileUrl);
  };

  return (
    <AvatarUploadContainer>
      <AvatarWrapper>
        <Avatar size="big" avatar={avatar} backgroundImage={UserImage} showOverlay />
        <Label htmlFor="image-upload" disabled={disabled}>
          <StyledCameraIcon />
        </Label>
        <FileInput id="image-upload" disabled={disabled} onChange={upload} />
      </AvatarWrapper>
    </AvatarUploadContainer>
  );
};
