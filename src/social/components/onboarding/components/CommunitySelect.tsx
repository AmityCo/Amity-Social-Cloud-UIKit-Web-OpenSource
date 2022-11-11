import React, { PropsWithChildren, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, CompassColor, Text, IconButton } from '@noom/wax-component-library';
import { abbreviateNumber } from 'js-abbreviation-number';

import Avatar from '~/core/components/Avatar';

import { Community as CommunityData } from '../models';

export type CommunityProps = {
  data: CommunityData;
  isSelected?: boolean;
  onClick?: (data: CommunityData) => void;
  isDisabled?: boolean;
};

export function Community({ data, onClick, isSelected, isDisabled }: CommunityProps) {
  const handleClick = () => {
    if (!isDisabled) {
      onClick?.(data);
    }
  };

  return (
    <Box
      borderRadius="md"
      display="flex"
      flexDir="row"
      bg={CompassColor.offWhite}
      onClick={handleClick}
      p={4}
      gap={4}
      boxShadow={isSelected ? 'outline' : 'none'}
      userSelect="none"
      cursor="pointer"
    >
      <Avatar isCommunity size="regular" avatar={data.avatarUrl} />
      <Box flex={1}>
        <Box display="flex" flexDir="row">
          <Box flex={1}>
            <Box>
              <Text fontWeight="500" isTruncated>
                {data.name}
              </Text>
            </Box>
            <Box>
              <Text color="gray.500" size="sm">
                <FormattedMessage
                  id="onboarding.communities.membersCount"
                  values={{
                    count: abbreviateNumber(data.membersCount, 1, { padding: false }),
                  }}
                />
              </Text>
            </Box>
          </Box>
          <IconButton
            size="md"
            icon={isSelected ? 'check' : 'add'}
            borderRadius="full"
            colorScheme={isSelected ? 'primary' : 'gray'}
          />
        </Box>
        <Box>
          <Text size="sm" noOfLines={2} title={data.description}>
            {data.description}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

function CommunitiesContainer({ children }: PropsWithChildren<{}>) {
  return (
    <Box display="flex" flexDir="column" flex-wrap="wrap" gap={2} paddingX={1}>
      {children}
    </Box>
  );
}

export type CommunitySelectProps = {
  communities: CommunityData[];
  isDisabled?: boolean;
  onChange?: (communities: CommunityData[]) => void;
};

export function CommunitySelect({ communities, isDisabled }: CommunitySelectProps) {
  const sortedCommunities = useMemo(
    () => [...communities].sort((a, b) => a.description.localeCompare(b.description)),
    [communities],
  );
  const [selected, setSelected] = useState<CommunityData[]>([]);

  const onToggle = (data: CommunityData) => {
    if (isDisabled) {
      return;
    }

    let updatedArray: CommunityData[] = [];
    if (selected.find((c) => c.id === data.id)) {
      updatedArray = selected.filter((c) => c.id !== data.id);
    } else {
      updatedArray = [...selected, data];
    }

    setSelected(updatedArray);
  };

  return (
    <CommunitiesContainer>
      {sortedCommunities.map((community) => (
        <Community
          key={community.name}
          data={community}
          onClick={onToggle}
          isDisabled={isDisabled}
          isSelected={selected.some((c) => c.id === community.id)}
        />
      ))}
    </CommunitiesContainer>
  );
}
