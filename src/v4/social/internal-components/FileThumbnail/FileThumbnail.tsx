import filesize from 'filesize';

import FileIcon from '~/icons/files';
import { Typography } from '~/v4/core/components';
import useFile from '~/v4/core/hooks/useFile';
import CloseIcon from '~/v4/icons/Close';
import { FileItem } from '~/v4/social/hooks/useFilePostUpload';
import { isAmityFile, isImageFile, isVideoFile } from '~/v4/utils/checkFileType';

import styles from './FileThumbnail.module.css';

type FileThumbnailProps = {
  pageId?: string;
  componentId?: string;
  /** Existing file children already attached to the post. */
  postFiles?: Amity.Post<'file'>[];
  /** Newly selected files from the composer (filtered to non-image/video). */
  files?: FileItem[];
  onRemovePostFile?: (fileId: string) => void;
  removeFile?: (file: Amity.File | File, index?: number) => void;
};

export function FileThumbnail({
  postFiles = [],
  files = [],
  onRemovePostFile,
  removeFile,
  pageId = '*',
  componentId = '*',
}: FileThumbnailProps) {
  const newFiles = files.filter((file) => !isImageFile(file) && !isVideoFile(file));

  if (postFiles.length === 0 && newFiles.length === 0) return null;

  return (
    <div className={styles.fileThumbnail}>
      {postFiles.map((post) => (
        <PostFileItem
          key={post.postId}
          post={post}
          pageId={pageId}
          componentId={componentId}
          onRemove={() => onRemovePostFile?.(post.data?.fileId as string)}
        />
      ))}
      {newFiles.map((item) => (
        <NewFileItem
          key={item.id}
          item={item}
          pageId={pageId}
          componentId={componentId}
          onRemove={() => removeFile?.(item.file)}
        />
      ))}
    </div>
  );
}

type FileRowProps = {
  name: string;
  size: number;
  type?: string;
  pageId?: string;
  componentId?: string;
  onRemove?: () => void;
};

function FileRow({ name, size, type, onRemove, pageId = '*', componentId = '*' }: FileRowProps) {
  return (
    <div
      className={styles.fileThumbnail__item}
      data-testid={`${pageId}/${componentId}/edit_post_file`}
    >
      <span className={styles.fileThumbnail__icon}>
        <FileIcon file={{ name, type: type ?? '' }} />
      </span>
      <span className={styles.fileThumbnail__info}>
        <Typography.BodyBold as="span" className={styles.fileThumbnail__name}>
          {name}
        </Typography.BodyBold>
        {!Number.isNaN(size) && size > 0 && (
          <Typography.Caption className={styles.fileThumbnail__size}>
            {filesize(size, { base: 2 })}
          </Typography.Caption>
        )}
      </span>
      <button
        type="button"
        className={styles.fileThumbnail__remove}
        onClick={onRemove}
        aria-label="Remove file"
      >
        <CloseIcon className={styles.fileThumbnail__removeIcon} />
      </button>
    </div>
  );
}

type PostFileItemProps = {
  post: Amity.Post<'file'>;
  pageId?: string;
  componentId?: string;
  onRemove?: () => void;
};

function PostFileItem({ post, onRemove, pageId, componentId }: PostFileItemProps) {
  const file = useFile(post.data?.fileId);

  return (
    <FileRow
      name={file?.attributes?.name ?? 'File'}
      size={Number(file?.attributes?.size)}
      type={file?.attributes?.mimeType}
      onRemove={onRemove}
      pageId={pageId}
      componentId={componentId}
    />
  );
}

type NewFileItemProps = {
  item: FileItem;
  pageId?: string;
  componentId?: string;
  onRemove?: () => void;
};

function NewFileItem({ item, onRemove, pageId, componentId }: NewFileItemProps) {
  const { file } = item;
  const name = isAmityFile(file) ? file.attributes?.name ?? 'File' : file.name;
  const size = isAmityFile(file) ? Number(file.attributes?.size) : file.size;
  const type = isAmityFile(file) ? file.attributes?.mimeType : file.type;

  return (
    <FileRow
      name={name}
      size={size}
      type={type}
      onRemove={onRemove}
      pageId={pageId}
      componentId={componentId}
    />
  );
}
