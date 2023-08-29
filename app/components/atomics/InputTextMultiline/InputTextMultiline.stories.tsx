import type { Meta, StoryObj } from '@storybook/react';
import { InputTextMultiline } from './InputTextMultiline';

const meta: Meta<typeof InputTextMultiline> = {
  component: InputTextMultiline,
};

export default meta;
type Story = StoryObj<typeof InputTextMultiline>;

export const Default: Story = {
  args: {
    label: 'Label',
  },
};

export const ErrorSingle: Story = {
  args: {
    error: new Map([['name', ['Error']]]),
    label: 'Label',
    name: 'name',
  },
};

export const ErrorMultiple: Story = {
  args: {
    error: new Map([['name', ['Error 1', 'Error 2']]]),
    label: 'Label',
    name: 'name',
  },
};
