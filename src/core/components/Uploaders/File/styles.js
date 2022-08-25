import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import filesize from 'filesize';
import { useIntl } from 'react-intl';

import Button from '~/core/components/Button';
import ProgressBar from '~/core/components/ProgressBar';

import Remove from '~/icons/Remove';
import Icon from '~/icons/files';
import ExclamationCircle from '~/icons/ExclamationCircle';

export const FileContainer = styled.a`
  display: block;
  position: relative;
  border: 1px solid ${({ theme }) => theme.palette.base.shade4};
  border-radius: 4px;
  overflow: hidden;
  text-decoration: none;
`;

export const Content = styled.div`
  position: relative;
  display: grid;
  grid-template-areas: 'icon name size remove';
  grid-template-columns: minmax(min-content, 2em) auto max-content min-content;
  grid-template-rows: 2.5em;
  grid-gap: 0.5em;
  padding: 0.5em;
  align-items: center;
`;

export const ImgPreview = styled.img`
  grid-area: icon;
  width: 2.5em;
  height: 100%;
  object-fit: contain;
  object-position: center;
  border: 1px solid ${({ theme }) => theme.palette.base.shade4};
  border-radius: 4px;
`;

export const FileIcon = styled(Icon)`
  grid-area: icon;
`;

export const CircleIcon = styled(ExclamationCircle).attrs({ width: 14, height: 14 })`
  fill: ${({ theme }) => theme.palette.alert.main};
  z-index: 2;
`;

export const RetryButton = styled(Button).attrs({
  variant: 'secondary',
  children: <CircleIcon />,
})``;

export const FileName = styled.div`
  grid-area: name;
  padding: 0 0.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ theme }) => theme.typography.bodyBold}
`;

export const FileSize = styled.div`
  grid-area: size;
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.base.shade1};
`;

export const RemoveIcon = styled(Remove)`
  grid-area: remove;
  z-index: 2;
`;

const RemoveButton = styled(Button).attrs({
  variant: 'secondary',
  children: <RemoveIcon />,
})``;

const ButtonContainer = styled.div`
  display: flex;
`;

const File = ({
  'data-qa-anchor': dataQaAnchor,
  name,
  url,
  type,
  size,
  progress,
  onRemove,
  isRejected,
  onRetry,
}) => {
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

  const isImg = type.includes('image');

  return (
    <FileContainer href={url} download data-qa-anchor={dataQaAnchor}>
      <Content remove={!!onRemove}>
        {isImg && !!url ? (
          <ImgPreview src={url} />
        ) : (
          (<FileIcon file={{ name, type }} width={null} height="100%" />)``
        )}
        <FileName>{name}</FileName> <FileSize>{filesize(size, { base: 2 })}</FileSize>
        <ButtonContainer>
          {!!isRejected && (
            <RetryButton title={formatMessage({ id: 'file.reUpload' })} onClick={retryCallback} />
          )}

          {!!onRemove && <RemoveButton onClick={removeCallback} />}
        </ButtonContainer>
      </Content>

      {!Number.isNaN(progress) && <ProgressBar progress={progress * 100} />}
    </FileContainer>
  );
};

File.propTypes = {
  'data-qa-anchor': PropTypes.string,
  name: PropTypes.string.isRequired,
  url: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.number,
  progress: PropTypes.number,
  isRejected: PropTypes.bool,
  onRetry: PropTypes.func,
  onRemove: PropTypes.func,
};

File.defaultProps = {
  'data-qa-anchor': undefined,
  url: null,
  type: '',
  size: 0,
  progress: -1,
  onRemove: undefined,
  isRejected: false,
  onRetry: undefined,
};

export default File;
