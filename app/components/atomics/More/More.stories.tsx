import type { Meta, StoryObj } from '@storybook/react';
import { More } from './More';

const meta: Meta<typeof More> = {
  component: More,
};

export default meta;
type Story = StoryObj<typeof More>;

export const Default: Story = {};
