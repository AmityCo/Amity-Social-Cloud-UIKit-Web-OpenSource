import React, { ReactNode } from 'react';

import useKeyboard from '~/core/hooks/useKeyboard';

import {
  Container,
  Frame,
  Counter,
  LeftButton,
  RightButton,
  CloseButton,
  InnerContainer,
  GridContainer,
} from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import { useMedia } from 'react-use';

interface ImageGalleryProps<T extends Amity.Post> {
  index?: number;
  items?: T[];
  renderItem: (item: T) => ReactNode;
  onChange?: (index: number | null) => void;
  showCounter?: boolean;
}

const ImageGallery = <T extends Amity.Post>({
  index = 0,
  items = [],
  renderItem,
  onChange,
  showCounter = true,
}: ImageGalleryProps<T>) => {
  const handleClose = () => onChange?.(null);

  const next = () => onChange?.(index + 1 < items.length ? index + 1 : 0);
  const prev = () => onChange?.(index - 1 >= 0 ? index - 1 : items.length - 1);

  useKeyboard('ArrowLeft', prev);
  useKeyboard('ArrowRight', next);
  useKeyboard('Escape', handleClose);

  const isDesktop = useMedia('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Container>
        <InnerContainer>
          <GridContainer>
            <Frame>{renderItem(items[index])}</Frame>

            {showCounter && <Counter>{`${index + 1} / ${items.length}`}</Counter>}

            {items.length > 1 && <LeftButton onClick={prev} />}
            {items.length > 1 && <RightButton onClick={next} />}

            <CloseButton onClick={handleClose} />
          </GridContainer>
        </InnerContainer>
      </Container>
    );
  }

  return (
    <Container>
      <InnerContainer>
        <Frame>{renderItem(items[index])}</Frame>
        <GridContainer>
          {showCounter && <Counter>{`${index + 1} / ${items.length}`}</Counter>}

          {items.length > 1 && <LeftButton onClick={prev} />}
          {items.length > 1 && <RightButton onClick={next} />}

          <CloseButton onClick={handleClose} />
        </GridContainer>
      </InnerContainer>
    </Container>
  );
};

export default (props: ImageGalleryProps<Amity.Post>) => {
  const CustomComponentFn = useCustomComponent<ImageGalleryProps<Amity.Post>>('ImageGallery');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <ImageGallery {...props} />;
};
