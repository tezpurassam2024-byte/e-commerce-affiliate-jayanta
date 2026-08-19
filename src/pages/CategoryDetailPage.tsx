import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  SlidersHorizontal,
  BookOpen,
  ArrowLeft,
  Headphones,
  Armchair,
  Laptop,
  Video,
  Home,
  Watch,
  Layers,
  Sparkles
} from 'lucide-react';
import { StorageService } from '../lib/storage';
import { Category, Product, BuyingGuide } from '../types';
import { ProductCard } from '../components/ProductCard';
import { BuyingGuideCard } from '../components/BuyingGuideCard';

interface CategoryDetailPageProps {
  slug: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Headphones,
  Armchair,
  Laptop,
  Video,
  Home,
  Watch,
  Layers,
};

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [categoryGuides, setCategoryGuides] = useState<BuyingGuide[]>([]);

  useEffect(() => {
    // Find category by slug or id
    const allCats = StorageService.getCategories();
    const found = allCats.find((c) => c.slug === slug || c.id === slug);
    if (found) {
      setCategory(found);
      const allProducts = StorageService.getProducts();
      setCategoryProducts(allProducts.filter((p) => p.categoryId === found.id && p.published));

      const allGuides = StorageService.getBuyingGuides();
      setCategoryGuides(allGuides.filter((g) => g.categoryId === found.id));
    }
  }, [slug]);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Category Not Found</h2>
        <button
          onClick={() => onNavigate('categories')}
          className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  const IconComponent = iconMap[category.iconName] || Layers;

  return (
    <div id={`category-detail-${category.slug}`} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-slate-900 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('categories')} className="hover:text-slate-900 transition-colors">
          Categories
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-slate-800">{category.name}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
            <IconComponent className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Lab Category Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif-editorial">
              {category.name}
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl pt-1 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('products', { category: category.id })}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Filter In Catalog
          </button>
        </div>
      </div>

      {/* Recommended Products in Category */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif-editorial">
              Tested Picks in {category.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {categoryProducts.length} verified product review{categoryProducts.length === 1 ? '' : 's'} available
            </p>
          </div>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            No products currently published in this category. Check back soon for new lab evaluations.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
                placement="category_detail_grid"
              />
            ))}
          </div>
        )}
      </section>

      {/* Category Buying Guides */}
      {categoryGuides.length > 0 && (
        <section className="space-y-6 pt-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif-editorial">
              Buying Guides & Test Reports
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Detailed buying frameworks specifically tailored for {category.name}.
            </p>
          </div>

          <div className="space-y-4">
            {categoryGuides.map((guide) => (
              <BuyingGuideCard
                key={guide.id}
                guide={guide}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
