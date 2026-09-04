import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Category, BuyingGuide, BlogPost, SiteSettings, AffiliateClickEvent } from '../types';
import { initialProducts, initialCategories, initialBuyingGuides, initialBlogPosts, initialSiteSettings } from '../data/initialData';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const STORAGE_KEYS = {
  PRODUCTS: 'smartpick_products_v1',
  CATEGORIES: 'smartpick_categories_v1',
  GUIDES: 'smartpick_guides_v1',
  POSTS: 'smartpick_posts_v1',
  SETTINGS: 'smartpick_settings_v1',
  CLICKS: 'smartpick_affiliate_clicks_v1',
  COMPARISON: 'smartpick_comparison_items_v1',
  SUBSCRIBERS: 'smartpick_subscribers_v1',
  COOKIE_CONSENT: 'smartpick_cookie_consent_v1',
  ADMIN_AUTH: 'smartpick_admin_session_v1',
};

// Helper to ensure all local asset URLs point to valid public static paths
export function normalizeAssetUrl(url?: string): string | undefined {
  if (!url) return url;
  if (url.startsWith('/src/assets/')) {
    return url.replace('/src/assets/', '/assets/');
  }
  return url;
}

// Initialize Local Storage with smart merging
function initializeLocalStorage() {
  if (typeof window === 'undefined') return;

  // Categories
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
  } else {
    try {
      const existing: Category[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
      const updated = existing.map((cat) => {
        const init = initialCategories.find((ic) => ic.id === cat.id);
        const merged = init ? { ...cat, ...init } : cat;
        return {
          ...merged,
          imageUrl: normalizeAssetUrl(merged.imageUrl) || init?.imageUrl,
        };
      });
      const missing = initialCategories.filter((ic) => !updated.some((e) => e.id === ic.id));
      const combined = [...updated, ...missing];
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(combined));
    } catch {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
    }
  }

  // Products
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  } else {
    try {
      const existing: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      
      const isRedmi14Pro = (p: Product) =>
        p.id === 'prod-redmi-14-pro-5g' ||
        p.asin === 'B09H1ZZHl' ||
        (p.name && /redm.*14.*pro/i.test(p.name)) ||
        (p.slug && /redm.*14.*pro/i.test(p.slug));

      const nonRedmiExisting = existing
        .filter(
          (p) => !isRedmi14Pro(p) && p.id !== 'prod-iphone-16-pro-max' && p.slug !== 'apple-iphone-16-pro-max'
        )
        .map((p) => {
          if (
            p.id === 'prod-apple-macbook-air-m2' ||
            p.asin === 'B0B3C58K6T' ||
            (p.name && /macbook.*air.*m2/i.test(p.name))
          ) {
            return {
              ...p,
              id: 'prod-apple-macbook-air-m5-2026',
              slug: '2026-macbook-air-13-inch-m5-laptop',
            };
          }
          if (
            p.id === 'prod-apple-macbook-air-m1' ||
            p.asin === 'B08N5W4449' ||
            (p.name && /macbook.*air.*m1/i.test(p.name))
          ) {
            return {
              ...p,
              id: 'prod-apple-macbook-air-m5-24gb-midnight',
              slug: '2026-macbook-air-13-inch-m5-24gb-midnight-laptop',
            };
          }
          if (
            p.id === 'prod-hp-15s-ryzen5-5500u' ||
            p.asin === 'B09FHY48MV' ||
            (p.name && /5500u/i.test(p.name))
          ) {
            return {
              ...p,
              id: 'prod-hp-15-ryzen7-7730u-fc0761au',
              slug: 'hp-15-laptop-amd-ryzen-7-7730u-16gb-512gb-fc0761au',
            };
          }
          return p;
        });
      
      const seenIds = new Set<string>();
      const seenSlugs = new Set<string>();
      const deduplicatedExisting: Product[] = [];
      for (const p of nonRedmiExisting) {
        if (!seenIds.has(p.id) && !seenSlugs.has(p.slug)) {
          seenIds.add(p.id);
          seenSlugs.add(p.slug);
          deduplicatedExisting.push(p);
        }
      }

      const updated = deduplicatedExisting.map((p) => {
        const init = initialProducts.find((ip) => ip.id === p.id);
        let merged = init ? { ...p, ...init } : p;
        if (merged.id === 'prod-realme-p4-power-5g' || (merged.name && /realme.*p4/i.test(merged.name)) || merged.asin === 'B0iDBeXE4') {
          merged = {
            ...merged,
            affiliateUrl: 'https://link.amazon/B0iDBeXE4',
            amazonUrl: 'https://link.amazon/B0iDBeXE4',
            asin: 'B0iDBeXE4',
          };
        }
        if (merged.id === 'prod-redmi-note-15-pro-5g' || (merged.name && /redm.*15.*pro/i.test(merged.name)) || merged.asin === 'B0j64c6va') {
          merged = {
            ...merged,
            affiliateUrl: 'https://link.amazon/B0j64c6va',
            amazonUrl: 'https://link.amazon/B0j64c6va',
            asin: 'B0j64c6va',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyBQIDyFThnuExayMPSJlxJEcmp0NC7yR6Fx9SvBpBUg&s=10',
            galleryImages: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyBQIDyFThnuExayMPSJlxJEcmp0NC7yR6Fx9SvBpBUg&s=10']
          };
        }
        if (
          merged.id === 'prod-apple-macbook-air-m3' ||
          (merged.name && /macbook.*air.*m3/i.test(merged.name)) ||
          merged.asin === 'B0CX21C78Q' ||
          merged.asin === 'B08aY1VxN'
        ) {
          merged = {
            ...merged,
            affiliateUrl: 'https://link.amazon/B08aY1VxN',
            amazonUrl: 'https://link.amazon/B08aY1VxN',
            asin: 'B08aY1VxN',
          };
        }
        if (
          merged.id === 'prod-apple-macbook-air-m2' ||
          merged.id === 'prod-apple-macbook-air-m5-2026' ||
          (merged.name && /macbook.*air.*m2/i.test(merged.name)) ||
          (merged.name && /macbook.*air.*m5.*16gb/i.test(merged.name)) ||
          merged.asin === 'B0B3C58K6T' ||
          merged.asin === 'B0iSrg0fF'
        ) {
          const m5Init = initialProducts.find((ip) => ip.id === 'prod-apple-macbook-air-m5-2026');
          merged = m5Init
            ? { ...merged, ...m5Init }
            : {
                ...merged,
                id: 'prod-apple-macbook-air-m5-2026',
                slug: '2026-macbook-air-13-inch-m5-laptop',
                name: '2026 MacBook Air 13″ Laptop with M5 chip: AI and Apple Intelligence, 34.46 cm (13.6″) Liquid Retina Display, 16GB Unified Memory, 1TB SSD Storage, 12MP Center Stage Camera, Touch ID; Silver',
                asin: 'B0iSrg0fF',
                amazonUrl: 'https://link.amazon/B0iSrg0fF',
                affiliateUrl: 'https://link.amazon/B0iSrg0fF',
              };
        }
        if (
          merged.id === 'prod-apple-macbook-air-m1' ||
          merged.id === 'prod-apple-macbook-air-m5-24gb-midnight' ||
          (merged.name && /macbook.*air.*m1/i.test(merged.name)) ||
          (merged.name && /macbook.*air.*m5.*24gb/i.test(merged.name)) ||
          (merged.name && /macbook.*air.*m5.*midnight/i.test(merged.name)) ||
          merged.asin === 'B08N5W4449' ||
          merged.asin === 'B0fYaaDSx'
        ) {
          const m5MidnightInit = initialProducts.find((ip) => ip.id === 'prod-apple-macbook-air-m5-24gb-midnight');
          merged = m5MidnightInit
            ? { ...merged, ...m5MidnightInit }
            : {
                ...merged,
                id: 'prod-apple-macbook-air-m5-24gb-midnight',
                slug: '2026-macbook-air-13-inch-m5-24gb-midnight-laptop',
                name: '2026 MacBook Air 13″ Laptop with M5 chip: AI and Apple Intelligence, 34.46 cm (13.6″) Liquid Retina Display, 24GB Unified Memory, 1TB SSD Storage, 12MP Center Stage Camera, Touch ID; Midnight',
                asin: 'B0fYaaDSx',
                amazonUrl: 'https://link.amazon/B0fYaaDSx',
                affiliateUrl: 'https://link.amazon/B0fYaaDSx',
              };
        }
        if (
          merged.id === 'prod-hp-15s-i5-12gen' ||
          (merged.name && /hp.*15s.*i5/i.test(merged.name)) ||
          merged.asin === 'B0B8K371FL' ||
          merged.asin === 'B0c8hDAk0'
        ) {
          merged = {
            ...merged,
            asin: 'B0c8hDAk0',
            amazonUrl: 'https://link.amazon/B0c8hDAk0',
            affiliateUrl: 'https://link.amazon/B0c8hDAk0',
          };
        }
        if (
          merged.id === 'prod-hp-15-ryzen7-7730u-fc0761au' ||
          (merged.name && /7730u/i.test(merged.name)) ||
          merged.asin === 'B09FHY48MV' ||
          merged.asin === 'B05aGOlX4'
        ) {
          merged = {
            ...merged,
            asin: 'B05aGOlX4',
            amazonUrl: 'https://link.amazon/B05aGOlX4',
            affiliateUrl: 'https://link.amazon/B05aGOlX4',
          };
        }
        // Ensure laptop serialized names (No 1, No 2, etc.) are applied from initialProducts
        if (init && init.categoryId === 'cat-computers' && init.name.startsWith('No ')) {
          merged.name = init.name;
        }
        return {
          ...merged,
          imageUrl: normalizeAssetUrl(merged.imageUrl) || merged.imageUrl,
          galleryImages: merged.galleryImages?.map((g) => normalizeAssetUrl(g) || g),
        };
      });
      const missing = initialProducts.filter((ip) => !updated.some((e) => e.id === ip.id));
      const combined = [...missing, ...updated];
      
      const finalUnique: Product[] = [];
      const finalIds = new Set<string>();
      for (const p of combined) {
        if (!finalIds.has(p.id)) {
          finalIds.add(p.id);
          finalUnique.push(p);
        }
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(finalUnique));
    } catch {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    }
  }

  // Guides
  if (!localStorage.getItem(STORAGE_KEYS.GUIDES)) {
    localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(initialBuyingGuides));
  } else {
    try {
      const existing: BuyingGuide[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.GUIDES) || '[]');
      const updated = existing.map((g) => {
        const init = initialBuyingGuides.find((ig) => ig.id === g.id);
        const base = init ? { ...g, ...init } : g;
        return {
          ...base,
          recommendedProductIds: base.recommendedProductIds.map((pid) =>
            pid === 'prod-apple-macbook-air-m1' ? 'prod-apple-macbook-air-m5-24gb-midnight' : pid
          ),
          featuredProductIds: base.featuredProductIds.map((pid) =>
            pid === 'prod-apple-macbook-air-m1' ? 'prod-apple-macbook-air-m5-24gb-midnight' : pid
          ),
          topPickProductId:
            base.topPickProductId === 'prod-apple-macbook-air-m1'
              ? 'prod-apple-macbook-air-m5-24gb-midnight'
              : base.topPickProductId,
        };
      });
      const missing = initialBuyingGuides.filter((ig) => !updated.some((e) => e.id === ig.id));
      const combined = [...missing, ...updated];
      const deduplicatedGuides = combined.map((g) => ({
        ...g,
        recommendedProductIds: Array.from(new Set(g.recommendedProductIds)),
        featuredProductIds: Array.from(new Set(g.featuredProductIds)),
      }));
      localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(deduplicatedGuides));
    } catch {
      localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(initialBuyingGuides));
    }
  }

  // Posts
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(initialBlogPosts));
  } else {
    try {
      const existing: BlogPost[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      
      const isRedmiPost = (post: BlogPost) =>
        post.id === 'post-redmi-14-pro-5g-review' ||
        (post.slug && /redm.*14.*pro/i.test(post.slug)) ||
        (post.title && /redm.*14.*pro/i.test(post.title));

      const nonRedmiExistingPosts = existing.filter(
        (p) => !isRedmiPost(p) && p.id !== 'post-iphone-16-pro-max-review' && p.slug !== 'iphone-16-pro-max-3-months-later-camera-battery-verdict'
      );

      const seenPostIds = new Set<string>();
      const seenPostSlugs = new Set<string>();
      const deduplicatedPosts: BlogPost[] = [];
      for (const post of nonRedmiExistingPosts) {
        if (!seenPostIds.has(post.id) && !seenPostSlugs.has(post.slug)) {
          seenPostIds.add(post.id);
          seenPostSlugs.add(post.slug);
          deduplicatedPosts.push(post);
        }
      }

      const updatedPosts = deduplicatedPosts.map((post) => {
        const init = initialBlogPosts.find((ip) => ip.id === post.id);
        let merged = init ? { ...post, ...init } : post;
        if (merged.id === 'post-realme-p4-power-5g-review' || (merged.title && /realme.*p4/i.test(merged.title))) {
          if (merged.productSpotlight) {
            merged.productSpotlight = {
              ...merged.productSpotlight,
              affiliateUrl: 'https://link.amazon/B0iDBeXE4',
              asin: 'B0iDBeXE4',
            };
          }
        }
        if (merged.id === 'post-redmi-note-15-pro-5g-review' || (merged.title && /redm.*15.*pro/i.test(merged.title))) {
          if (merged.productSpotlight) {
            merged.productSpotlight = {
              ...merged.productSpotlight,
              affiliateUrl: 'https://link.amazon/B0j64c6va',
              asin: 'B0j64c6va',
              productImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyBQIDyFThnuExayMPSJlxJEcmp0NC7yR6Fx9SvBpBUg&s=10',
            };
          }
        }
        return merged;
      });

      const missingPosts = initialBlogPosts.filter((ip) => !updatedPosts.some((e) => e.id === ip.id));
      const combinedPosts = [...missingPosts, ...updatedPosts];

      const finalPosts: BlogPost[] = [];
      const finalPostIds = new Set<string>();
      for (const p of combinedPosts) {
        if (!finalPostIds.has(p.id)) {
          finalPostIds.add(p.id);
          finalPosts.push(p);
        }
      }
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(finalPosts));
    } catch {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(initialBlogPosts));
    }
  }

  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSiteSettings));
  } else {
    try {
      const existingSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
      const updatedSettings = {
        ...initialSiteSettings,
        ...existingSettings,
        amazonMarketplace: existingSettings.amazonMarketplace === 'amazon.com' ? 'amazon.in' : (existingSettings.amazonMarketplace || 'amazon.in'),
        amazonAssociateTag: existingSettings.amazonAssociateTag || 'smartpickin-21',
      };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
    } catch {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSiteSettings));
    }
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLICKS)) {
    // Generate some initial realistic demo clicks for analytics dashboard
    const sampleClicks: AffiliateClickEvent[] = [
      {
        id: 'click-1',
        productId: 'prod-sony-wh1000xm5',
        productName: 'Sony WH-1000XM5 Wireless Headphones',
        placement: 'product_detail_hero',
        pagePath: '/product/sony-wh-1000xm5-wireless-headphones',
        asin: 'B09XS7JWHH',
        marketplace: 'amazon.com',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'click-2',
        productId: 'prod-herman-miller-aeron',
        productName: 'Herman Miller Aeron Ergonomic Task Chair',
        placement: 'buying_guide_top_pick',
        pagePath: '/guide/definitive-ergonomic-home-office-guide',
        asin: 'B01MCT3665',
        marketplace: 'amazon.com',
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
      {
        id: 'click-3',
        productId: 'prod-logitech-mx-master-3s',
        productName: 'Logitech MX Master 3S Wireless Performance Mouse',
        placement: 'comparison_table_cta',
        pagePath: '/compare',
        asin: 'B09HM94VDS',
        marketplace: 'amazon.com',
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
      {
        id: 'click-4',
        productId: 'prod-sony-wh1000xm5',
        productName: 'Sony WH-1000XM5 Wireless Headphones',
        placement: 'homepage_featured_grid',
        pagePath: '/',
        asin: 'B09XS7JWHH',
        marketplace: 'amazon.com',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'click-5',
        productId: 'prod-garmin-forerunner-965',
        productName: 'Garmin Forerunner 965 Premium GPS Smartwatch',
        placement: 'product_detail_hero',
        pagePath: '/product/garmin-forerunner-965-gps-running-smartwatch',
        asin: 'B0BSN3NWD7',
        marketplace: 'amazon.com',
        timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.CLICKS, JSON.stringify(sampleClicks));
  }
}

initializeLocalStorage();

// --- DATA ACCESS METHODS ---

export const StorageService = {
  // PRODUCTS
  getProducts(): Product[] {
    if (typeof window === 'undefined') return initialProducts;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : initialProducts;
    } catch {
      return initialProducts;
    }
  },

  getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    const cleanSlug = slug.toLowerCase().trim();
    return products.find(
      (p) =>
        p.slug === cleanSlug ||
        (p.id === 'prod-redmi-14-pro-5g' &&
          (cleanSlug === 'redmi-14-pro-5g-smartphone' ||
            cleanSlug === 'redme-14-pro-5g-smartphone' ||
            cleanSlug === 'redmi-note-14-pro-plus-5g-smartphone' ||
            cleanSlug === 'redmi-note-14-pro-5g')) ||
        (p.id === 'prod-realme-p4-power-5g' &&
          (cleanSlug === 'realme-p4-power-5g-smartphone' ||
            cleanSlug === 'realme-p4-power-5g' ||
            cleanSlug === 'realme-p4-power' ||
            cleanSlug === 'realme-p4-5g')) ||
        (p.id === 'prod-redmi-note-15-pro-5g' &&
          (cleanSlug === 'redmi-note-15-pro-5g-smartphone' ||
            cleanSlug === 'redmi-note-15-pro-5g' ||
            cleanSlug === 'redmi-15-pro-5g-smartphone' ||
            cleanSlug === 'redmi-15-pro-5g' ||
            cleanSlug === 'redmi-note-15-pro' ||
            cleanSlug === 'redmi-15-pro')) ||
        (p.id === 'prod-apple-macbook-air-m3' &&
          (cleanSlug === 'apple-macbook-air-m3-13-inch' ||
            cleanSlug === 'apple-macbook-air-m3' ||
            cleanSlug === 'macbook-air-m3' ||
            cleanSlug === 'apple-macbook-air-m3-13')) ||
        ((p.id === 'prod-apple-macbook-air-m5-2026' || p.id === 'prod-apple-macbook-air-m2') &&
          (cleanSlug === '2026-macbook-air-13-inch-m5-laptop' ||
            cleanSlug === '2026-macbook-air-13-laptop-with-m5-chip' ||
            cleanSlug === 'apple-macbook-air-m5-13-inch' ||
            cleanSlug === 'macbook-air-m5' ||
            cleanSlug === 'apple-macbook-air-m2-13-inch' ||
            cleanSlug === 'apple-macbook-air-m2')) ||
        ((p.id === 'prod-apple-macbook-air-m5-24gb-midnight' || p.id === 'prod-apple-macbook-air-m1') &&
          (cleanSlug === '2026-macbook-air-13-inch-m5-24gb-midnight-laptop' ||
            cleanSlug === '2026-macbook-air-13-inch-m5-midnight-laptop' ||
            cleanSlug === '2026-macbook-air-13-laptop-with-m5-chip-midnight' ||
            cleanSlug === 'apple-macbook-air-m5-24gb-midnight' ||
            cleanSlug === 'macbook-air-m5-midnight' ||
            cleanSlug === 'apple-macbook-air-m1-13-inch' ||
            cleanSlug === 'apple-macbook-air-m1' ||
            cleanSlug === 'macbook-air-m1')) ||
        (p.id === 'prod-hp-15s-i5-12gen' &&
          (cleanSlug === 'hp-15s-intel-core-i5-1235u-16gb-512gb' ||
            cleanSlug === 'hp-15s-i5-1235u' ||
            cleanSlug === 'hp-15s-12th-gen-i5' ||
            cleanSlug === 'hp-15s-i5'))
    );
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find(
      (p) =>
        p.id === id ||
        ((id === 'prod-apple-macbook-air-m2' || id === 'prod-apple-macbook-air-m5-2026') &&
          (p.id === 'prod-apple-macbook-air-m5-2026' || p.id === 'prod-apple-macbook-air-m2')) ||
        ((id === 'prod-apple-macbook-air-m1' || id === 'prod-apple-macbook-air-m5-24gb-midnight') &&
          (p.id === 'prod-apple-macbook-air-m5-24gb-midnight' || p.id === 'prod-apple-macbook-air-m1'))
    );
  },

  saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      products.unshift({
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('smartpick_data_change'));
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('smartpick_data_change'));
  },

  // CATEGORIES
  getCategories(): Category[] {
    if (typeof window === 'undefined') return initialCategories;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      const parsed: Category[] = data ? JSON.parse(data) : initialCategories;
      return parsed.map((cat) => {
        const init = initialCategories.find((ic) => ic.id === cat.id);
        return {
          ...cat,
          imageUrl: normalizeAssetUrl(cat.imageUrl) || init?.imageUrl,
        };
      });
    } catch {
      return initialCategories;
    }
  },

  getCategoryBySlug(slug: string): Category | undefined {
    const categories = this.getCategories();
    return categories.find((c) => c.slug === slug);
  },

  saveCategory(category: Category): void {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('smartpick_data_change'));
  },

  deleteCategory(id: string): void {
    const categories = this.getCategories().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('smartpick_data_change'));
  },

  // BUYING GUIDES
  getBuyingGuides(): BuyingGuide[] {
    if (typeof window === 'undefined') return initialBuyingGuides;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GUIDES);
      return data ? JSON.parse(data) : initialBuyingGuides;
    } catch {
      return initialBuyingGuides;
    }
  },

  getBuyingGuideBySlug(slug: string): BuyingGuide | undefined {
    const guides = this.getBuyingGuides();
    return guides.find((g) => g.slug === slug);
  },

  saveBuyingGuide(guide: BuyingGuide): void {
    const guides = this.getBuyingGuides();
    const index = guides.findIndex((g) => g.id === guide.id);
    if (index >= 0) {
      guides[index] = { ...guide, updatedAt: new Date().toISOString() };
    } else {
      guides.unshift({
        ...guide,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(guides));
    window.dispatchEvent(new Event('smartpick_data_change'));
  },

  deleteBuyingGuide(id: string): void {
    const guides = this.getBuyingGuides().filter((g) => g.id !== id);
    localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(guides));
    window.dispatchEvent(new Event('smartpick_data_change'));
  },

  // BLOG POSTS
  getBlogPosts(): BlogPost[] {
    if (typeof window === 'undefined') return initialBlogPosts;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POSTS);
      return data ? JSON.parse(data) : initialBlogPosts;
    } catch {
      return initialBlogPosts;
    }
  },

  getBlogPostBySlug(slug: string): BlogPost | undefined {
    const posts = this.getBlogPosts();
    const cleanSlug = slug.toLowerCase().trim();
    return posts.find(
      (p) =>
        p.slug === cleanSlug ||
        (p.id === 'post-redmi-14-pro-5g-review' &&
          (cleanSlug === 'redmi-14-pro-5g-full-review-camera-battery-verdict' ||
            cleanSlug === 'redmi-note-14-pro-plus-5g-review' ||
            cleanSlug === 'redmi-14-pro-5g-review')) ||
        (p.id === 'post-realme-p4-power-5g-review' &&
          (cleanSlug === 'realme-p4-power-5g-full-review-battery-camera-verdict' ||
            cleanSlug === 'realme-p4-power-5g-review' ||
            cleanSlug === 'realme-p4-power-review' ||
            cleanSlug === 'realme-p4-review')) ||
        (p.id === 'post-redmi-note-15-pro-5g-review' &&
          (cleanSlug === 'redmi-note-15-pro-5g-full-review-camera-battery-verdict' ||
            cleanSlug === 'redmi-note-15-pro-5g-review' ||
            cleanSlug === 'redmi-15-pro-5g-review' ||
            cleanSlug === 'redmi-15-pro-review' ||
            cleanSlug === 'redmi-note-15-pro-review'))
    );
  },

  saveBlogPost(post: BlogPost): void {
    const posts = this.getBlogPosts();
    const index = posts.findIndex((p) => p.id === post.id);
    if (index >= 0) {
      posts[index] = { ...post, updatedAt: new Date().toISOString() };
    } else {
      posts.unshift({
        ...post,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    window.dispatchEvent(new Event('smartpick_data_change'));
  },

  deleteBlogPost(id: string): void {
    const posts = this.getBlogPosts().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    window.dispatchEvent(new Event('smartpick_data_change'));
  },

  // SITE SETTINGS
  getSettings(): SiteSettings {
    if (typeof window === 'undefined') return initialSiteSettings;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : initialSiteSettings;
    } catch {
      return initialSiteSettings;
    }
  },

  saveSettings(settings: SiteSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new Event('smartpick_data_change'));
  },

  // AFFILIATE CLICKS
  getAffiliateClicks(): AffiliateClickEvent[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLICKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  recordAffiliateClick(event: Omit<AffiliateClickEvent, 'id' | 'timestamp'>): void {
    const clicks = this.getAffiliateClicks();
    const newEvent: AffiliateClickEvent = {
      ...event,
      id: 'click-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
    };
    clicks.unshift(newEvent);
    // Keep max 500 records in local storage
    if (clicks.length > 500) clicks.pop();
    localStorage.setItem(STORAGE_KEYS.CLICKS, JSON.stringify(clicks));
    window.dispatchEvent(new Event('smartpick_data_change'));

    // Also attempt server-side record
    try {
      fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      }).catch(() => {});
    } catch {
      // safe fallback
    }
  },

  // COMPARISON TRAY
  getComparisonIds(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPARISON);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleComparison(productId: string): string[] {
    let ids = this.getComparisonIds();
    if (ids.includes(productId)) {
      ids = ids.filter((id) => id !== productId);
    } else {
      if (ids.length >= 4) {
        // Max 4 items allowed in comparison
        ids.shift();
      }
      ids.push(productId);
    }
    localStorage.setItem(STORAGE_KEYS.COMPARISON, JSON.stringify(ids));
    window.dispatchEvent(new Event('smartpick_comparison_change'));
    return ids;
  },

  clearComparison(): void {
    localStorage.setItem(STORAGE_KEYS.COMPARISON, JSON.stringify([]));
    window.dispatchEvent(new Event('smartpick_comparison_change'));
  },

  // NEWSLETTER
  getSubscribers(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS) || '[]');
    } catch {
      return [];
    }
  },

  addSubscriber(email: string, sourcePage: string): boolean {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS) || '[]');
      if (!existing.includes(email.toLowerCase())) {
        existing.push(email.toLowerCase());
        localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(existing));
      }
      return true;
    } catch {
      return false;
    }
  },

  // COOKIE CONSENT
  getCookieConsent(): 'accepted' | 'rejected' | 'pending' {
    if (typeof window === 'undefined') return 'pending';
    return (localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT) as any) || 'pending';
  },

  setCookieConsent(status: 'accepted' | 'rejected'): void {
    localStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, status);
    window.dispatchEvent(new Event('smartpick_cookie_change'));
  },

  // DEMO ADMIN AUTH
  getAdminAuth(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },

  setAdminAuth(isAuthenticated: boolean): void {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
    window.dispatchEvent(new Event('smartpick_auth_change'));
  },

  // RESET CATALOG TO FACTORY SAMPLE
  resetToDefaultData(): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
    localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(initialBuyingGuides));
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(initialBlogPosts));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSiteSettings));
    window.dispatchEvent(new Event('smartpick_data_change'));
  },
};
