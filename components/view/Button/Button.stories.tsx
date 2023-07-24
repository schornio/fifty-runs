import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

const defaultColor = 'blue';

export const Fill: Story = {
  args: {
    children: 'Fill',
    color: defaultColor,
    variant: 'fill',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    color: defaultColor,
    variant: 'outline',
  },
};

export const Text: Story = {
  args: {
    children: 'Text',
    color: defaultColor,
    variant: 'text',
  },
};
