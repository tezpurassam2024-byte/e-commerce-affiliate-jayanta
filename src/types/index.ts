export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  longDescription?: string;
  fullReview?: string;
  editorScore: number; // e.g. 9.4
  verdict?: string;
  bestFor?: string;
  asin?: string;
  amazonUrl?: string;
  affiliateUrl?: string;
  imageUrl: string;
  galleryImages?: string[];
  price?: number;
  currency?: string;
  priceNote?: string;
  priceLastUpdated?: string;
  rating?: number;
  reviewCount?: number;
  availability?: 'in_stock' | 'out_of_stock' | 'check_amazon';
  keyFeatures?: string[];
  specifications?: Record<string, string>;
  specs?: Record<string, string>;
  pros: string[];
  cons: string[];
  whoShouldBuy?: string[];
  whoShouldAvoid?: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  imageUrl?: string;
  featured: boolean;
  productCount?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface BuyingGuide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  featuredImage: string;
  categoryId: string;
  categoryName: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio?: string;
  };
  recommendedProductIds?: string[];
  featuredProductIds?: string[];
  topPickProductId?: string;
  bestBudgetProductId?: string;
  bestPremiumProductId?: string;
  selectionCriteria?: string[];
  faqs?: { question: string; answer: string }[];
  metaTitle?: string;
  metaDescription?: string;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
}

export interface ProductSpotlight {
  productId?: string;
  productName: string;
  brand?: string;
  productImageUrl: string;
  price?: number;
  affiliateUrl?: string;
  asin?: string;
  editorScore?: number;
  badgeText?: string;
  shortVerdict?: string;
  pros?: string[];
  cons?: string[];
  ctaText?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  featuredImage: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
    bio?: string;
  };
  // Specific product spotlight & affiliate link
  featuredProductId?: string;
  productSpotlight?: ProductSpotlight;
  metaTitle?: string;
  metaDescription?: string;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
}

export interface AffiliateClickEvent {
  id: string;
  productId: string;
  productName: string;
  placement: string;
  pagePath: string;
  timestamp: string;
  asin?: string;
  marketplace: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  siteDescription: string;
  logoUrl?: string;
  contactEmail: string;
  amazonAssociateTag: string;
  amazonMarketplace: string; // e.g. amazon.com, amazon.co.uk
  defaultCtaText: string;
  gaMeasurementId: string;
  enableAiAssistant: boolean;
  socialLinks: {
    youtube?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    pinterest?: string;
  };
  affiliateDisclosureText: string;
}

export interface UserComparisonState {
  productIds: string[];
}
