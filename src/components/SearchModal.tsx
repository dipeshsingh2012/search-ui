import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Ruler, ArrowRight, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { fetchSuggestions, searchProducts } from '../api';
import { SearchProduct, SuggestionResponse } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: SearchProduct) => void;
  onFullSearch?: (query: string, maxHeight?: number | null) => void;
  initialClearance?: number | null;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onFullSearch,
  initialClearance = null,
}) => {
  const [query, setQuery] = useState('');
  const [clearanceLimit, setClearanceLimit] = useState<number | null>(initialClearance);
  const [isFilterActive, setIsFilterActive] = useState<boolean>(initialClearance !== null);
  const [suggestions, setSuggestions] = useState<SuggestionResponse | null>(null);
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSuggestions(null);
      setResults([]);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Live suggestions and instant search
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        if (query.trim().length > 0) {
          const [sugg, searchRes] = await Promise.all([
            fetchSuggestions(query),
            searchProducts({
              q: query,
              max_height_cm: isFilterActive ? clearanceLimit : null,
              limit: 4,
            }),
          ]);
          setSuggestions(sugg);
          setResults(searchRes.items);
        } else {
          // If no query, show top recommended or filtered items
          const searchRes = await searchProducts({
            max_height_cm: isFilterActive ? clearanceLimit : null,
            limit: 4,
          });
          setSuggestions(null);
          setResults(searchRes.items);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, clearanceLimit, isFilterActive, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFullSearch) {
      onFullSearch(query, isFilterActive ? clearanceLimit : null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search machines, brands, or appliances..."
            className="flex-1 bg-transparent text-slate-900 text-sm sm:text-base font-medium placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            ESC
          </button>
        </form>

        {/* Spatial Clearance Filter Bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Ruler className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold text-slate-700">Kitchen Counter Clearance:</span>
            {isFilterActive ? (
              <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                ≤ {clearanceLimit} cm
              </span>
            ) : (
              <span className="text-slate-400">Any height</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isFilterActive && (
              <input
                type="range"
                min="30"
                max="60"
                step="1"
                value={clearanceLimit || 45}
                onChange={(e) => setClearanceLimit(parseFloat(e.target.value))}
                className="w-24 accent-indigo-600 cursor-pointer"
              />
            )}
            <button
              type="button"
              onClick={() => {
                setIsFilterActive(!isFilterActive);
                if (!isFilterActive && !clearanceLimit) setClearanceLimit(45);
              }}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline"
            >
              {isFilterActive ? 'Disable' : '+ Set Max Height'}
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        {suggestions && suggestions.suggestions.length > 0 && (
          <div className="px-5 py-2 flex items-center gap-2 border-b border-slate-100 overflow-x-auto text-xs">
            <span className="text-slate-400 text-[11px] shrink-0">Popular:</span>
            {suggestions.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-full font-medium transition-colors shrink-0"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-4 divide-y divide-slate-100">
          {isLoading && (
            <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              Searching catalog...
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="py-8 text-center space-y-1">
              <p className="text-xs font-semibold text-slate-700">No appliances found matching your criteria.</p>
              <p className="text-[11px] text-slate-400">
                Try widening your height clearance or checking your spelling.
              </p>
            </div>
          )}

          {!isLoading &&
            results.map((product) => {
              const fits = !isFilterActive || !clearanceLimit || product.height_cm <= clearanceLimit;

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct?.(product);
                    onClose();
                  }}
                  className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </span>
                        {fits ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Fits
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            {product.height_cm} cm
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-semibold text-slate-700">{product.brand}</span>
                        <span>•</span>
                        <span>{product.height_cm} H × {product.width_cm} W cm</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900">${product.price.toFixed(2)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all ml-auto mt-1" />
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer Action */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Press <kbd className="font-bold text-slate-600">Enter</kbd> for full results
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700"
          >
            <span>View All Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
