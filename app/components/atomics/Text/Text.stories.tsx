import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  component: Text,
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: { children: 'This is a text.' },
};

export const FontSizeSub: Story = {
  args: { children: 'This is a text.', fontSize: 'sub' },
};

export const FontSizeNormal: Story = {
  args: { children: 'This is a text.', fontSize: 'normal' },
};

export const FontSizeHeading1: Story = {
  args: { children: 'This is a text.', fontSize: 'heading1' },
};

export const FontSizeHeading2: Story = {
  args: { children: 'This is a text.', fontSize: 'heading2' },
};

export const FontSizeHeading3: Story = {
  args: { children: 'This is a text.', fontSize: 'heading3' },
};
