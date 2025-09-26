import React from 'react';
import styled from 'styled-components';

import UITabs from '~/core/components/Tabs';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

const FeedHeaderTabs = styled(UITabs)`
  background: ${({ theme }) => theme.palette.system.background};
  border-radius: 4px 4px 0 0;
  border: 1px solid #edeef2;
  margin-bottom: 12px;
`;

type FeedHeaderTabsProps = React.ComponentProps<typeof FeedHeaderTabs>;

export default (props: FeedHeaderTabsProps) => {
  const CustomComponentFn = useCustomComponent<FeedHeaderTabsProps>('FeedHeaderTabs');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <FeedHeaderTabs {...props} />;
};
