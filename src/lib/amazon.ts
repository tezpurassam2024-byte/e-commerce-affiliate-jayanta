import { StorageService } from './storage';
import { Product } from '../types';

/**
 * Builds compliant Amazon affiliate links with proper tag attachment.
 */
export function buildAmazonAffiliateUrl(product: Partial<Product>, customTag?: string): string {
  const settings = StorageService.getSettings();
  const tag = customTag || settings.amazonAssociateTag || 'smartpick-20';
  const marketplace = settings.amazonMarketplace || 'amazon.com';

  // If explicit affiliateUrl is already configured by admin/author, return it directly
  if (product.affiliateUrl && product.affiliateUrl.trim() !== '') {
    const rawUrl = product.affiliateUrl.trim();
    // For custom short links (e.g. link.amazon, amzn.to, a.co), return immediately without altering
    if (
      rawUrl.includes('link.amazon') ||
      rawUrl.includes('amzn.to') ||
      rawUrl.includes('a.co') ||
      rawUrl.startsWith('https://link.amazon') ||
      rawUrl.startsWith('http://link.amazon')
    ) {
      return rawUrl;
    }
    try {
      const url = new URL(rawUrl);
      if (!url.searchParams.has('tag') && tag && url.hostname.includes('amazon')) {
        url.searchParams.set('tag', tag);
      }
      return url.toString();
    } catch {
      return rawUrl;
    }
  }

  // If ASIN is provided, build direct ASIN referral URL
  if (product.asin && product.asin.trim() !== '') {
    const cleanAsin = product.asin.trim();
    if (cleanAsin.startsWith('http://') || cleanAsin.startsWith('https://')) {
      return cleanAsin;
    }
    return `https://www.${marketplace}/dp/${cleanAsin}?tag=${encodeURIComponent(tag)}&linkCode=ll1`;
  }

  // If amazonUrl is provided, ensure tag is attached
  if (product.amazonUrl && product.amazonUrl.trim() !== '') {
    const rawAmazonUrl = product.amazonUrl.trim();
    if (
      rawAmazonUrl.includes('link.amazon') ||
      rawAmazonUrl.includes('amzn.to') ||
      rawAmazonUrl.includes('a.co')
    ) {
      return rawAmazonUrl;
    }
    try {
      const url = new URL(rawAmazonUrl);
      if (!url.searchParams.has('tag') && tag && url.hostname.includes('amazon')) {
        url.searchParams.set('tag', tag);
      }
      return url.toString();
    } catch {
      return rawAmazonUrl;
    }
  }

  // Fallback search link by product name
  if (product.name) {
    return `https://www.${marketplace}/s?k=${encodeURIComponent(product.name)}&tag=${encodeURIComponent(tag)}`;
  }

  return `https://www.${marketplace}/?tag=${encodeURIComponent(tag)}`;
}

/**
 * Validates Amazon ASIN format (10 alphanumeric characters).
 */
export function isValidAsin(asin: string): boolean {
  if (!asin) return false;
  return /^[A-Z0-9]{10}$/i.test(asin.trim());
}

/**
 * Extract ASIN from an Amazon URL if possible.
 */
export function extractAsinFromUrl(urlStr: string): string | null {
  if (!urlStr) return null;
  try {
    const match = urlStr.match(/(?:\/dp\/|\/gp\/product\/|\/ASIN\/)([A-Z0-9]{10})/i);
    return match ? match[1].toUpperCase() : null;
  } catch {
    return null;
  }
}

/**
 * Price disclaimer helper complying with Amazon Operating Agreement
 */
export function getPriceDisclaimer(lastUpdated?: string): string {
  const dateStr = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'publication date';
  return `Product prices and availability are accurate as of ${dateStr} and are subject to change. Any price and availability information displayed on Amazon at the time of purchase will apply to the purchase of this product.`;
}

/**
 * Standard Amazon Associates Disclosure Text
 */
export const AMAZON_STANDARD_DISCLOSURE =
  'As an Amazon Associate I earn from qualifying purchases.';

export const AMAZON_COMPREHENSIVE_DISCLOSURE =
  'SmartPick Guide is an independent product review and recommendation publication. When you click our affiliate links and make a purchase on Amazon, we may earn an affiliate commission at no additional cost to you. Product prices, ratings, and availability are accurate as of the date indicated and are subject to change. Check Amazon for real-time pricing.';

/**
 * Formats price with appropriate currency symbol (INR ₹, USD $, EUR €, GBP £)
 */
export function formatProductPrice(price?: number, currency?: string): string {
  if (price === undefined || price === null || isNaN(price)) {
    return 'Check Amazon';
  }
  const curr = (currency || 'USD').toUpperCase();
  if (curr === 'INR' || curr === '₹' || curr === 'RS' || curr === 'RUPEES') {
    return `₹${price.toLocaleString('en-IN')}`;
  }
  if (curr === 'EUR' || curr === '€') {
    return `€${price.toFixed(2)}`;
  }
  if (curr === 'GBP' || curr === '£') {
    return `£${price.toFixed(2)}`;
  }
  return `$${price.toFixed(2)}`;
}

