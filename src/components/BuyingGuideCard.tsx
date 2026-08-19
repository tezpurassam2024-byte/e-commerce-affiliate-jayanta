import React from 'react';
import { BookOpen, Clock, ChevronRight, User } from 'lucide-react';
import { BuyingGuide } from '../types';

interface BuyingGuideCardProps {
  guide: BuyingGuide;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  featured?: boolean;
}

export const BuyingGuideCard: React.FC<BuyingGuideCardProps> = ({
  guide,
  onNavigate,
  featured = false,
}) => {
  return (
    <div
      id={`guide-card-${guide.slug}`}
      onClick={() => onNavigate('guide-detail', { slug: guide.slug })}
      className={`group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col ${
        featured ? 'md:grid md:grid-cols-12 md:gap-6' : ''
      }`}
    >
      {/* Media */}
      <div
        className={`relative overflow-hidden bg-slate-100 ${
          featured ? 'md:col-span-6 h-64 md:h-full' : 'aspect-16/10'
        }`}
      >
        <img
          src={guide.featuredImage}
          alt={guide.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md rounded-lg shadow-sm">
            {guide.categoryName}
          </span>
        </div>
      </div>

      {/* Body */}
      <div
        className={`p-5 sm:p-6 flex-1 flex flex-col justify-between ${
          featured ? 'md:col-span-6' : ''
        }`}
      >
        <div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {guide.readTimeMinutes} min read
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Tested & Verified</span>
          </div>

          <h3 className="font-bold text-slate-900 text-lg sm:text-xl font-serif-editorial leading-snug group-hover:text-emerald-700 transition-colors mb-2.5">
            {guide.title}
          </h3>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
            {guide.excerpt}
          </p>
        </div>

        {/* Author info & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {guide.author.avatar ? (
              <img
                src={guide.author.avatar}
                alt={guide.author.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="text-xs">
              <p className="font-bold text-slate-800 leading-none">{guide.author.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{guide.author.role}</p>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1">
            Read Guide <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};
