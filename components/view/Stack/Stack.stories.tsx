import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';

const meta: Meta<typeof Stack> = {
  component: Stack,
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  args: {
    children: (
      <>
        <div
          style={{ backgroundColor: 'red', height: '100px', width: '100px' }}
        />
        <div
          style={{ backgroundColor: 'blue', height: '100px', width: '100px' }}
        />
        <div
          style={{ backgroundColor: 'green', height: '100px', width: '100px' }}
        />
      </>
    ),
  },
};
