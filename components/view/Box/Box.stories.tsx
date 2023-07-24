import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
  component: Box,
};

export default meta;
type Story = StoryObj<typeof Box>;

const defaultColor = 'accent1';

export const Default: Story = {
  args: {
    children: 'This is a box',
  },
};
