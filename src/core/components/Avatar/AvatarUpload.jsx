import React, { useState } from 'react';
import { FileRepository } from '@amityco/js-sdk';

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

const StyledCameraIcon = styled(CameraIcon)`
  font-size: 20px;
  z-index: 3;
  position: absolute;
  left: 22px;
  top: 20px;
  cursor: pointer;
  color: #fff;
`;

export const AvatarUpload = ({ disabled, setAvatarFileId, value }) => {
  const [avatar, setAvatar] = useState(value);

  const upload = async (event) => {
    event.persist();
    const imageUrl = await readFileAsync(event.target.files[0]);
    setAvatar(imageUrl);

    const files = [...event.target.files];

    const result = await FileRepository.uploadFiles({
      files,
    });
    setAvatarFileId(result[0].fileId);
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
