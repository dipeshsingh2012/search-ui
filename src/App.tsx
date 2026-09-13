import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { SearchModal } from './components/SearchModal';
import { SearchFragment } from './components/SearchFragment';
import { SearchProduct } from './types';
import { ProtonThemeProvider } from '@dipesh.singh/proton/react';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeClearance, setActiveClearance] = useState<number | null>(45);
  const [cartCount, setCartCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleAddToCart = (p: SearchProduct) => {
    setCartCount((prev) => prev + 1);
    showToast(`Added "${p.name}" to cart!`);
  };

  return (
    <ProtonThemeProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col relative">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Harness Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              S
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm leading-tight flex items-center gap-2">
                Search UI Fragment
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  Standalone Mode
                </span>
              </span>
              <p className="text-[11px] text-slate-500">MFE Development Harness</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Embedded SearchBar preview in header */}
            <div className="w-64 sm:w-72">
              <SearchBar onOpenModal={() => setIsModalOpen(true)} />
            </div>

            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full font-semibold">
              Port 5179
            </span>

            <div className="relative">
              <button
                onClick={() => showToast(`Cart contains ${cartCount} item(s)`)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center justify-center"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Full Page Search Fragment */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
          <SearchFragment
            initialQuery=""
            initialMaxHeight={activeClearance}
            onClearanceFilterChange={(val) => {
              setActiveClearance(val);
              showToast(val ? `Clearance filter set to ${val} cm` : 'Clearance filter reset');
            }}
            onProductSelect={(p: SearchProduct) => showToast(`Selected product: ${p.name}`)}
            onAddToCart={handleAddToCart}
          />
        </main>

        {/* Global Search Modal Overlay */}
        <SearchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialClearance={activeClearance}
          onSelectProduct={(p: SearchProduct) => {
            setIsModalOpen(false);
            showToast(`Selected from modal: ${p.name}`);
          }}
          onFullSearch={(q: string, maxHeight?: number | null) => {
            setIsModalOpen(false);
            showToast(`Executed search: "${q}"${maxHeight ? ` (max: ${maxHeight}cm)` : ''}`);
          }}
        />
      </div>
    </ProtonThemeProvider>
  );
};

export default App;
