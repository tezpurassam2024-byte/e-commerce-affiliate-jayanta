import React, { useState, useEffect } from 'react';
import { FileText, Search, Tag, Clock } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { BlogPost } from '../types';
import { ArticleCard } from '../components/ArticleCard';

interface BlogPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setPosts(StorageService.getBlogPosts());
  }, []);

  const filteredPosts = posts.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchExcerpt = p.excerpt.toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt) return false;
    }
    return true;
  });

  return (
    <div id="blog-index-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Hardware & Gear Articles
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
          Tech Reviews, News & Explainers
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          In-depth technical explainers, ergonomic ergonomics research, and gear maintenance tips from our hardware journalists.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <span className="text-xs font-bold text-slate-600">{filteredPosts.length} Articles</span>
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <ArticleCard key={post.id} post={post} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
};
