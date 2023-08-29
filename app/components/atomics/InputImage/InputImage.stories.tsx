import type { Meta, StoryObj } from '@storybook/react';
import { InputImage } from './InputImage';

const meta: Meta<typeof InputImage> = {
  component: InputImage,
};

export default meta;
type Story = StoryObj<typeof InputImage>;

export const Default: Story = {};
