import type { Meta, StoryObj } from '@storybook/react';
import { ButtonRadioGroup } from './ButtonRadioGroup';
import { Stack } from '@/components/atomics/Stack';

const meta: Meta<typeof ButtonRadioGroup> = {
  component: ButtonRadioGroup,
};

export default meta;
type Story = StoryObj<typeof ButtonRadioGroup>;

export const Default: Story = {
  args: {
    defaultItemId: '1',
    items: [
      { id: '1', label: '1' },
      { id: '2', label: '2' },
      { id: '3', label: '3' },
    ],
  },
  decorators: [
    (Children) => (
      <Stack gap="normal">
        <Children />
      </Stack>
    ),
  ],
};
