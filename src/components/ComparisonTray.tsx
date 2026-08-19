import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, X, ArrowRight, Trash2 } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { Product } from '../types';

interface ComparisonTrayProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ComparisonTray: React.FC<ComparisonTrayProps> = ({ onNavigate }) => {
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);

  const loadComparison = () => {
    const ids = StorageService.getComparisonIds();
    const allProducts = StorageService.getProducts();
    const matched = ids
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
    setComparisonProducts(matched);
  };

  useEffect(() => {
    loadComparison();
    window.addEventListener('smartpick_comparison_change', loadComparison);
    window.addEventListener('smartpick_data_change', loadComparison);
    return () => {
      window.removeEventListener('smartpick_comparison_change', loadComparison);
      window.removeEventListener('smartpick_data_change', loadComparison);
    };
  }, []);

  if (comparisonProducts.length === 0) return null;

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    StorageService.toggleComparison(id);
  };

  const handleClear = () => {
    StorageService.clearComparison();
  };

  return (
    <div
      id="comparison-floating-tray"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-6 duration-300"
    >
      <div className="bg-slate-900/95 text-white backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Indicator & Chips */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 w-full sm:w-auto">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 border border-emerald-700/60 rounded-xl text-emerald-400 text-xs font-bold shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Compare ({comparisonProducts.length}/4)</span>
          </div>

          <div className="flex items-center gap-2">
            {comparisonProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl py-1 px-2 text-xs shrink-0 max-w-[130px]"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-md object-cover"
                />
                <span className="truncate text-[11px] font-medium">{p.name}</span>
                <button
                  onClick={(e) => handleRemove(e, p.id)}
                  className="text-slate-400 hover:text-white p-0.5 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={handleClear}
            className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            onClick={() => onNavigate('compare')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-102"
          >
            <span>Compare Specs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
