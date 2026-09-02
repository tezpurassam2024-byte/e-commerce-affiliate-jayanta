import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  Plus,
  X,
  ExternalLink,
  Star,
  Check,
  CheckCircle2,
  AlertCircle,
  Share2,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { StorageService } from '../lib/storage';
import { Product } from '../types';
import { buildAmazonAffiliateUrl, formatProductPrice } from '../lib/amazon';
import { trackAffiliateClick } from '../lib/analytics';

interface ComparisonPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({ onNavigate }) => {
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadData = () => {
    const ids = StorageService.getComparisonIds();
    const products = StorageService.getProducts();
    setAllProducts(products);

    let matched = ids
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));

    // If none selected yet, seed with top 2 featured headphones for instant wow factor
    if (matched.length === 0 && products.length >= 2) {
      matched = products.slice(0, 2);
    }
    setComparedProducts(matched);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('smartpick_comparison_change', loadData);
    return () => window.removeEventListener('smartpick_comparison_change', loadData);
  }, []);

  const handleRemove = (id: string) => {
    StorageService.toggleComparison(id);
  };

  const handleAdd = (id: string) => {
    StorageService.toggleComparison(id);
    setAddModalOpen(false);
  };

  const handleAffiliateClick = (product: Product) => {
    trackAffiliateClick(product, 'comparison_matrix_table');
    const url = buildAmazonAffiliateUrl(product);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Extract all unique spec keys across compared items
  const allSpecKeys = Array.from(
    new Set(comparedProducts.flatMap((p) => Object.keys(p.specs || p.specifications || {})))
  );

  return (
    <div id="comparison-matrix-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Interactive Comparison Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
            Side-by-Side Product Comparison
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Compare specifications, testing scores, pros, cons, and Amazon pricing side-by-side to make the right call.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {comparedProducts.length < 4 && (
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product ({comparedProducts.length}/4)</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      {comparedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <SlidersHorizontal className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-800">No products selected for comparison</h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
            Add 2 to 4 products from our catalog or buying guides to view their complete laboratory spec breakdown.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              {/* Product Header Cards Row */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60">
                  <th className="p-4 sm:p-6 w-1/5 text-xs font-bold uppercase tracking-wider text-slate-400 align-top">
                    Product Overview
                  </th>
                  {comparedProducts.map((p) => (
                    <th key={p.id} className="p-4 sm:p-6 w-1/4 align-top">
                      <div className="space-y-3 relative">
                        {/* Remove button */}
                        <button
                          onClick={() => handleRemove(p.id)}
                          className="absolute -top-2 -right-2 p-1.5 bg-slate-200/80 hover:bg-rose-100 hover:text-rose-600 text-slate-600 rounded-full transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-slate-200 bg-white"
                        />

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                            {p.brand}
                          </span>
                          <h3
                            onClick={() => onNavigate('product-detail', { slug: p.slug })}
                            className="font-bold text-slate-900 text-sm leading-snug hover:text-emerald-700 cursor-pointer transition-colors line-clamp-2"
                          >
                            {p.name}
                          </h3>
                        </div>

                        {/* Editor Score */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
                          <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                          <span>Score: {p.editorScore?.toFixed(1)} / 10</span>
                        </div>

                        {/* Price & CTA Button */}
                        <div className="space-y-2 pt-1">
                          <div className="text-base font-extrabold text-slate-900">
                            {formatProductPrice(p.price, p.currency)}
                            <span className="text-xs text-slate-400 font-normal ml-1">*</span>
                          </div>

                          <a
                            href={buildAmazonAffiliateUrl(p)}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            onClick={() => handleAffiliateClick(p)}
                            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer text-center"
                          >
                            <span>Check on Amazon</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {/* Pros Row */}
                <tr className="bg-slate-50/30">
                  <td className="p-4 font-bold text-slate-700">Top Advantages</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 align-top">
                      <ul className="space-y-1.5">
                        {p.pros.slice(0, 3).map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Cons Row */}
                <tr>
                  <td className="p-4 font-bold text-slate-700">Trade-offs & Cons</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 align-top">
                      <ul className="space-y-1.5">
                        {p.cons.slice(0, 2).map((con, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Hardware Spec Rows */}
                {allSpecKeys.map((key, idx) => (
                  <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50/40' : 'bg-white'}>
                    <td className="p-4 font-bold text-slate-700">{key}</td>
                    {comparedProducts.map((p) => {
                      const specMap = p.specs || p.specifications || {};
                      return (
                        <td key={p.id} className="p-4 font-mono-code text-xs text-slate-800">
                          {specMap[key] || '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Add Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add Product to Comparison</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2">
              {allProducts
                .filter((p) => !comparedProducts.some((cp) => cp.id === p.id))
                .map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleAdd(p.id)}
                    className="p-3 rounded-xl hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{p.name}</p>
                        <p className="text-[10px] text-slate-500">{p.brand} • {p.categoryName}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                      Add
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
