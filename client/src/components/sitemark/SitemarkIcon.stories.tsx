// SitemarkIcon.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import SitemarkIcon from './SitemarkIcon';

const meta: Meta<typeof SitemarkIcon> = {
  title: 'Components/SitemarkIcon',
  component: SitemarkIcon,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SitemarkIcon>;

export const Default: Story = {
  render: () => <SitemarkIcon />,
};