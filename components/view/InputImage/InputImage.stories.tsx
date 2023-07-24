import type { Meta, StoryObj } from '@storybook/react';
import { InputImage } from './InputImage';

const meta: Meta<typeof InputImage> = {
  component: InputImage,
};

export default meta;
type Story = StoryObj<typeof InputImage>;

const defaultColor = 'default';

export const Default: Story = {
  args: {
    color: defaultColor,
    label: 'Label',
  },
};

export const Error: Story = {
  args: {
    color: defaultColor,
    error: new Map([['name', ['Error message']]]),
    label: 'Label',
    name: 'name',
  },
};
