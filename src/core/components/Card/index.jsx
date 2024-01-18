import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.palette.system.borders};
  border-radius: 4px;
  background: ${({ theme }) => theme.palette.system.background};
`;

const Title = styled.div`
  padding: ${({ slim }) => (!slim ? '1.25rem;' : '1rem')};
  border-bottom: 1px solid ${({ theme }) => theme.palette.system.borders};
  ${({ theme }) => theme.typography.title}
`;

const Body = styled.section`
  margin: 0;
  padding: 1.25rem;
  ${({ slim }) => slim && `padding: 1rem;`}
  ${({ stretched }) => stretched && `padding: 0;`}
`;

const Card = ({ title, slim, stretched, children, ...props }) => {
  return (
    <Container {...props}>
      {!!title && <Title slim={slim}>{title}</Title>}

      <Body slim={slim} stretched={stretched}>
        {children}
      </Body>
    </Container>
  );
};

Card.defaultProps = {
  title: null,
  slim: false,
  stretched: false,
  children: [],
};

Card.propTypes = {
  title: PropTypes.node,
  slim: PropTypes.bool,
  stretched: PropTypes.bool,
  children: PropTypes.node,
};

export default Card;
