import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { SearchFragment } from './components/SearchFragment';
import { SearchModal } from './components/SearchModal';
import { SearchBar } from './components/SearchBar';

export function render(props: any = {}): string {
  return ReactDOMServer.renderToString(React.createElement(SearchFragment, props));
}

export function renderModal(props: any = {}): string {
  return ReactDOMServer.renderToString(React.createElement(SearchModal, props));
}

export { SearchFragment, SearchModal, SearchBar };
export default SearchFragment;
