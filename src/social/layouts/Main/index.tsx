import React from 'react';
import styled from 'styled-components';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

const Container = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-areas: 'side main' 'none main';
  grid-template-columns: min-content auto;
  grid-template-rows: 100%;
  grid-gap: 0 20px;
  width: 100%;
  height: 100%;
  padding: 0 20px 0 0;
  background: #f7f7f8;
`;

const Main = styled.div`
  grid-area: main;
  overflow: auto;
  width: 100%;
  min-width: 20rem;
  max-width: 90.75rem;
  margin: 0 auto;
`;

const Side = styled.div`
  grid-area: side;
  overflow: auto;
`;

interface LayoutProps {
  aside: React.ReactNode;
  children: React.ReactNode;
}

const Layout = ({ aside, children }: LayoutProps) => {
  return (
    <Container>
      <Main>{children}</Main>
      <Side>{aside}</Side>
    </Container>
  );
};

export default (props: LayoutProps) => {
  const CustomComponentFn = useCustomComponent<LayoutProps>('Layout');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <Layout {...props} />;
};
