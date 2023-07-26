import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';
import { Text } from '@/components/atomics/Text';

const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    value: 0.3,
  },
};

export const WithChildren: Story = {
  args: {
    children: <Text color="background">Hello world</Text>,
    value: 0.3,
  },
};
