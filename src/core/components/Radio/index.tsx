import React, { ReactNode } from 'react';
import { StyledRadio, Label, Chip } from './styles';
import { FieldValues, UseControllerReturn } from 'react-hook-form';

type RadioProps<T extends FieldValues> = UseControllerReturn<T>['field'] & {
  'data-qa-anchor': string;
  renderer?: () => ReactNode;
  label: string;
  className?: string;
};

const Radio = <T extends FieldValues>({
  'data-qa-anchor': dataQaAnchor = '',
  renderer,
  label,
  className,
  ...field
}: RadioProps<T>) => {
  return (
    <Label data-qa-anchor={`${dataQaAnchor}-label`}>
      <StyledRadio {...field} data-qa-anchor={`${dataQaAnchor}-radio`} />
      <>
        {renderer ? renderer() : <span className={className}>{label}</span>}
        <Chip checked={field.value} />
      </>
    </Label>
  );
};

export default Radio;
