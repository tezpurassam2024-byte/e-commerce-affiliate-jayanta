import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  SlidersHorizontal,
  BookOpen,
  Layers,
  Sparkles,
  Menu,
  X,
  ShieldAlert,
  ShoppingBag,
  ArrowRight,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import { StorageService } from '../lib/storage';
import { SiteSettings } from '../types';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());

  useEffect(() => {
    const updateHeaderState = () => {
      setComparisonCount(StorageService.getComparisonIds().length);
      setSettings(StorageService.getSettings());
    };

    updateHeaderState();
    window.addEventListener('smartpick_comparison_change', updateHeaderState);
    window.addEventListener('smartpick_data_change', updateHeaderState);

    return () => {
      window.removeEventListener('smartpick_comparison_change', updateHeaderState);
      window.removeEventListener('smartpick_data_change', updateHeaderState);
    };
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'categories', label: 'Categories' },
    { id: 'guides', label: 'Buying Guides' },
    { id: 'compare', label: 'Compare' },
    { id: 'recommend', label: 'Product Finder' },
    { id: 'blog', label: 'Blog' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              id="brand-logo-button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1">
                  {settings.siteName.split(' ')[0]}
                  <span className="text-emerald-600 font-serif-editorial italic font-normal">
                    {settings.siteName.split(' ').slice(1).join(' ') || 'Guide'}
                  </span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block -mt-1">
                  Independent Reviews
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id || (link.id === 'products' && currentPage.startsWith('product-detail'));
                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={() => onNavigate(link.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-emerald-700 bg-emerald-50 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                    {link.id === 'compare' && comparisonCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full">
                        {comparisonCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              id="global-search-trigger"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs sm:text-sm font-medium rounded-xl transition-all border border-slate-200/60"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Search reviews...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white text-slate-500 rounded border border-slate-300 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Product Finder Highlight Button */}
            <button
              id="header-recommend-cta"
              onClick={() => onNavigate('recommend')}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm shadow-emerald-600/20"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Smart Finder</span>
            </button>

            {/* Admin Switch Link */}
            <button
              id="admin-nav-button"
              onClick={() => onNavigate('admin')}
              title="Admin Portal"
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <BarChart2 className="w-5 h-5" />
            </button>

            {/* Mobile menu hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-menu" className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.id === 'compare' && comparisonCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full">
                      {comparisonCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('recommend');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              Launch Product Finder
            </button>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 px-1">
              <button
                onClick={() => {
                  onNavigate('about');
                  setMobileMenuOpen(false);
                }}
                className="hover:underline"
              >
                About Editorial Team
              </button>
              <button
                onClick={() => {
                  onNavigate('affiliate-disclosure');
                  setMobileMenuOpen(false);
                }}
                className="hover:underline text-emerald-600"
              >
                Affiliate Disclosure
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
