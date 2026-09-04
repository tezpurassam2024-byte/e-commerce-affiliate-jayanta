import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Star,
  Check,
  X,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { Product } from '../types';
import { buildAmazonAffiliateUrl, formatProductPrice } from '../lib/amazon';
import { trackAffiliateClick } from '../lib/analytics';
import { StorageService } from '../lib/storage';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  placement?: string;
  compact?: boolean;
  dark?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  placement = 'product_card',
  compact = false,
  dark = false,
}) => {
  const [isInComparison, setIsInComparison] = useState(false);

  useEffect(() => {
    const checkComparison = () => {
      const ids = StorageService.getComparisonIds();
      setIsInComparison(ids.includes(product.id));
    };
    checkComparison();
    window.addEventListener('smartpick_comparison_change', checkComparison);
    return () => {
      window.removeEventListener('smartpick_comparison_change', checkComparison);
    };
  }, [product.id]);

  const affiliateUrl = buildAmazonAffiliateUrl(product);

  const handleAffiliateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackAffiliateClick(product, placement);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.toggleComparison(product.id);
  };

  const settings = StorageService.getSettings();
  const ctaText = settings.defaultCtaText || 'Check Price on Amazon';

  const serialMatch = product.name?.match(/^No\s+(\d+)[:.-]?\s*/i);
  const serialBadge = serialMatch ? `No ${serialMatch[1]}` : null;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onNavigate('product-detail', { slug: product.slug })}
      className={`group rounded-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative ${
        dark
          ? 'bg-zinc-900/95 border border-zinc-800 hover:border-blue-500/60 shadow-lg hover:shadow-blue-950/40 text-white'
          : 'bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-lg'
      }`}
    >
      {/* Top Media & Badges */}
      <div className={`relative aspect-4/3 sm:aspect-16/10 overflow-hidden ${dark ? 'bg-zinc-950' : 'bg-slate-100'}`}>
        <img
          src={product.imageUrl?.startsWith('/src/assets/') ? product.imageUrl.replace('/src/assets/', '/assets/') : product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.triedSrc && product.imageUrl?.includes('/src/assets/')) {
              target.dataset.triedSrc = 'true';
              target.src = product.imageUrl;
            }
          }}
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {/* Category Tag & Serial Badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {serialBadge && (
              <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg shadow-sm bg-amber-400 text-slate-950">
                {serialBadge}
              </span>
            )}
            <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md rounded-lg shadow-sm ${
              dark ? 'bg-black/85 text-white border border-zinc-700' : 'bg-slate-900/80 text-white'
            }`}>
              {product.categoryName}
            </span>
          </div>

          {/* Editor Score Badge */}
          {product.editorScore && (
            <div className={`flex items-center gap-1 px-2.5 py-1 backdrop-blur-md rounded-lg text-xs font-bold shadow-sm shrink-0 ${
              dark ? 'bg-blue-600/90 text-white border border-blue-400/30' : 'bg-emerald-600/90 text-white'
            }`}>
              <Star className="w-3.5 h-3.5 fill-white" />
              <span>{product.editorScore.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Quick Compare Toggle */}
        <button
          onClick={handleToggleCompare}
          title={isInComparison ? 'Remove from Comparison' : 'Add to Comparison'}
          className={`absolute bottom-3 right-3 p-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all shadow-sm flex items-center gap-1.5 ${
            isInComparison
              ? dark ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
              : dark ? 'bg-zinc-900/90 text-slate-200 hover:bg-zinc-800 border border-zinc-700' : 'bg-white/90 text-slate-700 hover:bg-white'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="text-[11px]">{isInComparison ? 'In Compare' : 'Compare'}</span>
        </button>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Best For */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-xs font-bold uppercase tracking-wider ${dark ? 'text-blue-400' : 'text-emerald-700'}`}>
              {product.brand}
            </span>
            {product.price && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                dark ? 'text-white bg-zinc-800 border border-zinc-700' : 'text-slate-900 bg-slate-100'
              }`}>
                {formatProductPrice(product.price, product.currency)}*
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`font-bold text-base sm:text-lg leading-snug line-clamp-2 transition-colors mb-2 ${
            dark ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-emerald-700'
          }`}>
            {product.name}
          </h3>

          {/* Short description */}
          <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4 ${
            dark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {product.shortDescription}
          </p>

          {/* Pros snippet */}
          {!compact && product.pros && product.pros.length > 0 && (
            <div className={`space-y-1.5 mb-4 pt-2 border-t ${dark ? 'border-zinc-800' : 'border-slate-100'}`}>
              {product.pros.slice(0, 2).map((pro, idx) => (
                <div key={idx} className={`flex items-start gap-1.5 text-xs ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                  <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${dark ? 'text-blue-400' : 'text-emerald-600'}`} />
                  <span className="line-clamp-1">{pro}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className={`pt-3 border-t space-y-2 ${dark ? 'border-zinc-800' : 'border-slate-100'}`}>
          {/* Primary Affiliate Button */}
          <a
            id={`buy-button-${product.id}`}
            href={affiliateUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={handleAffiliateClick}
            className={`w-full py-2.5 px-4 font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer text-center text-white ${
              dark
                ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30 hover:shadow-blue-500/40'
                : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-600/20'
            }`}
          >
            <span>{ctaText}</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-100" />
          </a>

          {/* Direct Hyperlink Under Banner / Button */}
          <div className="text-center pt-0.5 px-1">
            <a
              href={affiliateUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              onClick={handleAffiliateClick}
              className={`text-[11px] font-mono hover:underline inline-flex items-center justify-center gap-1 max-w-full truncate ${
                dark ? 'text-blue-400 hover:text-blue-300' : 'text-emerald-700 hover:text-emerald-900 font-medium'
              }`}
              title={affiliateUrl}
            >
              <span className="truncate">{affiliateUrl}</span>
              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
            </a>
          </div>

          {/* Amazon price note */}
          <p className={`text-[10px] text-center ${dark ? 'text-slate-400' : 'text-slate-400'}`}>
            *Prices and availability verified on Amazon. Subject to change.
          </p>
        </div>
      </div>
    </div>
  );
};
