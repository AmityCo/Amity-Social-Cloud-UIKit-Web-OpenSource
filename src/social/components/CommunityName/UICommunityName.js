import React from 'react';
import PropTypes from 'prop-types';

import { customizableComponent } from '~/core/hocs/customization';
import { ConditionalRender } from '~/core/components/ConditionalRender';
import { NameContainer, Name, VerifiedIcon, PrivateIcon } from './styles';

const UICommunityName = ({
  name,
  isPublic = false,
  isOfficial = false,
  isActive = false,
  isTitle = false,
  className = null,
}) => (
  <NameContainer className={className} isActive={isActive} isTitle={isTitle}>
    <ConditionalRender condition={!isPublic}>
      <PrivateIcon />
    </ConditionalRender>
    <Name title={name}>{name}</Name>
    <ConditionalRender condition={isOfficial}>
      <VerifiedIcon />
    </ConditionalRender>
  </NameContainer>
);

UICommunityName.propTypes = {
  name: PropTypes.string,
  isPublic: PropTypes.bool,
  isOfficial: PropTypes.bool,
  isActive: PropTypes.bool,
  isTitle: PropTypes.bool,
  className: PropTypes.string,
};

export default customizableComponent('UICommunityName', UICommunityName);
