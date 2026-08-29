import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  BookOpen,
  TrendingUp,
  Star
} from 'lucide-react';
import { StorageService } from '../lib/storage';
import { Product, Category, BuyingGuide, BlogPost, SiteSettings } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { BuyingGuideCard } from '../components/BuyingGuideCard';
import { ArticleCard } from '../components/ArticleCard';
import { RecommendationWizard } from '../components/RecommendationWizard';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [guides, setGuides] = useState<BuyingGuide[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [homeSearchInput, setHomeSearchInput] = useState('');

  const loadData = () => {
    setProducts(StorageService.getProducts());
    setCategories(StorageService.getCategories());
    setGuides(StorageService.getBuyingGuides());
    setPosts(StorageService.getBlogPosts());
    setSettings(StorageService.getSettings());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('smartpick_data_change', loadData);
    return () => window.removeEventListener('smartpick_data_change', loadData);
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeSearchInput.trim()) {
      onNavigate('search', { q: homeSearchInput.trim() });
    } else {
      onOpenSearch();
    }
  };

  const filteredProducts =
    selectedCategoryTab === 'all'
      ? products.filter((p) => p.published && p.featured)
      : products.filter((p) => p.published && p.categoryId === selectedCategoryTab);

  return (
    <div id="home-page" className="bg-black text-white space-y-16 sm:space-y-24 pb-20 selection:bg-blue-600 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-20 overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Editorial Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/90 border border-blue-500/40 rounded-full text-blue-300 text-xs font-bold shadow-lg shadow-blue-950/30">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Independent & Unbiased Testing • 2026 Edition</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-serif-editorial">
              Find Better Products.{' '}
              <span className="text-blue-400 italic font-normal block sm:inline">
                Buy With Confidence.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              {settings.tagline || 'Independent product research, comparisons, and buying guides to help you make smarter purchasing decisions.'}
            </p>

            {/* Prominent Search Bar */}
            <div className="pt-2 max-w-xl mx-auto">
              <form
                onSubmit={handleHeroSearch}
                className="relative flex items-center bg-zinc-900/90 rounded-2xl border-2 border-blue-500/40 hover:border-blue-400 focus-within:border-blue-500 shadow-xl shadow-blue-950/40 p-1.5 transition-all"
              >
                <Search className="w-5 h-5 text-blue-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={homeSearchInput}
                  onChange={(e) => setHomeSearchInput(e.target.value)}
                  placeholder="Search for a product, category, or buying guide..."
                  className="w-full px-3 py-2.5 text-sm sm:text-base text-white placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shrink-0 shadow-md shadow-blue-600/30"
                >
                  Search
                </button>
              </form>
            </div>

            {/* CTAs & Quick Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                id="hero-explore-products-btn"
                onClick={() => onNavigate('products')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-read-guides-btn"
                onClick={() => onNavigate('guides')}
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl transition-all border border-zinc-700 shadow-md flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Read Buying Guides</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 grid grid-cols-3 gap-2 sm:gap-6 border-t border-zinc-800 max-w-xl mx-auto text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-slate-300">
                  100% Independent Lab Tested
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-slate-300">
                  No Paid Sponsorships
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-slate-300">
                  Amazon Associates Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
              Explore Our Testing Labs
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif-editorial">
              Featured Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs sm:text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>View all categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <CategoryCard
                key={cat.id}
                category={cat}
                productCount={count}
                onNavigate={onNavigate}
                dark={true}
              />
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (TOP PICKS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
              Editorial Benchmark
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif-editorial">
              Top Picks & Recommended Gear
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Hand-tested hardware with clear verdicts, real specs, and verified Amazon availability.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedCategoryTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                selectedCategoryTab === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-zinc-900 text-slate-300 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              All Featured
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryTab(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                  selectedCategoryTab === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-zinc-900 text-slate-300 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
              placement="homepage_featured_grid"
              dark={true}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('products')}
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>View All {products.length} Products in Catalog</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </section>

      {/* 4. INTERACTIVE PRODUCT FINDER / RECOMMENDATION ENGINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecommendationWizard onNavigate={onNavigate} dark={true} />
      </section>

      {/* 5. FEATURED BUYING GUIDES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
              Comprehensive Analysis
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif-editorial">
              In-Depth Buying Guides
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Long-term testing benchmarks, trade-off breakdowns, and definitive buying checklists.
            </p>
          </div>
          <button
            onClick={() => onNavigate('guides')}
            className="text-xs sm:text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>All Guides</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          {guides.map((guide, idx) => (
            <BuyingGuideCard
              key={guide.id}
              guide={guide}
              onNavigate={onNavigate}
              featured={idx === 0}
              dark={true}
            />
          ))}
        </div>
      </section>

      {/* 6. COMPARISON SPOTLIGHT CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-zinc-800 relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold border border-blue-500/30">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Side-by-Side Comparison Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif-editorial text-white">
              Can&apos;t Decide Between Two Flagships?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Compare 2 to 4 products simultaneously across 15+ verified specification points, battery benchmarks, pros & cons matrices, and editor verdicts.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('compare')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center gap-2"
              >
                <span>Launch Comparison Matrix</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-slate-200 font-bold text-xs sm:text-sm rounded-xl transition-all border border-zinc-700"
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LATEST ARTICLES & TECH EXPLAINERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
              Tech & Hardware Advice
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif-editorial">
              From Our Editorial Desk
            </h2>
          </div>
          <button
            onClick={() => onNavigate('blog')}
            className="text-xs sm:text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>All Articles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} onNavigate={onNavigate} dark={true} />
          ))}
        </div>
      </section>
    </div>
  );
};
