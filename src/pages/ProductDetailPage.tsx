import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Star,
  Check,
  X,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Award,
  Clock,
  Share2,
  Tag,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Copy,
} from 'lucide-react';
import { StorageService } from '../lib/storage';
import { Product } from '../types';
import { buildAmazonAffiliateUrl } from '../lib/amazon';
import { trackAffiliateClick } from '../lib/analytics';
import { ProductCard } from '../components/ProductCard';
import { ShareModal } from '../components/ShareModal';
import { copyToClipboard, buildShareUrl, triggerNativeShare } from '../lib/share';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isInComparison, setIsInComparison] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const loadProduct = () => {
    const found = StorageService.getProductBySlug(slug);
    if (found) {
      setProduct(found);
      const all = StorageService.getProducts();
      const related = all
        .filter((p) => p.categoryId === found.categoryId && p.id !== found.id && p.published)
        .slice(0, 3);
      setRelatedProducts(related);

      const comparisonIds = StorageService.getComparisonIds();
      setIsInComparison(comparisonIds.includes(found.id));
    }
  };

  useEffect(() => {
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.addEventListener('smartpick_comparison_change', loadProduct);
    return () => window.removeEventListener('smartpick_comparison_change', loadProduct);
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 text-sm">
          The requested product review could not be located in our database.
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm"
        >
          Back to All Products
        </button>
      </div>
    );
  }

  const settings = StorageService.getSettings();
  const affiliateUrl = buildAmazonAffiliateUrl(product);
  const shareUrl = buildShareUrl('product', product.slug);

  const handleCtaClick = () => {
    trackAffiliateClick(product, 'product_detail_hero_cta');
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const handleToggleComparison = () => {
    StorageService.toggleComparison(product.id);
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      const shared = await triggerNativeShare({
        title: product.name,
        text: product.verdict || product.shortDescription,
        url: shareUrl,
      });
      if (shared) return;
    }
    setShareModalOpen(true);
  };

  return (
    <div id={`product-detail-${product.slug}`} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto pb-1">
        <button onClick={() => onNavigate('home')} className="hover:text-slate-900 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('products')} className="hover:text-slate-900 transition-colors">
          Products
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button
          onClick={() => onNavigate('category-detail', { slug: product.categoryId })}
          className="hover:text-slate-900 transition-colors"
        >
          {product.categoryName}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-slate-800 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Top Review Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start bg-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 shadow-2xs">
        {/* Left Column: Visual Gallery & Badges */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={product.imageUrl?.startsWith('/src/assets/') ? product.imageUrl.replace('/src/assets/', '/assets/') : product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedSrc && product.imageUrl?.includes('/src/assets/')) {
                  target.dataset.triedSrc = 'true';
                  target.src = product.imageUrl;
                }
              }}
            />
            {product.editorScore && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-extrabold text-sm shadow-md">
                <Star className="w-4 h-4 fill-white" />
                <span>{product.editorScore.toFixed(1)} / 10</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span className="font-mono text-slate-400">ASIN: {product.asin || 'N/A'}</span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-slate-600 hover:text-emerald-700 font-medium"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Review'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Title, Quick Verdict & Primary CTA */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-md uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">{product.categoryName}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-serif-editorial">
              {product.name}
            </h1>
          </div>

          {/* Quick Verdict Box */}
          <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Editorial Summary & Verdict</span>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Price & Primary CTA */}
          <div className="p-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-200/80 rounded-2xl space-y-4">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
                  Amazon Verified Pricing
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {product.price ? `$${product.price.toFixed(2)}` : 'Check Amazon'}
                </span>
                <span className="text-xs text-slate-500 ml-1.5">*</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleComparison}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    isInComparison
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{isInComparison ? 'In Comparison' : 'Add to Compare'}</span>
                </button>
              </div>
            </div>

            {/* Big CTA Hyperlink Button */}
            <a
              id="product-detail-amazon-button"
              href={affiliateUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              onClick={() => trackAffiliateClick(product, 'product_detail_hero_cta')}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-base rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-700/20 transition-all cursor-pointer text-center"
            >
              <span>{settings.defaultCtaText || 'Check Price on Amazon'}</span>
              <ExternalLink className="w-5 h-5 text-emerald-100" />
            </a>

            {/* Direct Affiliate Hyperlink Under Banner */}
            <div className="pt-2.5 pb-1 px-2.5 bg-emerald-100/50 rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-xs">
              <span className="text-slate-700 font-semibold flex items-center gap-1">
                <span>Check your price on Amazon:</span>
              </span>
              <a
                id="product-detail-direct-link"
                href={affiliateUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                onClick={() => trackAffiliateClick(product, 'product_detail_direct_link')}
                className="text-emerald-800 hover:text-emerald-950 font-bold hover:underline font-mono text-[11px] sm:text-xs flex items-center gap-1 break-all bg-white px-2 py-0.5 rounded border border-emerald-300 shadow-2xs"
              >
                <span>{affiliateUrl}</span>
                <ExternalLink className="w-3 h-3 shrink-0 text-emerald-600" />
              </a>
            </div>

            {/* Amazon Associates Compliance & Price Date Note */}
            <div className="text-[11px] text-slate-500 leading-normal flex items-start gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {settings.affiliateDisclosureText || 'As an Amazon Associate I earn from qualifying purchases.'} Prices and availability are subject to change.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pros & Cons Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <h3>Why We Recommend It (Pros)</h3>
          </div>
          <ul className="space-y-3">
            {product.pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <div className="p-1.5 bg-rose-50 rounded-lg">
              <X className="w-5 h-5 text-rose-500" />
            </div>
            <h3>Things to Consider (Cons)</h3>
          </div>
          <ul className="space-y-3">
            {product.cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Hardware Specifications Table */}
      {(() => {
        const specsMap = product.specs || product.specifications;
        if (!specsMap || Object.keys(specsMap).length === 0) return null;
        return (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-serif-editorial">
                  Technical Specifications & Testing Data
                </h2>
                <p className="text-xs text-slate-500">Verified laboratory measurements and manufacturer specifications.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <tbody>
                  {Object.entries(specsMap).map(([key, val], idx) => (
                    <tr
                      key={key}
                      className={`border-b border-slate-100 ${
                        idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-700 w-1/3 text-xs sm:text-sm">
                        {key}
                      </td>
                      <td className="py-3 px-4 text-slate-900 font-mono-code text-xs sm:text-sm">
                        {String(val)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* Long-Form In-Depth Editorial Review */}
      {(() => {
        const reviewText = product.fullReview || product.longDescription;
        if (!reviewText) return null;
        return (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-10 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif-editorial">
              Full Editorial Review & Long-Term Impressions
            </h2>
            <div className="prose-editorial">
              {reviewText.split('\n\n').map((paragraph, pIdx) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={pIdx}>{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={pIdx}>{paragraph.replace('### ', '')}</h3>;
                }
                return <p key={pIdx}>{paragraph}</p>;
              })}
            </div>

            {/* Inline CTA block inside article */}
            <div className="mt-8 p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-base text-emerald-400">Current Amazon Availability</p>
                <p className="text-xs text-slate-300">
                  {product.priceNote || 'Direct merchant stock on Amazon'}
                </p>
              </div>
              <a
                href={affiliateUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                onClick={() => trackAffiliateClick(product, 'product_detail_article_inline_cta')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all cursor-pointer"
              >
                <span>{settings.defaultCtaText || 'Check Price on Amazon'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        );
      })()}

      {/* Related Products in Category */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-editorial">
              Alternative Picks in {product.categoryName}
            </h3>
            <button
              onClick={() => onNavigate('category-detail', { slug: product.categoryId })}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={onNavigate}
                placement="product_detail_related"
              />
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareData={{
          title: product.name,
          text: product.verdict || product.shortDescription,
          url: shareUrl,
          category: product.categoryName,
        }}
      />
    </div>
  );
};
