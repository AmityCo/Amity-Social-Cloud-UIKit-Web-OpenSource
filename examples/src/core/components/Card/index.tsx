import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.palette.system.borders};
  border-radius: 4px;
  background: ${({ theme }) => theme.palette.system.background};
`;

const Title = styled.div<{ slim?: boolean }>`
  padding: ${({ slim }) => (!slim ? '1.25rem;' : '1rem')};
  border-bottom: 1px solid ${({ theme }) => theme.palette.system.borders};
  ${({ theme }) => theme.typography.title}
`;

const Body = styled.section<{ slim?: boolean; stretched?: boolean }>`
  margin: 0;
  padding: 1.25rem;
  ${({ slim }) => slim && `padding: 1rem;`}
  ${({ stretched }) => stretched && `padding: 0;`}
`;

interface CardProps {
  title?: ReactNode;
  slim?: boolean;
  stretched?: boolean;
  children?: ReactNode;
}

const Card = ({ title, slim, stretched, children, ...props }: CardProps) => {
  return (
    <Container {...props}>
      {!!title && <Title slim={slim}>{title}</Title>}

      <Body slim={slim} stretched={stretched}>
        {children}
      </Body>
    </Container>
  );
};

export default Card;
