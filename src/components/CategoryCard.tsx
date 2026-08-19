import React from 'react';
import {
  Headphones,
  Armchair,
  Laptop,
  Video,
  Home,
  Watch,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  productCount?: number;
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

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  productCount,
  onNavigate,
}) => {
  const IconComponent = iconMap[category.iconName] || Layers;

  return (
    <div
      id={`category-card-${category.slug}`}
      onClick={() => onNavigate('category-detail', { slug: category.slug })}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/50 p-5 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center justify-center shadow-xs">
            <IconComponent className="w-6 h-6" />
          </div>
          {typeof productCount === 'number' && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
              {productCount} {productCount === 1 ? 'Pick' : 'Picks'}
            </span>
          )}
        </div>

        <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors mb-1.5">
          {category.name}
        </h3>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
          {category.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
        <span>Explore Category</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
