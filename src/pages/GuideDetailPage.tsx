import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  Clock,
  User,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Share2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { StorageService } from '../lib/storage';
import { BuyingGuide, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ShareModal } from '../components/ShareModal';
import { copyToClipboard, buildShareUrl, triggerNativeShare } from '../lib/share';

interface GuideDetailPageProps {
  slug: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const [guide, setGuide] = useState<BuyingGuide | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const allGuides = StorageService.getBuyingGuides();
    const found = allGuides.find((g) => g.slug === slug || g.id === slug);
    if (found) {
      setGuide(found);
      const allProducts = StorageService.getProducts();
      const productIds = found.featuredProductIds || found.recommendedProductIds || [];
      const matched = productIds
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p));
      setFeaturedProducts(matched);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!guide) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Guide Not Found</h2>
        <button
          onClick={() => onNavigate('guides')}
          className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm"
        >
          Back to Guides
        </button>
      </div>
    );
  }

  const shareUrl = buildShareUrl('guide', guide.slug);

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      const shared = await triggerNativeShare({
        title: guide.title,
        text: guide.excerpt,
        url: shareUrl,
      });
      if (shared) return;
    }
    setShareModalOpen(true);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      <article id={`guide-detail-${guide.slug}`} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto">
        <button onClick={() => onNavigate('home')} className="hover:text-slate-900">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('guides')} className="hover:text-slate-900">
          Buying Guides
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-slate-800 truncate">{guide.title}</span>
      </nav>

      {/* Guide Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full uppercase tracking-wider">
            {guide.categoryName}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {guide.readTimeMinutes} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-serif-editorial">
          {guide.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {guide.excerpt}
        </p>

        {/* Author metadata bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            {guide.author.avatar ? (
              <img
                src={guide.author.avatar}
                alt={guide.author.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold">
                <User className="w-5 h-5" />
              </div>
            )}
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">{guide.author.name}</p>
              <p className="text-[11px] text-slate-400">
                {guide.author.role} • Updated {new Date(guide.updatedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              title="Copy Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Header Image */}
      <div className="aspect-16/9 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
        <img
          src={guide.featuredImage}
          alt={guide.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Prominent Affiliate & Pricing Disclosure Box */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p>
          <span className="font-bold text-slate-800">Affiliate Disclosure:</span> When you buy through our links, we may earn an affiliate commission from Amazon Associates at no extra cost to you. We independently test and select all featured products.
        </p>
      </div>

      {/* Top Featured Products Spotlight */}
      {featuredProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 font-serif-editorial">
              Top Tested Recommendations in This Guide
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={onNavigate}
                placement="guide_featured_spotlight"
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Guide Content */}
      <div className="prose-editorial bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-2xs">
        {guide.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('## ')) {
            return <h2 key={idx}>{paragraph.replace('## ', '')}</h2>;
          }
          if (paragraph.startsWith('### ')) {
            return <h3 key={idx}>{paragraph.replace('### ', '')}</h3>;
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* Author Bio Box */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {guide.author.avatar && (
          <img
            src={guide.author.avatar}
            alt={guide.author.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-2xl object-cover shrink-0"
          />
        )}
        <div className="space-y-1">
          <h4 className="font-bold text-base text-emerald-400">Written by {guide.author.name}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {guide.author.bio}
          </p>
        </div>
      </div>
    </article>

    {/* Share Modal */}
    <ShareModal
      isOpen={shareModalOpen}
      onClose={() => setShareModalOpen(false)}
      shareData={{
        title: guide.title,
        text: guide.excerpt,
        url: shareUrl,
        category: guide.categoryName,
      }}
    />
  </>
);
};
