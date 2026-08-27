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
import { buildAmazonAffiliateUrl } from '../lib/amazon';
import { trackAffiliateClick } from '../lib/analytics';
import { StorageService } from '../lib/storage';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  placement?: string;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  placement = 'product_card',
  compact = false,
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

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onNavigate('product-detail', { slug: product.slug })}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Media & Badges */}
      <div className="relative aspect-4/3 sm:aspect-16/10 bg-slate-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {/* Category Tag */}
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md rounded-lg shadow-sm">
            {product.categoryName}
          </span>

          {/* Editor Score Badge */}
          {product.editorScore && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600/90 text-white backdrop-blur-md rounded-lg text-xs font-bold shadow-sm">
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
              ? 'bg-emerald-600 text-white'
              : 'bg-white/90 text-slate-700 hover:bg-white'
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
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {product.brand}
            </span>
            {product.price && (
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                ${product.price.toFixed(2)}*
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors mb-2">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
            {product.shortDescription}
          </p>

          {/* Pros snippet */}
          {!compact && product.pros && product.pros.length > 0 && (
            <div className="space-y-1.5 mb-4 pt-2 border-t border-slate-100">
              {product.pros.slice(0, 2).map((pro, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{pro}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          {/* Primary Affiliate Button */}
          <a
            id={`buy-button-${product.id}`}
            href={affiliateUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={handleAffiliateClick}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-emerald-600/20 active:scale-[0.98] cursor-pointer text-center"
          >
            <span>{ctaText}</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-100" />
          </a>

          {/* Amazon price note */}
          <p className="text-[10px] text-center text-slate-400">
            *Prices and availability verified on Amazon. Subject to change.
          </p>
        </div>
      </div>
    </div>
  );
};
