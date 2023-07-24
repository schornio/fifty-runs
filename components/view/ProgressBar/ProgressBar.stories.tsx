import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';
import { Typography } from '../Typography';

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
    children: <Typography color="inverse">Hello world</Typography>,
    value: 0.3,
  },
};
