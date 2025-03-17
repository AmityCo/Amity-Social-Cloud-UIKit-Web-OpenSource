import React, { ReactNode, memo } from 'react';

import { TabsContainer, TabsList, TabItem, TabButton } from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

export interface TabsProps {
  'data-testid'?: string;
  className?: string;
  tabs: {
    value: string;
    label: ReactNode;
  }[];
  activeTab: string;
  onChange: (value: string) => void;
}

const Tabs = ({
  'data-testid': dataQaAnchor = '',
  className = '',
  tabs,
  activeTab,
  onChange,
}: TabsProps) => (
  <TabsContainer className={className}>
    <TabsList data-testid={`${dataQaAnchor}-tabs-list`}>
      {tabs.map(({ value, label }) => (
        <TabItem key={value} data-testid={`${dataQaAnchor}-${value}-tab-item`}>
          <TabButton
            data-testid={
              value === activeTab
                ? `${dataQaAnchor}-${value}-tab-button-active`
                : `${dataQaAnchor}-${value}-tab-button`
            }
            className={value === activeTab ? 'active' : ''}
            onClick={() => onChange(value)}
          >
            {label}
          </TabButton>
        </TabItem>
      ))}
    </TabsList>
  </TabsContainer>
);

export default memo((props: TabsProps) => {
  const CustomComponentFn = useCustomComponent<TabsProps>('Tabs');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <Tabs {...props} />;
});
