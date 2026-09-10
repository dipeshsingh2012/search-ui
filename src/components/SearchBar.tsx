import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onOpenModal?: () => void;
  className?: string;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onOpenModal,
  className = '',
  placeholder = 'Search appliances, brands...',
}) => {
  return (
    <button
      type="button"
      onClick={onOpenModal}
      className={`flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-slate-500 text-xs font-medium transition-all group shadow-2xs ${className}`}
      title="Search (⌘K)"
    >
      <div className="flex items-center gap-2">
        <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        <span className="truncate">{placeholder}</span>
      </div>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-500 shadow-2xs">
        <span>⌘</span>K
      </kbd>
    </button>
  );
};
export default SearchBar;
