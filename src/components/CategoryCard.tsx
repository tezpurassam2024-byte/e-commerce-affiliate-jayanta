import React from 'react';
import {
  Headphones,
  Armchair,
  Laptop,
  Video,
  Home,
  Watch,
  Layers,
  ChevronRight,
  Smartphone,
  Tablet,
  Camera,
  Tv,
  Speaker,
  Gamepad,
  Monitor,
  Wifi,
  Coffee,
  Briefcase,
  Cpu,
  Zap,
  Sparkles,
  Package,
  Folder,
  Grid,
  Tag,
  ShoppingBag
} from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  productCount?: number;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  dark?: boolean;
}

export const iconMap: Record<string, React.ElementType> = {
  Headphones,
  Armchair,
  Laptop,
  Video,
  Home,
  Watch,
  Layers,
  Smartphone,
  Phone: Smartphone,
  Tablet,
  Camera,
  Tv,
  Speaker,
  Gamepad,
  Monitor,
  Wifi,
  Coffee,
  Briefcase,
  Cpu,
  Zap,
  Sparkles,
  Package,
  Folder,
  Grid,
  Tag,
  ShoppingBag,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  productCount,
  onNavigate,
  dark = false,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const IconComponent = iconMap[category.iconName] || Layers;

  const getResolvedImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('/src/assets/')) {
      return url.replace('/src/assets/', '/assets/');
    }
    return url;
  };

  const imageSrc = getResolvedImageUrl(category.imageUrl);

  return (
    <div
      id={`category-card-${category.slug}`}
      onClick={() => onNavigate('category-detail', { slug: category.slug })}
      className={`group rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
        dark
          ? 'bg-zinc-900/90 border border-zinc-800 hover:border-blue-500/60 shadow-lg hover:shadow-blue-950/40 text-white'
          : 'bg-white border border-slate-200/80 hover:border-emerald-500/50 shadow-xs hover:shadow-md'
      }`}
    >
      <div>
        {imageSrc && !imgError ? (
          <div className={`relative aspect-16/9 w-full overflow-hidden border-b ${dark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-100 border-slate-100'}`}>
            <img
              src={imageSrc}
              alt={category.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedSrc && category.imageUrl && category.imageUrl !== imageSrc) {
                  target.dataset.triedSrc = 'true';
                  target.src = category.imageUrl;
                } else {
                  setImgError(true);
                }
              }}
            />
            <div className={`absolute inset-0 ${dark ? 'bg-gradient-to-t from-black/90 via-black/30 to-transparent' : 'bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent'}`} />
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-xs ${dark ? 'bg-blue-950/90 text-blue-400 border border-blue-500/40 backdrop-blur-md' : 'bg-white/95 backdrop-blur-xs text-emerald-800'}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-white tracking-tight drop-shadow-sm line-clamp-1">
                  {category.name}
                </span>
              </div>
              {typeof productCount === 'number' && (
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs shrink-0 ${dark ? 'bg-blue-600/90 text-white backdrop-blur-md' : 'bg-white/95 backdrop-blur-xs text-slate-900'}`}>
                  {productCount} {productCount === 1 ? 'Pick' : 'Picks'}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-5 pb-0 flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl transition-all flex items-center justify-center shadow-xs ${
              dark
                ? 'bg-blue-950/80 text-blue-400 border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white'
                : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white'
            }`}>
              <IconComponent className="w-6 h-6" />
            </div>
            {typeof productCount === 'number' && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                dark ? 'bg-zinc-800 text-slate-300 border border-zinc-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {productCount} {productCount === 1 ? 'Pick' : 'Picks'}
              </span>
            )}
          </div>
        )}

        <div className="p-5 pb-2">
          {!category.imageUrl && (
            <h3 className={`font-bold text-lg transition-colors mb-1.5 ${
              dark ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-emerald-700'
            }`}>
              {category.name}
            </h3>
          )}

          <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${
            dark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {category.description}
          </p>
        </div>
      </div>

      <div className="px-5 pb-4 pt-2">
        <div className={`pt-3 border-t flex items-center justify-between text-xs font-bold transition-colors ${
          dark
            ? 'border-zinc-800 text-blue-400 group-hover:text-blue-300'
            : 'border-slate-100 text-emerald-700 group-hover:text-emerald-800'
        }`}>
          <span>Explore Category</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
