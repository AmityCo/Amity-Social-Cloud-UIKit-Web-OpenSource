import { FileRepository, ImageSize } from '@amityco/js-sdk';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Uploader from '~/core/components/Uploaders/Uploader';

import UploaderImage from '~/core/components/Uploaders/Image';
import Loader from '~/core/components/Uploaders/Loader';
import CameraIcon from '~/icons/Camera';

const StyledCameraIcon = styled(CameraIcon)`
  z-index: 3;
  fill: #fff;
`;

const AvatarUploadContainer = styled.div`
  background: ${({ theme }) => theme.palette.base.shade3};
  border-radius: 4px;
  position: relative;
  display: block;
  width: 100%;
  height: 16.875rem;
  overflow: hidden;
  align-self: center;
  transition: background 0.2s linear;
`;

const AvatarUploadButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  display: flex;
  background: transparent;
  border: 1px solid #ffffff;
  padding: 10px 16px;
  border-radius: 4px;
  color: #ffffff;
`;

const CoverImageLoader = styled(Loader)`
  display: inline-block;
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 0;
  top: 0;
  left: 0;
  opacity: 0;
`;

const BgImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
`;

const ImageRenderer = ({ uploading, uploaded, progress }) => {
  const file = [...uploading, ...uploaded].sort((a, b) => b.updatedAt - a.updatedAt)[0];

  if (!file?.fileId)
    return (
      <UploaderImage
        className="!border-none"
        key={file?.name}
        file={file}
        progress={progress[file?.name]}
      />
    );

  const { fileId } = file;
  return <UploaderImage className="!border-none" key={fileId} fileId={fileId} />;
};

const AvatarUploader = ({
  'data-qa-anchor': dataQaAnchor = '',
  mimeType,
  onChange,
  value: avatarFileId,
}) => {
  const [loadedAvatar, setLoadedAvatar] = useState([]);

  const handleChange = (files) => {
    const file = files[files.length - 1];
    file?.fileId && onChange(file.fileId);
  };

  // TODO: this is temporary - we should use file.fileUrl when supported.
  const fileUrl = useMemo(
    () =>
      avatarFileId &&
      FileRepository.getFileUrlById({
        fileId: avatarFileId,
        imageSize: ImageSize.Medium,
      }),
    [avatarFileId],
  );
  return (
    <div className="w-fit h-fit relative mx-auto p-[6px]">
      <AvatarUploadContainer className="!w-16 !h-16 !rounded-full">
        <Uploader files={loadedAvatar} onChange={handleChange}>
          <ImageRenderer />
        </Uploader>
        <BgImage src={fileUrl ?? communityCoverPlaceholder} />
        <CoverImageLoader
          data-qa-anchor={`${dataQaAnchor}-avatar-uploader`}
          mimeType={mimeType}
          onChange={(newAvatar) => setLoadedAvatar(newAvatar)}
        >
          <AvatarUploadButton>
            <StyledCameraIcon width={20} height={20} /> &nbsp; Upload image
          </AvatarUploadButton>
        </CoverImageLoader>
      </AvatarUploadContainer>
      {/* <Avatar
        className="!w-16 !h-16"
        data-qa-anchor="profile-setting-avatar"
        avatar={fileUrl}
        onClick={() => onClickUser(userId)} // add functionallity that directs to profile page on click.
      /> */}
      {/* <Uploader files={loadedAvatar} onChange={handleChange}>
          <ImageRenderer />
        </Uploader> */}
      <CoverImageLoader
        className=""
        data-qa-anchor={`${dataQaAnchor}-avatar-uploader`}
        mimeType={mimeType}
        onChange={(newAvatar) => setLoadedAvatar(newAvatar)}
      ></CoverImageLoader>
      <div className="z-1001 w-7 h-7 bg-white absolute bottom-0 right-0 rounded-full flex justify-center items-center">
        <div className="w-[85%] h-[85%] bg-[#EBECEF] rounded-full flex justify-center items-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.3516 4.6875H13.6875V12.5625H2.3125V4.6875H5.62109L6.27734 2.9375H9.69531L10.3516 4.6875ZM9.85938 1.625H6.27734C5.73047 1.625 5.23828 1.98047 5.04688 2.5L4.71875 3.375H2.3125C1.57422 3.375 1 3.97656 1 4.6875V12.5625C1 13.3008 1.57422 13.875 2.3125 13.875H13.6875C14.3984 13.875 15 13.3008 15 12.5625V4.6875C15 3.97656 14.3984 3.375 13.6875 3.375H11.2812L10.8711 2.33594C10.707 1.92578 10.3242 1.625 9.85938 1.625ZM8 11.9062C9.80469 11.9062 11.2812 10.457 11.2812 8.625C11.2812 6.82031 9.80469 5.34375 8 5.34375C6.16797 5.34375 4.71875 6.82031 4.71875 8.625C4.71875 10.457 6.16797 11.9062 8 11.9062ZM8 6.65625C9.06641 6.65625 9.96875 7.55859 9.96875 8.625C9.96875 9.71875 9.06641 10.5938 8 10.5938C6.90625 10.5938 6.03125 9.71875 6.03125 8.625C6.03125 7.55859 6.90625 6.65625 8 6.65625Z"
              fill="#292B32"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
{
  /* <StyledCameraIcon width={20} height={20} /> &nbsp; Upload image */
}
//

export default AvatarUploader;
