import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { SearchModal } from './components/SearchModal';
import { SearchFragment } from './components/SearchFragment';
import { SearchProduct } from './types';

export const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeClearance, setActiveClearance] = useState<number | null>(45);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Harness Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <span className="font-extrabold text-slate-900">
            Search UI Fragment Harness
          </span>
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-semibold">
            Port 5179
          </span>
        </div>

        {/* Embedded SearchBar preview in header */}
        <div className="w-72">
          <SearchBar onOpenModal={() => setIsModalOpen(true)} />
        </div>
      </header>

      {/* Main Full Page Search Fragment */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        <SearchFragment
          initialQuery=""
          initialMaxHeight={activeClearance}
          onClearanceFilterChange={(val) => setActiveClearance(val)}
          onProductSelect={(p: SearchProduct) => alert(`Selected: ${p.name}`)}
          onAddToCart={(p: SearchProduct) => alert(`Added to cart: ${p.name}`)}
        />
      </main>

      {/* Global Search Modal Overlay */}
      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialClearance={activeClearance}
        onSelectProduct={(p: SearchProduct) => alert(`Modal Selected: ${p.name}`)}
        onFullSearch={(q: string, maxHeight?: number | null) => {
          alert(`Executing full search for: "${q}" (maxHeight: ${maxHeight})`);
        }}
      />
    </div>
  );
};

export default App;
