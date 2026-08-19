import { StorageService } from './storage';
import { Product } from '../types';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Initializes Google Analytics 4 if Measurement ID is provided and cookie consent is granted.
 */
export function initGA(): void {
  if (typeof window === 'undefined') return;

  const consent = StorageService.getCookieConsent();
  if (consent === 'rejected') return;

  const settings = StorageService.getSettings();
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || settings.gaMeasurementId;

  if (!measurementId || measurementId.startsWith('G-XXXX')) {
    return;
  }

  // Load gtag script if not loaded
  if (!document.getElementById('ga-script')) {
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false });
  }
}

/**
 * Track Page Views in GA4
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    const settings = StorageService.getSettings();
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || settings.gaMeasurementId;
    if (measurementId && !measurementId.startsWith('G-XXXX')) {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle || document.title,
      });
    }
  }
}

/**
 * Track Affiliate CTA Clicks (Both Internal Click Tracker and GA4)
 */
export function trackAffiliateClick(
  product: Product,
  placement: string = 'cta_button',
  pagePath?: string
): void {
  const currentPath = pagePath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const settings = StorageService.getSettings();

  // 1. Internal Storage & Server Tracking
  StorageService.recordAffiliateClick({
    productId: product.id,
    productName: product.name,
    placement,
    pagePath: currentPath,
    asin: product.asin,
    marketplace: settings.amazonMarketplace || 'amazon.com',
  });

  // 2. Google Analytics 4 Event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'affiliate_click', {
      product_id: product.id,
      product_name: product.name,
      category: product.categoryName,
      brand: product.brand,
      placement: placement,
      asin: product.asin || 'N/A',
      destination: 'amazon',
    });
  }
}

/**
 * Track On-Site Search Event
 */
export function trackSearch(query: string, resultCount: number): void {
  if (typeof window !== 'undefined' && window.gtag && query) {
    window.gtag('event', 'search', {
      search_term: query,
      result_count: resultCount,
    });
  }
}
