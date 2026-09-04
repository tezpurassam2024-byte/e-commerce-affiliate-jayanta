import React, { useState, useEffect, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  Search,
  X,
  Star,
  ChevronDown,
  LayoutGrid,
  ListFilter,
  RotateCcw
} from 'lucide-react';
import { StorageService } from '../lib/storage';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ProductsPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  initialCategory?: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onNavigate,
  initialCategory,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceTier, setPriceTier] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score' | 'price_asc' | 'price_desc' | 'name'>('score');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const loadData = () => {
    setProducts(StorageService.getProducts());
    setCategories(StorageService.getCategories());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('smartpick_data_change', loadData);
    return () => window.removeEventListener('smartpick_data_change', loadData);
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Unique Brands
  const availableBrands = useMemo(() => {
    const brands = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.published) return false;
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
        if (minScore > 0 && (p.editorScore || 0) < minScore) return false;

        const price = p.price || 0;
        if (priceTier === 'under100' && price > 100) return false;
        if (priceTier === '100to400' && (price < 100 || price > 400)) return false;
        if (priceTier === 'above400' && price < 400) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchDesc = p.shortDescription.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return (b.editorScore || 0) - (a.editorScore || 0);
        if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
        return 0;
      });
  }, [products, selectedCategory, selectedBrand, minScore, priceTier, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceTier('all');
    setMinScore(0);
    setSearchQuery('');
    setSortBy('score');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    priceTier !== 'all' ||
    minScore > 0 ||
    searchQuery.trim() !== '';

  return (
    <div id="products-catalog-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <span>Verified Lab Tested Gear</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
            All Product Reviews
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Browse our full catalog of independently evaluated hardware, complete with pros, cons, and editor scores.
          </p>
        </div>

        {/* Mobile filter toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 shadow-2xs"
          >
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Filter Catalog {hasActiveFilters && '(Active)'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Products */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* SIDEBAR FILTERS (Desktop + Mobile Drawer) */}
        <aside
          className={`md:col-span-4 lg:col-span-3 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          } bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>Filters</span>
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Search Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Search in Catalog</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Brands</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Tier */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Price Range</label>
            <div className="space-y-1.5 text-xs text-slate-600">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under100', label: 'Under $100' },
                { id: '100to400', label: '$100 – $400' },
                { id: 'above400', label: '$400+' },
              ].map((tier) => (
                <label key={tier.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price_tier"
                    checked={priceTier === tier.id}
                    onChange={() => setPriceTier(tier.id)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{tier.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Editor Score */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Minimum Editor Score ({minScore > 0 ? `${minScore.toFixed(1)}+` : 'Any'})
            </label>
            <input
              type="range"
              min="0"
              max="9.5"
              step="0.5"
              value={minScore}
              onChange={(e) => setMinScore(parseFloat(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Any</span>
              <span>8.0+</span>
              <span>9.0+</span>
              <span>9.5+</span>
            </div>
          </div>
        </aside>

        {/* PRODUCTS CONTENT (Desktop right col) */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          {/* Top Bar: Sort & Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-700">
              Showing {filteredProducts.length} of {products.length} Products
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 shrink-0">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="score">Highest Editor Score</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Products Grid or Empty */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">No products match your current filters</h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                Try resetting your filters or adjusting your price and score criteria to see available reviewed products.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={onNavigate}
                  placement="products_catalog_grid"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
