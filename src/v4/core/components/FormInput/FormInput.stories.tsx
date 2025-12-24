import { FormInput } from '.';
import { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof FormInput> = {
  tags: ['autodocs'],
  component: FormInput,
  title: 'V4/Core/Components/FormInput',
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof FormInput>;

export const Default: Story = {
  name: 'Default',
  render: () => {
    return (
      <div
        style={{
          gap: '1rem',
          padding: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <FormInput placeholder="Enter something" label="Form Input" maxLength={20} />
      </div>
    );
  },
};
