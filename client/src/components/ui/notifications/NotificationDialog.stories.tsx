import { NotificationDialog } from './NotificationDialog';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof NotificationDialog> = {
  title: 'Components/Notifications/NotificationDialog',
  component: NotificationDialog,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof NotificationDialog>;

export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Sample Notification',
    message: 'This is a sample notification message.',
    type: 'info',
  },
}; 