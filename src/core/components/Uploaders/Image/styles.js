import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from '~/core/components/Button';
import { ProgressBar } from '~/core/components/ProgressBar';

import RemoveIcon from '~/icons/Remove';

export const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  min-width: 2em;
  min-height: 2em;
  border: 1px solid ${({ theme }) => theme.palette.base.shade4};
  border-radius: 4px;
  overflow: hidden;
  ${({ fullSize }) => fullSize && 'width: 100%;'}
`;

export const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const ImgPreview = styled.img`
  display: block;
  height: 100%;
  ${({ fullSize }) => fullSize && 'width: 100%;'}
  object-fit: contain;
  object-position: center;
`;

export const RemoveButton = styled(Button)`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`;

const Image = ({ url, progress, onRemove, fullSize }) => {
  const removeCallback = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      onRemove && onRemove();
    },
    [onRemove],
  );

  return (
    <ImageContainer fullSize={fullSize}>
      <Content remove={!!onRemove}>
        <ImgPreview src={url} fullSize={fullSize} />
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
  url: PropTypes.string.isRequired,
  progress: PropTypes.number,
  onRemove: PropTypes.func,
  fullSize: PropTypes.bool,
};

Image.defaultProps = {
  progress: -1,
  onRemove: null,
};

export default Image;
