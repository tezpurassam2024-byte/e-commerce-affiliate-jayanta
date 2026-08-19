import React, { useState, useEffect } from 'react';
import { StorageService } from '../lib/storage';
import { Category, Product } from '../types';
import { CategoryCard } from '../components/CategoryCard';

interface CategoriesPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setCategories(StorageService.getCategories());
    setProducts(StorageService.getProducts());
  }, []);

  return (
    <div id="categories-overview-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Hardware & Gear Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
          All Product Categories
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Browse testing labs organized by category. Every product is evaluated against rigorous benchmark standards.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <CategoryCard
              key={cat.id}
              category={cat}
              productCount={count}
              onNavigate={onNavigate}
            />
          );
        })}
      </div>
    </div>
  );
};
