import React, { memo } from 'react';
import { FormValues } from './hooks';
import EditCommunityForm from './EditCommunityForm';
import CreateCommunityForm from './CreateCommunityForm';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

export interface CommunityFormProps {
  'data-qa-anchor'?: string;
  community?: Amity.Community;
  edit?: boolean;
  onSubmit?: (data: FormValues) => void;
  className?: string;
  onCancel?: () => void;
}

const CommunityForm = ({ edit, community, ...props }: CommunityFormProps) => {
  if (edit) {
    if (community == null) return null;
    return <EditCommunityForm {...props} community={community} />;
  }

  return <CreateCommunityForm {...props} />;
};

export default memo((props: CommunityFormProps) => {
  const CustomComponentFn = useCustomComponent<CommunityFormProps>('CommunityForm');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <CommunityForm {...props} />;
});
