import React from 'react';
import { Clock, Tag, ChevronRight, User } from 'lucide-react';
import { BlogPost } from '../types';

interface ArticleCardProps {
  post: BlogPost;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ post, onNavigate }) => {
  return (
    <div
      id={`blog-card-${post.slug}`}
      onClick={() => onNavigate('blog-detail', { slug: post.slug })}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
        <img
          src={post.featuredImage}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md rounded-lg shadow-sm">
            {post.category}
          </span>
          {(post.productSpotlight || post.featuredProductId) && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-600/90 text-white backdrop-blur-md rounded-md shadow-xs">
              ★ Product Spotlight
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTimeMinutes} min read</span>
            <span>•</span>
            <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h3 className="font-bold text-slate-900 text-lg font-serif-editorial leading-snug group-hover:text-emerald-700 transition-colors mb-2">
            {post.title}
          </h3>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Author Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs">
                <User className="w-3 h-3" />
              </div>
            )}
            <span className="text-xs font-bold text-slate-700">{post.author.name}</span>
          </div>

          <span className="text-xs font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1">
            Read <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};
