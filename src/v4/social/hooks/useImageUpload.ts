import { FileRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
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
          if (error.message.includes(ERROR_RESPONSE.INVALID_IMAGE)) {
            info({
              title: 'Inappropriate image',
              content: 'Please choose a different image to upload.',
            });
          } else {
            info({
              title: 'Upload failed',
              content: "We couldn't complete your upload. Please try again.",
            });
          }
        },
      },
    );
  };

  return { uploadSingleImage, isUploading: isPending };
}
