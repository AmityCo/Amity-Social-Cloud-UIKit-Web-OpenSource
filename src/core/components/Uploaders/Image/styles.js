import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import Button from '~/core/components/Button';
import Skeleton from '~/core/components/Skeleton';
import ProgressBar from '~/core/components/ProgressBar';

import RemoveIcon from '~/icons/Remove';

export const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  min-width: 2em;
  min-height: 2em;
  width: 100%;
  height: 100%;
  border: ${({ theme, border }) => border && `1px solid ${theme.palette.base.shade4}`};
  border-radius: 4px;
  overflow: hidden;
`;

export const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ImgPreviewContainerStyles = css`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: ${({ imageFit }) => imageFit ?? 'cover'};
  object-position: center;
`;

export const ImgPreview = styled.img`
  ${ImgPreviewContainerStyles}
`;

export const SkeletonWrapper = styled.div`
  ${ImgPreviewContainerStyles}
`;

export const RemoveButton = styled(Button)`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`;

const Image = ({ url, progress, imageFit, noBorder, onRemove }) => {
  const removeCallback = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      onRemove && onRemove();
    },
    [onRemove],
  );

  return (
    <ImageContainer border={!noBorder}>
      <Content remove={!!onRemove}>
        {url ? (
          <ImgPreview src={url} imageFit={imageFit} />
        ) : (
          <SkeletonWrapper imageFit={imageFit}>
            <Skeleton />
          </SkeletonWrapper>
        )}

        {!!onRemove && (
          <RemoveButton variant="secondary" onClick={removeCallback}>
            <RemoveIcon />
          </RemoveButton>
        )}
      </Content>

      {!Number.isNaN(progress) && <ProgressBar progress={progress * 100} />}
    </ImageContainer>
  );
};

Image.propTypes = {
  url: PropTypes.string,
  progress: PropTypes.number,
  imageFit: PropTypes.oneOf(['cover', 'contain']),
  noBorder: PropTypes.bool,
  onRemove: PropTypes.func,
};

Image.defaultProps = {
  url: undefined,
  progress: -1,
  onRemove: null,
};

export default Image;
