import React, { ReactNode, memo } from 'react';

import { TabsContainer, TabsList, TabItem, TabButton } from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

export interface TabsProps {
  'data-qa-anchor'?: string;
  className?: string;
  tabs: {
    value: string;
    label: ReactNode;
  }[];
  activeTab: string;
  onChange: (value: string) => void;
}

const Tabs = ({
  'data-qa-anchor': dataQaAnchor = '',
  className = '',
  tabs,
  activeTab,
  onChange,
}: TabsProps) => (
  <TabsContainer className={className}>
    <TabsList data-qa-anchor={`${dataQaAnchor}-tabs-list`}>
      {tabs.map(({ value, label }) => (
        <TabItem key={value} data-qa-anchor={`${dataQaAnchor}-${value}-tab-item`}>
          <TabButton
            data-qa-anchor={
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
