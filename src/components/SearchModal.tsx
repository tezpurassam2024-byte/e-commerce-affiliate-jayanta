import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Layers,
  BookOpen,
  FileText,
  Star,
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { StorageService } from '../lib/storage';
import { Product, BuyingGuide, BlogPost, Category } from '../types';
import { trackSearch } from '../lib/analytics';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [guides, setGuides] = useState<BuyingGuide[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isOpen) {
      setProducts(StorageService.getProducts());
      setGuides(StorageService.getBuyingGuides());
      setPosts(StorageService.getBlogPosts());
      setCategories(StorageService.getCategories());
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchedProducts = cleanQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.brand.toLowerCase().includes(cleanQuery) ||
          p.shortDescription.toLowerCase().includes(cleanQuery) ||
          p.categoryName.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedGuides = cleanQuery
    ? guides.filter(
        (g) =>
          g.title.toLowerCase().includes(cleanQuery) ||
          g.excerpt.toLowerCase().includes(cleanQuery) ||
          g.categoryName.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedPosts = cleanQuery
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(cleanQuery) ||
          p.excerpt.toLowerCase().includes(cleanQuery) ||
          p.category.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedCategories = cleanQuery
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(cleanQuery) ||
          c.description.toLowerCase().includes(cleanQuery)
      )
    : [];

  const totalResults =
    matchedProducts.length +
    matchedGuides.length +
    matchedPosts.length +
    matchedCategories.length;

  const handleSelect = (page: string, params?: Record<string, any>) => {
    if (query) trackSearch(query, totalResults);
    onNavigate(page, params);
    onClose();
  };

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    trackSearch(query, totalResults);
    onNavigate('search', { q: query.trim() });
    onClose();
  };

  return (
    <div
      id="global-search-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 md:p-12 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="global-search-modal"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden mt-8 sm:mt-12 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleFullSearch} className="relative flex items-center border-b border-slate-200 px-4 py-3 sm:py-4">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, buying guides, reviews, brands..."
            className="w-full text-base sm:text-lg text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold"
          >
            ESC
          </button>
        </form>

        {/* Results / Suggestions Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!query ? (
            /* Suggested Quick Queries */
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Noise Canceling Headphones',
                  'Ergonomic Desk Chair',
                  'Logitech Mouse',
                  'Garmin Smartwatch',
                  'Shure Microphone',
                  'Audio & Headphones',
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-medium rounded-xl transition-colors border border-slate-200/60"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Browse by Category
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 4).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelect('category-detail', { slug: c.slug })}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-left text-xs font-semibold text-slate-800 flex items-center justify-between group"
                    >
                      <span>{c.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : totalResults === 0 ? (
            /* Empty State */
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">No results found for &ldquo;{query}&rdquo;</h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                We couldn&apos;t find matching products or guides. Try searching for broader terms like &ldquo;Headphones&rdquo;, &ldquo;Office&rdquo;, or &ldquo;Microphone&rdquo;.
              </p>
            </div>
          ) : (
            /* Matched Sections */
            <div className="space-y-5">
              {/* Matched Products */}
              {matchedProducts.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-2">
                    Products ({matchedProducts.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedProducts.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelect('product-detail', { slug: p.slug })}
                        className="p-2.5 rounded-xl hover:bg-emerald-50/60 transition-colors flex items-center justify-between gap-3 cursor-pointer border border-transparent hover:border-emerald-100"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {p.brand} • {p.categoryName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {p.editorScore && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-bold">
                              ★ {p.editorScore.toFixed(1)}
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Buying Guides */}
              {matchedGuides.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Buying Guides ({matchedGuides.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedGuides.slice(0, 3).map((g) => (
                      <div
                        key={g.id}
                        onClick={() => handleSelect('guide-detail', { slug: g.slug })}
                        className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 cursor-pointer border border-transparent hover:border-slate-200"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                              {g.title}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {g.readTimeMinutes} min read • {g.categoryName}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Articles */}
              {matchedPosts.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Articles & Tech Explainers ({matchedPosts.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedPosts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        onClick={() => handleSelect('blog-detail', { slug: post.slug })}
                        className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <p className="font-medium text-slate-800 text-xs sm:text-sm truncate">
                            {post.title}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info & view all search page */}
        {query && totalResults > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>Found {totalResults} result{totalResults === 1 ? '' : 's'}</span>
            <button
              onClick={handleFullSearch}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
            >
              See all results page <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
