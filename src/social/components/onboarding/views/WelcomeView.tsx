import React from 'react';
import {
  Box,
  List,
  ListItem,
  H2,
  Text,
  Image,
  ModalBody,
  ModalFooter,
  CompassColor,
  ModalContent,
} from '@noom/wax-component-library';
import { FormattedMessage } from 'react-intl';

import { PrimaryButton } from '~/core/components/Button';

export type WelcomeViewProps = {
  isLoading?: boolean;
  onSubmit: () => void;
  error?: string;
  fireworksImageUrl?: string;
};

export function WelcomeView({ isLoading, onSubmit, fireworksImageUrl }: WelcomeViewProps) {
  return (
    <ModalContent bg={CompassColor.offWhite}>
      <ModalBody position="relative">
        <Box textAlign="center" mb={8}>
          <H2 mb={4} fontWeight="500">
            <FormattedMessage id="onboarding.welcome.title" />
          </H2>
          <Text>
            <FormattedMessage
              id="onboarding.welcome.subTitle"
              values={{
                b: (text) => <b>{text}</b>,
              }}
            />
          </Text>
        </Box>
        <List>
          {[1, 2, 3, 4].map((key) => (
            <ListItem
              key={key}
              mb={4}
              sx={{
                '&::marker': {
                  content: '"◆ "',
                  color: 'primary.500',
                },
              }}
            >
              <FormattedMessage
                id={`onboarding.welcome.bullets.${key}`}
                values={{
                  b: (text) => (
                    <Text color="primary.500" fontWeight="bold">
                      {text}
                    </Text>
                  ),
                }}
              />
            </ListItem>
          ))}
        </List>

        {fireworksImageUrl ? (
          <Image src={fireworksImageUrl} position="absolute" top={0} w="100%" />
        ) : null}
      </ModalBody>
      <ModalFooter>
        <PrimaryButton isFullWidth isLoading={isLoading} onClick={onSubmit}>
          <FormattedMessage id="onboarding.welcome.button" />
        </PrimaryButton>
      </ModalFooter>
    </ModalContent>
  );
}
