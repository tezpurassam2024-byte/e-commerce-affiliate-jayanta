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
    <div id="home-page" className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-20 overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-[#fafafa] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Editorial Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-emerald-200/80 rounded-full text-emerald-800 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Independent & Unbiased Testing • 2026 Edition</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] font-serif-editorial">
              Find Better Products.{' '}
              <span className="text-emerald-700 italic font-normal block sm:inline">
                Buy With Confidence.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              {settings.tagline || 'Independent product research, comparisons, and buying guides to help you make smarter purchasing decisions.'}
            </p>

            {/* Prominent Search Bar */}
            <div className="pt-2 max-w-xl mx-auto">
              <form
                onSubmit={handleHeroSearch}
                className="relative flex items-center bg-white rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500/60 focus-within:border-emerald-600 shadow-lg shadow-emerald-950/5 p-1.5 transition-all"
              >
                <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={homeSearchInput}
                  onChange={(e) => setHomeSearchInput(e.target.value)}
                  placeholder="Search for a product, category, or buying guide..."
                  className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shrink-0 shadow-sm"
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
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-read-guides-btn"
                onClick={() => onNavigate('guides')}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl transition-all border border-slate-200 shadow-2xs flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Read Buying Guides</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 grid grid-cols-3 gap-2 sm:gap-6 border-t border-slate-200/80 max-w-xl mx-auto text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-slate-700">
                  100% Independent Lab Tested
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-slate-700">
                  No Paid Sponsorships
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-slate-700">
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
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              Explore Our Testing Labs
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
              Featured Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
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
              />
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (TOP PICKS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              Editorial Benchmark
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
              Top Picks & Recommended Gear
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Hand-tested hardware with clear verdicts, real specs, and verified Amazon availability.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedCategoryTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                selectedCategoryTab === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
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
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
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
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('products')}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-2xs inline-flex items-center gap-2"
          >
            <span>View All {products.length} Products in Catalog</span>
            <ArrowRight className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </section>

      {/* 4. INTERACTIVE PRODUCT FINDER / RECOMMENDATION ENGINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecommendationWizard onNavigate={onNavigate} />
      </section>

      {/* 5. FEATURED BUYING GUIDES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              Comprehensive Analysis
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
              In-Depth Buying Guides
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Long-term testing benchmarks, trade-off breakdowns, and definitive buying checklists.
            </p>
          </div>
          <button
            onClick={() => onNavigate('guides')}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
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
            />
          ))}
        </div>
      </section>

      {/* 6. COMPARISON SPOTLIGHT CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-700/80 relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Side-by-Side Comparison Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif-editorial">
              Can&apos;t Decide Between Two Flagships?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Compare 2 to 4 products simultaneously across 15+ verified specification points, battery benchmarks, pros & cons matrices, and editor verdicts.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('compare')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>Launch Comparison Matrix</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-xl transition-all border border-slate-600"
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
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              Tech & Hardware Advice
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
              From Our Editorial Desk
            </h2>
          </div>
          <button
            onClick={() => onNavigate('blog')}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>All Articles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
    </div>
  );
};
