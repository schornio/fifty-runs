import type { Meta, StoryObj } from '@storybook/react';
import { ButtonAction } from './ButtonAction';

const meta: Meta<typeof ButtonAction> = {
  component: ButtonAction,
};

export default meta;
type Story = StoryObj<typeof ButtonAction>;

export const Standby: Story = {
  args: {
    contentStandby: 'Standby',
    status: 'standby',
  },
};

export const Pending: Story = {
  args: {
    contentPending: 'Pending',
    status: 'pending',
  },
};

export const Resolved: Story = {
  args: {
    contentResolved: 'Resolved',
    status: 'resolved',
  },
};

export const Rejected: Story = {
  args: {
    contentRejected: 'Rejected',
    status: 'rejected',
  },
};
