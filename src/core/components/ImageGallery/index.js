import React from 'react';

import customizableComponent from '~/core/hocs/customization';
import useKeyboard from '~/core/hooks/useKeyboard';

import {
  Container,
  Frame,
  Counter,
  LeftButton,
  RightButton,
  CloseButton,
  ImageRenderer,
} from './styles';

const ImageGallery = ({ index = 0, items = [], children, onChange, showCounter = true }) => {
  const [render = ImageRenderer] = [].concat(children);

  const handleClose = () => onChange(null);

  const next = () => onChange(index + 1 < items.length ? index + 1 : 0);
  const prev = () => onChange(index - 1 >= 0 ? index - 1 : items.length - 1);

  const listeners = {
    ArrowLeft: prev,
    ArrowRight: next,
    Escape: handleClose,
  };

  const params = {
    ignoreOtherKeys: true,
  };

  useKeyboard(listeners, params);

  return (
    <Container length={items.length}>
      <Frame>{render(items[index])}</Frame>

      {showCounter && (
        <Counter>
          {`${index + 1} / ${items.length}`}
        </Counter>
      )}

      {items.length > 1 && <LeftButton onClick={prev} />}
      {items.length > 1 && <RightButton onClick={next} />}

      <CloseButton onClick={handleClose} />
    </Container>
  );
};

export default customizableComponent('ImageGallery', ImageGallery);
