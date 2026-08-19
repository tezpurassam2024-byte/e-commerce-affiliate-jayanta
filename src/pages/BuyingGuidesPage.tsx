import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Clock, Sparkles } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { BuyingGuide, Category } from '../types';
import { BuyingGuideCard } from '../components/BuyingGuideCard';

interface BuyingGuidesPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const BuyingGuidesPage: React.FC<BuyingGuidesPageProps> = ({ onNavigate }) => {
  const [guides, setGuides] = useState<BuyingGuide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setGuides(StorageService.getBuyingGuides());
    setCategories(StorageService.getCategories());
  }, []);

  const filteredGuides = guides.filter((g) => {
    if (selectedCategory !== 'all' && g.categoryId !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = g.title.toLowerCase().includes(q);
      const matchExcerpt = g.excerpt.toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt) return false;
    }
    return true;
  });

  return (
    <div id="buying-guides-index-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Definitive Buying Frameworks</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
          Comprehensive Buying Guides
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          In-depth testing roundups designed to help you understand trade-offs, compare standout options, and avoid costly shopping mistakes.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Guides
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                selectedCategory === c.id
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Guides Grid */}
      <div className="space-y-6">
        {filteredGuides.map((guide, idx) => (
          <BuyingGuideCard
            key={guide.id}
            guide={guide}
            onNavigate={onNavigate}
            featured={idx === 0 && selectedCategory === 'all'}
          />
        ))}
      </div>
    </div>
  );
};
