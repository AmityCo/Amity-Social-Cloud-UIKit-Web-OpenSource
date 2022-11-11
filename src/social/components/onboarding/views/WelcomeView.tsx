import React from 'react';
import {
  Box,
  List,
  ListItem,
  H2,
  Text,
  ModalBody,
  ModalFooter,
  CompassColor,
  ModalContent,
} from '@noom/wax-component-library';
import { FormattedMessage, useIntl } from 'react-intl';

import { PrimaryButton } from '~/core/components/Button';

export type WelcomeViewProps = { isLoading?: boolean; onSubmit: () => void; error?: string };

export function WelcomeView({ isLoading, onSubmit }: WelcomeViewProps) {
  return (
    <ModalContent bg={CompassColor.offWhite}>
      <ModalBody>
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
      </ModalBody>
      <ModalFooter>
        <PrimaryButton isFullWidth isLoading={isLoading} onClick={onSubmit}>
          <FormattedMessage id="onboarding.welcome.button" />
        </PrimaryButton>
      </ModalFooter>
    </ModalContent>
  );
}
