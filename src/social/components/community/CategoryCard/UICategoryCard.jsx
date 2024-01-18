import React from 'react';
import PropTypes from 'prop-types';

import Truncate from 'react-truncate-markup';

import Skeleton from '~/core/components/Skeleton';
import customizableComponent from '~/core/hocs/customization';

import { Container, Content, Name } from './styles';

const UICategoryCard = ({
  className,
  categoryId,
  name,
  avatarFileUrl,
  onClick,
  loading,
  ...props
}) => {
  const handleClick = () => onClick(categoryId);

  return (
    <Container backgroundImage={avatarFileUrl} onClick={handleClick} {...props}>
      <Content>
        {loading && <Skeleton style={{ fontSize: 16 }} />}
        {!loading && (
          <Truncate lines={2}>
            <Name>{name}</Name>
          </Truncate>
        )}
      </Content>
    </Container>
  );
};

UICategoryCard.defaultProps = {
  className: '',
  name: '',
  onClick: () => {},
  loading: false,
};

UICategoryCard.propTypes = {
  className: PropTypes.string,
  categoryId: PropTypes.string,
  name: PropTypes.string,
  avatarFileUrl: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
};

export default customizableComponent('UICategoryCard', UICategoryCard);
