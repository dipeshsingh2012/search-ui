import React, { useEffect, useState } from 'react';
import {
  Search,
  Ruler,
  SlidersHorizontal,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { searchProducts } from '../api';
import { SearchProduct, SearchResponse } from '../types';
import { PriceDisplay, EmptyState, FitmentBadge } from '@dipesh.singh/commerce-ui';
import { ProtonSpinner } from '@dipesh.singh/proton/react';

interface SearchFragmentProps {
  initialQuery?: string;
  initialCategory?: string;
  initialBrand?: string;
  initialMaxHeight?: number | null;
  onProductSelect?: (product: SearchProduct) => void;
  onClearanceFilterChange?: (clearanceCm: number | null) => void;
  onAddToCart?: (product: SearchProduct) => void;
}

export const SearchFragment: React.FC<SearchFragmentProps> = ({
  initialQuery = '',
  initialCategory = 'all',
  initialBrand = 'all',
  initialMaxHeight = null,
  onProductSelect,
  onClearanceFilterChange,
  onAddToCart,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState(initialBrand);
  const [maxHeight, setMaxHeight] = useState<number>(initialMaxHeight || 48);
  const [isHeightActive, setIsHeightActive] = useState<boolean>(initialMaxHeight !== null);
  const [sort, setSort] = useState<string>('relevance');
  const [data, setData] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function executeSearch() {
      setIsLoading(true);
      const res = await searchProducts({
        q: query,
        category: category !== 'all' ? category : undefined,
        brand: brand !== 'all' ? brand : undefined,
        max_height_cm: isHeightActive ? maxHeight : null,
        sort,
      });
      if (isMounted) {
        setData(res);
        setIsLoading(false);
      }
    }

    const timer = setTimeout(executeSearch, 150);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, category, brand, maxHeight, isHeightActive, sort]);

  const handleHeightToggle = () => {
    const next = !isHeightActive;
    setIsHeightActive(next);
    onClearanceFilterChange?.(next ? maxHeight : null);
  };

  const handleHeightChange = (val: number) => {
    setMaxHeight(val);
    if (isHeightActive) {
      onClearanceFilterChange?.(val);
    }
  };

  const handleClearFilters = () => {
    setQuery('');
    setCategory('all');
    setBrand('all');
    setIsHeightActive(false);
    onClearanceFilterChange?.(null);
  };

  const hasActiveFilters =
    query !== '' || category !== 'all' || brand !== 'all' || isHeightActive;

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Main search query input */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-indigo-600 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search appliances, brands, models..."
              className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-semibold">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2.5 focus:outline-hidden"
            >
              <option value="relevance">Most Relevant</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="height_asc">Clearance: Compact First</option>
            </select>
          </div>
        </div>

        {/* Quick Clearance Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleHeightToggle}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                isHeightActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>{isHeightActive ? `Clearance ≤ ${maxHeight} cm` : 'Filter by Countertop Clearance'}</span>
            </button>

            {isHeightActive && (
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="30"
                  max="65"
                  step="1"
                  value={maxHeight}
                  onChange={(e) => handleHeightChange(parseFloat(e.target.value))}
                  className="w-32 sm:w-48 accent-indigo-600 cursor-pointer"
                />
                <span className="font-extrabold text-indigo-600 text-xs">{maxHeight} cm</span>
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Facet Filters */}
        <aside className="space-y-6">
          {/* Categories Facet */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Categories
            </h4>
            <div className="space-y-1 text-xs">
              <button
                type="button"
                onClick={() => setCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold flex items-center justify-between transition-colors ${
                  category === 'all'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Appliances</span>
              </button>
              {data?.facets?.categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold flex items-center justify-between transition-colors ${
                    category === c.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{c.label}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                    {c.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Brands Facet */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Brands
            </h4>
            <div className="space-y-1 text-xs">
              <button
                type="button"
                onClick={() => setBrand('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold flex items-center justify-between transition-colors ${
                  brand === 'all'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Brands</span>
              </button>
              {data?.facets?.brands.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBrand(b.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold flex items-center justify-between transition-colors ${
                    brand.toLowerCase() === b.id.toLowerCase()
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{b.label}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                    {b.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Area: Results Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              {isLoading
                ? 'Searching...'
                : `Showing ${data?.total_hits || 0} ${
                    data?.total_hits === 1 ? 'match' : 'matches'
                  } for your space`}
            </p>
          </div>

          {isLoading ? (
            <div className="min-h-[300px] flex items-center justify-center">
              <ProtonSpinner size="md" variant="amber" label="Searching appliances..." />
            </div>
          ) : data?.items.length === 0 ? (
            <EmptyState
              title="No appliances found"
              description="No products in the catalog match your current search and height limits. Try widening your countertop clearance or clearing brand filters."
              actionLabel="Clear All Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {data?.items.map((prod) => {
                const fits = !isHeightActive || prod.height_cm <= maxHeight;

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                      {prod.image_url ? (
                        <img
                          src={prod.image_url}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Sparkles className="w-8 h-8" />
                        </div>
                      )}

                      {/* Clearance Badge */}
                      <div className="absolute top-3 left-3">
                        <FitmentBadge
                          size="sm"
                          status={fits ? 'verified' : 'warning'}
                          pulse={fits}
                          label={fits ? `Fits Space (${prod.height_cm} cm)` : `Requires ${prod.height_cm} cm`}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                          {prod.brand}
                        </span>
                        <h4
                          onClick={() => onProductSelect?.(prod)}
                          className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 cursor-pointer transition-colors line-clamp-1"
                        >
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span>{prod.height_cm} H × {prod.width_cm} W × {prod.depth_cm} D cm</span>
                        </div>
                      </div>

                      {/* Footer: Price & Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <PriceDisplay cents={Math.round(prod.price * 100)} size="md" />
                        </div>

                        <div className="flex items-center gap-2">
                          {onAddToCart && (
                            <button
                              type="button"
                              onClick={() => onAddToCart(prod)}
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                              title="Add to Cart"
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onProductSelect?.(prod)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SearchFragment;
