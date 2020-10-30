import React, { useState } from 'react';
import { FileRepository } from 'eko-sdk';

import { readFileAsync } from '~/helpers';
import { FileInput, Label } from './styles';
import {
  Avatar,
  AvatarUploadContainer,
  AvatarWrapper,
  CameraIcon,
} from '~/social/components/CommunityForm/styles';

export const AvatarUpload = ({ disabled, setAvatarFileId, value }) => {
  const [avatar, setAvatar] = useState(value);

  const upload = async event => {
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
        <Avatar size="big" avatar={avatar} showOverlay />
        <Label htmlFor="image-upload" disabled={disabled}>
          <CameraIcon />
        </Label>
        <FileInput id="image-upload" onChange={upload} disabled={disabled} />
      </AvatarWrapper>
    </AvatarUploadContainer>
  );
};
