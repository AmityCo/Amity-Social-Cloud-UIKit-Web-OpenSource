import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ConditionalRender from '~/core/components/ConditionalRender';

const Container = styled.div`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.palette.system.borders};
  border-radius: 4px;
`;

const Title = styled.div`
  padding: 1.25em;
  border-bottom: 1px solid ${({ theme }) => theme.palette.system.borders};
  ${({ theme }) => theme.typography.title}
`;

const Body = styled.section`
  margin: 0;
  ${({ stretched }) => !stretched && `padding: 1.25em;`}
`;

const Card = ({ title, stretched, children }) => {
  return (
    <Container>
      <ConditionalRender condition={!!title && !!title.length}>
        <Title>{title}</Title>
      </ConditionalRender>

      <Body stretched={stretched}>{children}</Body>
    </Container>
  );
};

Card.defaultProps = {
  title: '',
  stretched: false,
  children: [],
};

Card.propTypes = {
  title: PropTypes.string,
  stretched: PropTypes.bool,
  children: PropTypes.node,
};

export default Card;
