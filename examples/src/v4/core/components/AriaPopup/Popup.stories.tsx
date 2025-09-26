import React from 'react';
import { Popup } from '.';
import { StoryObj, Meta } from '@storybook/react';
import { Button } from '~/v4/core/components/AriaButton';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';

const meta: Meta<typeof Popup> = {
  component: Popup,
  title: 'V4/Core/Components/Popup',
  decorators: [
    (Story) => (
      <div
        style={{
          gap: '1rem',
          padding: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Popup>;

export const Default: Story = {
  name: 'Default',
  render: () => {
    const { openPopup, closePopup } = usePopupContext();

    return (
      <Button
        size="medium"
        variant="fill"
        color="primary"
        onPress={() =>
          openPopup({
            children: (
              <Button
                size="medium"
                variant="fill"
                color="primary"
                onPress={() =>
                  openPopup({
                    children: (
                      <Button
                        size="medium"
                        variant="fill"
                        color="primary"
                        onPress={() => closePopup()}
                      >
                        Close
                      </Button>
                    ),
                  })
                }
              >
                Click me again
              </Button>
            ),
          })
        }
      >
        Click me
      </Button>
    );
  },
};
