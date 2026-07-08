import { FileRepository } from '@amityco/ts-sdk';
import { resolveString } from '~/v4/core/localization';
import { useMutation } from '@tanstack/react-query';
import { ERROR_CODE, ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

type UploadImageResponse = Awaited<ReturnType<typeof FileRepository.uploadImage>>;

type UploadImageParams = Parameters<typeof FileRepository.uploadImage>;

type UploadImagePayload = {
  file: UploadImageParams[0];
  onProgress?: UploadImageParams[1];
  altText?: UploadImageParams[2];
};

type UploadSingleImageParams = {
  file: File;
  onProgress?: UploadImagePayload['onProgress'];
  altText?: UploadImagePayload['altText'];
};

export default function useImageUpload() {
  const { info } = useConfirmContext();

  const { mutateAsync, isPending } = useMutation<UploadImageResponse, Error, UploadImagePayload>({
    mutationFn: ({ file, onProgress, altText }) =>
      FileRepository.uploadImage(file, onProgress, altText),
  });

  const uploadSingleImage = async ({ file, onProgress, altText }: UploadSingleImageParams) => {
    const formData = new FormData();
    formData.append('file', file);

    return await mutateAsync(
      {
        file: formData,
        onProgress,
        altText,
      },
      {
        onError: (error) => {
          const isInappropriate =
            error.message.includes(ERROR_RESPONSE.INVALID_IMAGE) ||
            error.message.includes(ERROR_CODE.VIOLENT_CONTENT);
          if (isInappropriate) {
            info({
              title: resolveString('amity_social_button_inappropriate_image'),
              content: resolveString('amity_social_modal_dialog_image_upload_error'),
            });
          } else {
            info({
              title: resolveString('amity_social_error_upload_failed_title'),
              content: resolveString('amity_social_upload_not_complete'),
            });
          }
        },
      },
    );
  };

  return { uploadSingleImage, isUploading: isPending };
}
