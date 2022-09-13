import React, { memo, useState } from 'react';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';

import { backgroundImage as SkyBg } from '~/icons/Sky';
import { backgroundImage as BalloonBg } from '~/icons/Balloon';
import { backgroundImage as DotsBg } from '~/icons/Dots';

import PlusIcon from '~/icons/Plus';

import UiKitSocialSearch from '~/social/components/SocialSearch';
import UiKitButton from '~/core/components/Button';

import UiKitCommunityCreationModal from '~/social/components/CommunityCreationModal';
import { useConfig } from '~/social/providers/ConfigProvider';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { useSDK } from '~/core/hooks/useSDK';

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: ${SkyBg} right bottom no-repeat, linear-gradient(to right, #111f48 0, #2b4491 100%);
`;

const Foreground = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-areas: 'search search search none1' 'create dots balloon balloon' 'none2 dots balloon balloon';
  grid-template-rows: min-content min-content minmax(1rem, auto);
  grid-template-columns: max-content min-content auto;
  grid-gap: 1rem;
  padding: 2rem 0 0 2rem;
`;

const Search = styled.div`
  grid-area: search;
`;

const Create = styled.div`
  grid-area: create;
  color: ${({ theme }) => theme.palette.system.background};
`;

const Balloon = styled.div`
  grid-area: balloon;
  width: 100%;
  height: 100%;
  max-width: 262px;
  min-height: 243px;
  place-self: start end;
  background: ${BalloonBg} left bottom no-repeat;
`;

const Dots = styled.div`
  grid-area: dots;
  width: 106px;
  background: ${DotsBg} left top repeat;
  margin: 1rem;
`;

const Headline = styled.div`
  ${({ theme }) => theme.typography.headline};
  color: ${({ theme }) => theme.palette.system.background};
  margin-bottom: 1rem;
`;

const Title = styled.div`
  ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.palette.system.background};
  margin-bottom: 1rem;
`;

const Header = () => {
  const { connected } = useSDK();
  const { socialCommunityCreationButtonVisible } = useConfig();
  const { onCommunityCreated } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = (communityId) => {
    setIsOpen(false);
    communityId && onCommunityCreated(communityId);
  };

  return (
    <Background>
      <Foreground>
        <Search>
          <Headline>
            <FormattedMessage id="exploreHeader.searchCommunityTitle" />
          </Headline>
          <UiKitSocialSearch searchBy={['communities']} />
        </Search>
        <Create>
          <Title>
            <FormattedMessage id="exploreHeader.createCommunityTitle" />
          </Title>

          {socialCommunityCreationButtonVisible && (
            <UiKitButton disabled={!connected} onClick={openModal}>
              <PlusIcon />
              <span>
                <FormattedMessage id="exploreHeader.createCommunityButton" />
              </span>
            </UiKitButton>
          )}
        </Create>

        <Balloon />
        <Dots />

        <UiKitCommunityCreationModal isOpen={isOpen} onClose={closeModal} />
      </Foreground>
    </Background>
  );
};

export default memo(Header);
