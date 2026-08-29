import React, { useState } from 'react';
import { Clock, Tag, ChevronRight, User, Share2, Check } from 'lucide-react';
import { BlogPost } from '../types';
import { ShareModal } from './ShareModal';
import { buildShareUrl, copyToClipboard } from '../lib/share';

interface ArticleCardProps {
  post: BlogPost;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  dark?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ post, onNavigate, dark = false }) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedQuick, setCopiedQuick] = useState(false);

  const shareUrl = buildShareUrl('blog', post.slug);

  const handleQuickShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareModalOpen(true);
  };

  return (
    <>
      <div
        id={`blog-card-${post.slug}`}
        onClick={() => onNavigate('blog-detail', { slug: post.slug })}
        className={`group rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between ${
          dark
            ? 'bg-zinc-900/95 border border-zinc-800 hover:border-blue-500/60 shadow-lg hover:shadow-blue-950/40 text-white'
            : 'bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-lg'
        }`}
      >
        <div className={`relative aspect-16/10 overflow-hidden ${dark ? 'bg-zinc-950' : 'bg-slate-100'}`}>
          <img
            src={post.featuredImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md rounded-lg shadow-sm ${
              dark ? 'bg-black/85 text-white border border-zinc-700' : 'bg-slate-900/80 text-white'
            }`}>
              {post.category}
            </span>
            {(post.productSpotlight || post.featuredProductId) && (
              <span className={`px-2 py-0.5 text-[10px] font-extrabold backdrop-blur-md rounded-md shadow-xs ${
                dark ? 'bg-blue-600 text-white border border-blue-400/30' : 'bg-emerald-600/90 text-white'
              }`}>
                ★ Product Spotlight
              </span>
            )}
          </div>

          {/* Quick Share Button on top right */}
          <button
            onClick={handleQuickShare}
            title="Share article"
            aria-label="Share article"
            className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-sm opacity-90 hover:opacity-100 ${
              dark ? 'bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700' : 'bg-slate-900/70 hover:bg-slate-900 text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className={`flex items-center gap-2 text-xs mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTimeMinutes} min read</span>
              <span>•</span>
              <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>

            <h3 className={`font-bold text-lg font-serif-editorial leading-snug transition-colors mb-2 ${
              dark ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-emerald-700'
            }`}>
              {post.title}
            </h3>

            <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4 ${
              dark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {post.excerpt}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded-md ${
                      dark ? 'bg-zinc-800 text-slate-300 border border-zinc-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Author Footer */}
          <div className={`pt-3 border-t flex items-center justify-between ${dark ? 'border-zinc-800' : 'border-slate-100'}`}>
            <div className="flex items-center gap-2">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  dark ? 'bg-zinc-800 text-slate-300' : 'bg-slate-200 text-slate-600'
                }`}>
                  <User className="w-3 h-3" />
                </div>
              )}
              <span className={`text-xs font-bold ${dark ? 'text-slate-200' : 'text-slate-700'}`}>{post.author.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleQuickShare}
                className={`p-1.5 rounded-lg transition-colors ${
                  dark ? 'text-slate-400 hover:text-white hover:bg-zinc-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title="Share this article"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <span className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                dark ? 'text-blue-400 group-hover:text-blue-300' : 'text-emerald-700 group-hover:text-emerald-800'
              }`}>
                Read <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareData={{
          title: post.title,
          text: post.excerpt,
          url: shareUrl,
          category: post.category,
        }}
      />
    </>
  );
};
