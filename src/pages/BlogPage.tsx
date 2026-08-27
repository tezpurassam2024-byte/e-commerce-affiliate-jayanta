import React, { useState, useEffect } from 'react';
import { FileText, Search, Tag, Clock, Plus, Sparkles, Filter } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { BlogPost, Category } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { BlogPostComposerModal } from '../components/BlogPostComposerModal';

interface BlogPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);

  const loadData = () => {
    setPosts(StorageService.getBlogPosts());
    setCategories(StorageService.getCategories());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('smartpick_data_change', loadData);
    return () => window.removeEventListener('smartpick_data_change', loadData);
  }, []);

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchExcerpt = p.excerpt.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt && !matchCategory) return false;
    }
    return true;
  });

  return (
    <div id="blog-index-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header & Write Post CTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hardware & Gear Articles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
            Tech Reviews, Explainers & Buying Guides
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            In-depth hardware reviews, smartphones testing, audio breakdowns, and tested product recommendations with verified Amazon links.
          </p>
        </div>

        {/* Create Post Action Button */}
        <button
          id="write-new-blog-post-btn"
          onClick={() => setComposerOpen(true)}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all hover:scale-102 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Blog Post & Review</span>
        </button>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Articles ({posts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles or products..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-lg mx-auto">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No articles found in this filter</h3>
          <p className="text-xs text-slate-500">
            Write your first review or guide for this category to share tested product recommendations with your audience.
          </p>
          <button
            onClick={() => setComposerOpen(true)}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Article</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <ArticleCard key={post.id} post={post} onNavigate={onNavigate} />
          ))}
        </div>
      )}

      {/* Blog Post Composer Modal */}
      <BlogPostComposerModal
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        onPostSaved={() => loadData()}
        onNavigate={onNavigate}
      />
    </div>
  );
};

