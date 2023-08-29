import type { Meta, StoryObj } from '@storybook/react';
import { TableCell } from './TableCell';

const meta: Meta<typeof TableCell> = {
  component: TableCell,
  decorators: [
    (Children) => (
      <table>
        <tbody>
          <tr>
            <td>before</td>
            <Children />
            <td>after</td>
          </tr>
        </tbody>
      </table>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TableCell>;

export const Default: Story = {
  args: {
    children: 'Cell',
  },
};

export const Grow: Story = {
  args: {
    children: 'Cell with grow',
    grow: true,
  },
};
