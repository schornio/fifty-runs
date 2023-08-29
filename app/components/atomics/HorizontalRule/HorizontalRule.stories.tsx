import type { Meta, StoryObj } from '@storybook/react';
import { HorizontalRule } from './HorizontalRule';

const meta: Meta<typeof HorizontalRule> = {
  component: HorizontalRule,
};

export default meta;
type Story = StoryObj<typeof HorizontalRule>;

export const Default: Story = {};
