import React, { useCallback } from 'react';

import filesize from 'filesize';
import { useIntl } from 'react-intl';

import ProgressBar from '~/core/components/ProgressBar';
import {
  ButtonContainer,
  Content,
  FileContainer,
  FileIcon,
  FileName,
  FileSize,
  ImgPreview,
  RemoveButton,
  RetryButton,
} from './styles';

export interface StyledFileProps {
  'data-qa-anchor'?: string;
  name?: string;
  url?: string;
  type?: string;
  size?: number;
  progress?: number;
  isRejected?: boolean;
  onRetry?: () => void;
  onRemove?: () => void;
}

const StyledFile = ({
  'data-qa-anchor': dataQaAnchor = '',
  name,
  url,
  type,
  size,
  progress = -1,
  onRemove,
  isRejected,
  onRetry,
}: StyledFileProps) => {
  const { formatMessage } = useIntl();

  const removeCallback = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onRemove && onRemove();
    },
    [onRemove],
  );

  const retryCallback = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onRetry && onRetry();
    },
    [onRetry],
  );

  const isImg = type?.includes('image');

  const isUploading = progress < 100;

  return (
    <FileContainer href={url} download data-qa-anchor={dataQaAnchor}>
      <Content>
        {isImg && !!url ? (
          <ImgPreview src={url} />
        ) : (
          <FileIcon file={{ name, type }} width={null} height="100%" />
        )}
        <FileName>{name}</FileName> <FileSize>{filesize(size || 0, { base: 2 })}</FileSize>
        <ButtonContainer>
          {!!isRejected && <RetryButton onClick={retryCallback} />}

          {!!onRemove && (
            <RemoveButton
              data-qa-anchor="uploaders-file-remove-button"
              onClick={removeCallback}
              disabled={isUploading}
            />
          )}
        </ButtonContainer>
      </Content>

      {!Number.isNaN(progress) && <ProgressBar progress={(progress || 0) * 100} />}
    </FileContainer>
  );
};

export default StyledFile;
