import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
  component: Box,
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
  args: {
    children: 'This is a box.',
  },
};

export const Outlined: Story = {
  args: {
    children: 'This is a box.',
    color: 'primary',
    padding: 'normal',
    roundedCorners: true,
    variant: 'outlined',
  },
};

export const Filled: Story = {
  args: {
    children: 'This is a box.',
    color: 'primary',
    padding: 'normal',
    roundedCorners: true,
    variant: 'filled',
  },
};
