import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, BookOpen, FileText, ArrowRight } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { Product, BuyingGuide, BlogPost } from '../types';
import { ProductCard } from '../components/ProductCard';
import { BuyingGuideCard } from '../components/BuyingGuideCard';
import { ArticleCard } from '../components/ArticleCard';

interface SearchResultsPageProps {
  initialQuery?: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  initialQuery = '',
  onNavigate,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [guides, setGuides] = useState<BuyingGuide[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setProducts(StorageService.getProducts());
    setGuides(StorageService.getBuyingGuides());
    setPosts(StorageService.getBlogPosts());
  }, []);

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

  const total = matchedProducts.length + matchedGuides.length + matchedPosts.length;

  return (
    <div id="full-search-results-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Search Header */}
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
          Search Results {query && `for "${query}"`}
        </h1>

        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, guides, reviews..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-base text-slate-900 focus:outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>

        <p className="text-xs text-slate-500">
          Found {total} matching result{total === 1 ? '' : 's'} across products, buying guides, and articles.
        </p>
      </div>

      {/* Matched Products */}
      {matchedProducts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            Matching Products ({matchedProducts.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matchedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={onNavigate}
                placement="search_results_product"
              />
            ))}
          </div>
        </section>
      )}

      {/* Matched Guides */}
      {matchedGuides.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            Matching Buying Guides ({matchedGuides.length})
          </h2>
          <div className="space-y-4">
            {matchedGuides.map((g) => (
              <BuyingGuideCard key={g.id} guide={g} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      {/* Matched Posts */}
      {matchedPosts.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            Matching Blog Articles ({matchedPosts.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchedPosts.map((p) => (
              <ArticleCard key={p.id} post={p} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      {total === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Search className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-800">No matching results</h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto">
            Try checking your spelling or searching for generic hardware terms like &ldquo;Headphones&rdquo; or &ldquo;Mouse&rdquo;.
          </p>
        </div>
      )}
    </div>
  );
};
