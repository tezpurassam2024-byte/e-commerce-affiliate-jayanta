import React, { useState, useEffect } from 'react';
import { ChevronRight, Clock, User, Share2, Tag, ShieldCheck } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { BlogPost } from '../types';

interface BlogDetailPageProps {
  slug: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const allPosts = StorageService.getBlogPosts();
    const found = allPosts.find((p) => p.slug === slug || p.id === slug);
    if (found) {
      setPost(found);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Article Not Found</h2>
        <button
          onClick={() => onNavigate('blog')}
          className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <article id={`blog-detail-${post.slug}`} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto">
        <button onClick={() => onNavigate('home')} className="hover:text-slate-900">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('blog')} className="hover:text-slate-900">
          Blog
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-slate-800 truncate">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {post.readTimeMinutes} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-serif-editorial">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Author info */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold">
                <User className="w-5 h-5" />
              </div>
            )}
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">{post.author.name}</p>
              <p className="text-[11px] text-slate-400">
                {post.author.role} • Published {new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </header>

      {/* Featured Header Image */}
      <div className="aspect-16/9 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
        <img
          src={post.featuredImage}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Post Content */}
      <div className="prose-editorial bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-2xs">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('## ')) {
            return <h2 key={idx}>{paragraph.replace('## ', '')}</h2>;
          }
          if (paragraph.startsWith('### ')) {
            return <h3 key={idx}>{paragraph.replace('### ', '')}</h3>;
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center gap-2 pt-2">
          <Tag className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Tags:</span>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
