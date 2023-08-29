import { HeaderMenu, HeaderMenuWrapper } from './HeaderMenu';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof HeaderMenu> = {
  component: HeaderMenu,
};

export default meta;
type Story = StoryObj<typeof HeaderMenu>;

export const Default: Story = {
  args: {
    children: 'HeaderMenu',
  },
  decorators: [
    (Children) => (
      <HeaderMenuWrapper>
        <Children />
      </HeaderMenuWrapper>
    ),
  ],
};
