
import type { Meta, StoryObj } from '@storybook/react';
import { SearchModal } from '../components/SearchModal';

const meta: Meta<typeof SearchModal> = {
  title: 'Search/SearchModal',
  component: SearchModal,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    initialClearance: { control: 'number' },
    onClose: { action: 'closed' },
    onSelectProduct: { action: 'productSelected' },
    onFullSearch: { action: 'fullSearchTriggered' },
  },
};

export default meta;
type Story = StoryObj<typeof SearchModal>;

export const OpenModal: Story = {
  args: {
    isOpen: true,
    initialClearance: null,
    onClose: () => console.log('Modal closed'),
    onSelectProduct: (p) => console.log('Selected product:', p),
    onFullSearch: (q, h) => console.log('Full search:', q, h),
  },
};

export const OpenWithCabinetClearanceFilter: Story = {
  args: {
    isOpen: true,
    initialClearance: 42,
    onClose: () => console.log('Modal closed'),
    onSelectProduct: (p) => console.log('Selected product with clearance:', p),
    onFullSearch: (q, h) => console.log('Full search with clearance:', q, h),
  },
};
