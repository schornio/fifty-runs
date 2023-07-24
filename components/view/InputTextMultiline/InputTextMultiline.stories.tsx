import type { Meta, StoryObj } from '@storybook/react';
import { InputTextMultiline } from './InputTextMultiline';

const meta: Meta<typeof InputTextMultiline> = {
  component: InputTextMultiline,
};

export default meta;
type Story = StoryObj<typeof InputTextMultiline>;

const defaultColor = 'default';

export const Default: Story = {
  args: {
    color: defaultColor,
    label: 'Label',
  },
};

export const ErrorSingle: Story = {
  args: {
    color: defaultColor,
    error: new Map([['name', ['Error']]]),
    label: 'Label',
    name: 'name',
  },
};

export const ErrorMultiple: Story = {
  args: {
    color: defaultColor,
    error: new Map([['name', ['Error 1', 'Error 2']]]),
    label: 'Label',
    name: 'name',
  },
};
