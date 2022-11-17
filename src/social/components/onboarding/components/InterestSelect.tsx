import React, { PropsWithChildren, useMemo, useState } from 'react';
import { Box, CompassColor, Text, useBreakpointValue } from '@noom/wax-component-library';

import { Interest as InterestData } from '../models';

export type InterestProps = {
  data: InterestData;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: (data: InterestData) => void;
};

export function Interest({ data, onClick, isSelected, isDisabled }: InterestProps) {
  const handleClick = () => {
    if (!isDisabled) {
      onClick?.(data);
    }
  };

  const flex = useBreakpointValue({ base: 1, sm: 0 });

  return (
    <Box
      onClick={handleClick}
      bg={CompassColor.offWhite}
      borderRadius="full"
      paddingX={4}
      paddingY={2}
      fontSize="sm"
      cursor="pointer"
      textAlign="center"
      whiteSpace="nowrap"
      flex={flex}
      boxSizing="border-box"
      boxShadow={isSelected ? 'outline' : 'none'}
      userSelect="none"
    >
      <Text mr={2}>{data.emoji}</Text> <Text>{data.description}</Text>
    </Box>
  );
}

function InterestsContainer({ children }: PropsWithChildren<{}>) {
  return (
    <Box display="flex" flexDir="row" flexWrap="wrap" gap={2} paddingX={1}>
      {children}
    </Box>
  );
}

export type InterestSelectProps = {
  interests: InterestData[];
  isDisabled?: boolean;
  onChange?: (interests: InterestData[]) => void;
};

export function InterestSelect({ interests, isDisabled, onChange }: InterestSelectProps) {
  const sortedInterests = useMemo(
    () => [...interests].sort((a, b) => a.description.localeCompare(b.description)),
    [interests],
  );
  const [selected, setSelected] = useState<InterestData[]>([]);

  const onToggle = (data: InterestData) => {
    if (isDisabled) {
      return;
    }

    let updatedArray: InterestData[] = [];

    if (selected.find((i) => i.name === data.name)) {
      updatedArray = selected.filter((i) => i.name !== data.name);
    } else {
      updatedArray = [...selected, data];
    }

    setSelected(updatedArray);
    onChange?.(updatedArray);
  };

  return (
    <InterestsContainer>
      {sortedInterests.map((interest) => (
        <Interest
          key={interest.name}
          data={interest}
          isDisabled={isDisabled}
          isSelected={selected.some((i) => i.name === interest.name)}
          onClick={onToggle}
        />
      ))}
    </InterestsContainer>
  );
}
