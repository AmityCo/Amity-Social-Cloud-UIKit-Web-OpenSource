import React, { ReactNode } from 'react';
import { StyledRadio, Label, Chip } from './styles';
import { FieldValues, UseControllerReturn } from 'react-hook-form';

type RadioProps<T extends FieldValues> = UseControllerReturn<T>['field'] & {
  'data-testid': string;
  renderer?: () => ReactNode;
  label: string;
  className?: string;
};

const Radio = <T extends FieldValues>({
  'data-testid': dataQaAnchor = '',
  renderer,
  label,
  className,
  ...field
}: RadioProps<T>) => {
  return (
    <Label data-testid={`${dataQaAnchor}-label`}>
      <StyledRadio {...field} data-testid={`${dataQaAnchor}-radio`} />
      <>
        {renderer ? renderer() : <span className={className}>{label}</span>}
        <Chip checked={field.value} />
      </>
    </Label>
  );
};

export default Radio;
