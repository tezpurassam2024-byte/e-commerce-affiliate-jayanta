/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AmazonDisclosureBanner } from './components/AmazonDisclosureBanner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { ComparisonTray } from './components/ComparisonTray';
import { SearchModal } from './components/SearchModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { BuyingGuidesPage } from './pages/BuyingGuidesPage';
import { GuideDetailPage } from './pages/GuideDetailPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { ProductFinderPage } from './pages/ProductFinderPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AffiliateDisclosurePage } from './pages/AffiliateDisclosurePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { AdminPage } from './pages/AdminPage';

import { StorageService } from './lib/storage';
import { trackPageView, initGA } from './lib/analytics';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<Record<string, any>>({});
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    // Initialize analytics if consent granted
    initGA();
  }, []);

  const handleNavigate = (page: string, params: Record<string, any> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track virtual page view in GA4
    const pageUrl = `/${page}${params.slug ? `/${params.slug}` : ''}`;
    trackPageView(pageUrl);
  };

  // Keyboard shortcut for search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onOpenSearch={() => setSearchOpen(true)} />;
      case 'products':
        return <ProductsPage onNavigate={handleNavigate} initialCategory={pageParams.category} />;
      case 'product-detail':
        return <ProductDetailPage slug={pageParams.slug || ''} onNavigate={handleNavigate} />;
      case 'categories':
        return <CategoriesPage onNavigate={handleNavigate} />;
      case 'category-detail':
        return <CategoryDetailPage slug={pageParams.slug || ''} onNavigate={handleNavigate} />;
      case 'compare':
        return <ComparisonPage onNavigate={handleNavigate} />;
      case 'guides':
        return <BuyingGuidesPage onNavigate={handleNavigate} />;
      case 'guide-detail':
        return <GuideDetailPage slug={pageParams.slug || ''} onNavigate={handleNavigate} />;
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} />;
      case 'blog-detail':
        return <BlogDetailPage slug={pageParams.slug || ''} onNavigate={handleNavigate} />;
      case 'recommend':
        return <ProductFinderPage onNavigate={handleNavigate} />;
      case 'search':
        return <SearchResultsPage initialQuery={pageParams.q || ''} onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage />;
      case 'affiliate-disclosure':
        return <AffiliateDisclosurePage onNavigate={handleNavigate} />;
      case 'privacy-policy':
      case 'cookie-policy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPage />;
      case 'disclaimer':
        return <DisclaimerPage />;
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} onOpenSearch={() => setSearchOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Top Amazon Associates Disclosure Banner */}
      <AmazonDisclosureBanner onNavigate={handleNavigate} />

      {/* 2. Global Site Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* 3. Main Dynamic Content View */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* 4. Global Site Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* 5. Interactive Global Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* 6. Floating Comparison Dock / Tray */}
      {currentPage !== 'compare' && (
        <ComparisonTray onNavigate={handleNavigate} />
      )}

      {/* 7. GDPR Cookie Consent Banner */}
      <CookieBanner onNavigate={handleNavigate} />
    </div>
  );
}
