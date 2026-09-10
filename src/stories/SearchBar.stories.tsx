
import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from '../components/SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Search/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onOpenModal: { action: 'openModalClicked' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    placeholder: 'Search appliances, brands...',
    onOpenModal: () => console.log('Search modal open requested'),
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Find slim coffee makers under 42cm...',
    onOpenModal: () => console.log('Search modal open requested'),
  },
};
