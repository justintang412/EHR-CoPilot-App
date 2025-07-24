import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import SideMenu from './SideMenu';

// Mock the useUser hook
jest.mock('@/lib/auth', () => ({
  useUser: () => ({
    data: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
    },
  }),
}));

export default {
  title: 'Components/SideMenu',
  component: SideMenu,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof SideMenu>;

const Template: ComponentStory<typeof SideMenu> = (args) => <SideMenu {...args} />;

export const Default = Template.bind({});
Default.args = {}; 