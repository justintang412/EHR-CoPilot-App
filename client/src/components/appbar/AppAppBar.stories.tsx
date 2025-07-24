import type { Meta, StoryObj } from '@storybook/react';
import AppAppBar from './AppAppBar';

const meta: Meta<typeof AppAppBar> = {
  title: 'Components/AppAppBar',
  component: AppAppBar,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof AppAppBar>;

export const Default: Story = {
  render: () => <AppAppBar />,
}; 