import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchFragment } from '../components/SearchFragment';

const meta: Meta<typeof SearchFragment> = {
  title: 'Search/SearchFragment',
  component: SearchFragment,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    initialQuery: { control: 'text' },
    initialCategory: {
      control: 'select',
      options: ['all', 'espresso_machine', 'blender', 'stand_mixer', 'toaster'],
    },
    initialBrand: {
      control: 'select',
      options: ['all', 'Breville', "De'Longhi", 'Vitamix', 'KitchenAid'],
    },
    initialMaxHeight: { control: 'number' },
    onProductSelect: { action: 'productSelected' },
    onClearanceFilterChange: { action: 'clearanceFilterChanged' },
    onAddToCart: { action: 'addedToCart' },
  },
};

export default meta;
type Story = StoryObj<typeof SearchFragment>;

export const DefaultSearchResults: Story = {
  args: {
    initialQuery: '',
    initialCategory: 'all',
    initialBrand: 'all',
    initialMaxHeight: null,
    onProductSelect: (p) => console.log('Selected product:', p),
    onAddToCart: (p) => console.log('Added to cart:', p),
  },
};

export const EspressoCategoryFilter: Story = {
  args: {
    initialQuery: '',
    initialCategory: 'espresso_machine',
    initialBrand: 'all',
    initialMaxHeight: null,
    onProductSelect: (p) => console.log('Selected espresso product:', p),
    onAddToCart: (p) => console.log('Added to cart:', p),
  },
};

export const ConstrainedCounterClearance: Story = {
  args: {
    initialQuery: '',
    initialCategory: 'all',
    initialBrand: 'all',
    initialMaxHeight: 40,
    onProductSelect: (p) => console.log('Selected product under 40cm:', p),
    onAddToCart: (p) => console.log('Added to cart:', p),
  },
};
