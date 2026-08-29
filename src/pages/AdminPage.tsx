import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  Package,
  Layers,
  BookOpen,
  Settings,
  Sparkles,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Save,
  RotateCcw,
  Search,
  Eye,
  Sliders,
  DollarSign,
  TrendingUp,
  Mail,
  Copy,
  Check,
  FileText,
  Smartphone,
  Tag,
  ShoppingBag,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Sparkle
} from 'lucide-react';
import { StorageService } from '../lib/storage';
import { Product, Category, BuyingGuide, BlogPost, SiteSettings, ProductSpotlight } from '../types';
import { buildAmazonAffiliateUrl } from '../lib/amazon';
import { BlogPostComposerModal } from '../components/BlogPostComposerModal';

interface AdminPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

const POPULAR_CATEGORY_ICONS = [
  { name: 'Smartphone', label: 'Phone / Smartphone' },
  { name: 'Headphones', label: 'Headphones / Audio' },
  { name: 'Laptop', label: 'Laptop / PC' },
  { name: 'Armchair', label: 'Furniture / Ergonomics' },
  { name: 'Home', label: 'Smart Home' },
  { name: 'Watch', label: 'Watch / Wearable' },
  { name: 'Video', label: 'Camera / Video' },
  { name: 'Tv', label: 'TV / Display' },
  { name: 'Speaker', label: 'Speaker / Soundbar' },
  { name: 'Gamepad', label: 'Gaming' },
  { name: 'Monitor', label: 'Monitor / Screen' },
  { name: 'Wifi', label: 'Networking / Wifi' },
  { name: 'Coffee', label: 'Appliances / Kitchen' },
  { name: 'Briefcase', label: 'Office / Work' },
  { name: 'Cpu', label: 'Chips / Hardware' },
  { name: 'Zap', label: 'Power / Chargers' },
  { name: 'Sparkles', label: 'Lifestyle / Wellness' },
  { name: 'Package', label: 'General Goods' },
  { name: 'Layers', label: 'Default / Multi-layer' }
];

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'blog' | 'guides' | 'settings' | 'ai_assistant'
  >('overview');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [guides, setGuides] = useState<BuyingGuide[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [clicks, setClicks] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  // Search & Filter state
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Product Editing State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({
    name: '',
    slug: '',
    brand: '',
    categoryId: '',
    categoryName: '',
    price: 0,
    priceNote: 'Price verified on Amazon',
    amazonUrl: '',
    affiliateUrl: '',
    asin: '',
    imageUrl: '',
    editorScore: 9.0,
    shortDescription: '',
    fullReview: '',
    pros: ['', '', ''],
    cons: ['', ''],
    specs: { 'Connectivity': 'Wireless', 'Battery': 'All-day' },
    published: true,
    featured: true,
  });

  // Category Editing State
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    iconName: 'Smartphone',
    featured: true,
    metaTitle: '',
    metaDescription: '',
  });

  // Blog Post Editing State
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [hasSpotlight, setHasSpotlight] = useState(false);
  const [spotlightSource, setSpotlightSource] = useState<'catalog' | 'custom'>('catalog');
  const [editingPost, setEditingPost] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: [],
    author: {
      name: 'Editorial Team',
      role: 'Staff Reviewer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    featuredProductId: '',
    productSpotlight: {
      productName: '',
      brand: '',
      productImageUrl: '',
      price: 0,
      asin: '',
      editorScore: 9.5,
      badgeText: 'Editor Spotlight',
      shortVerdict: '',
      pros: ['', ''],
      cons: [''],
      ctaText: 'Check Price on Amazon',
    },
    published: true,
    readTimeMinutes: 5,
  });

  // AI Assistant State
  const [aiTaskType, setAiTaskType] = useState<'outline' | 'meta_seo' | 'pros_cons' | 'faqs'>('outline');
  const [aiTopic, setAiTopic] = useState('');
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiError, setAiError] = useState('');
  const [copiedAi, setCopiedAi] = useState(false);

  // Settings Notice
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  const loadAll = () => {
    setProducts(StorageService.getProducts());
    setCategories(StorageService.getCategories());
    setGuides(StorageService.getBuyingGuides());
    setPosts(StorageService.getBlogPosts());
    setSettings(StorageService.getSettings());
    setClicks(StorageService.getAffiliateClicks());
    setSubscribers(StorageService.getSubscribers());
  };

  useEffect(() => {
    loadAll();
    window.addEventListener('smartpick_data_change', loadAll);
    return () => window.removeEventListener('smartpick_data_change', loadAll);
  }, []);

  // PRODUCT CRUD
  const handleStartNewProduct = () => {
    const defaultCat = categories[0] || { id: 'cat-phones', name: 'Smartphones & Mobile Phones' };
    setEditingProduct({
      name: '',
      slug: '',
      brand: '',
      categoryId: defaultCat.id,
      categoryName: defaultCat.name,
      price: 99.99,
      priceNote: 'Direct verified Amazon price',
      asin: '',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      editorScore: 9.2,
      shortDescription: '',
      fullReview: '## Testing & Hands-on Impressions\n\nOur lab findings and ergonomic benchmarks...',
      pros: ['Exceptional performance', 'Great value for money'],
      cons: ['Slightly premium price'],
      specs: { 'Brand': '', 'Warranty': '1 Year' },
      published: true,
      featured: true,
    });
    setIsEditingProduct(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsEditingProduct(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      StorageService.deleteProduct(id);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.brand) return;

    const slug = editingProduct.slug || editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = editingProduct.id || `prod-${Date.now()}`;
    const category = categories.find((c) => c.id === editingProduct.categoryId) || categories[0];

    const finalProduct: Product = {
      id,
      slug,
      name: editingProduct.name,
      brand: editingProduct.brand,
      categoryId: category?.id || 'cat-general',
      categoryName: category?.name || 'General',
      shortDescription: editingProduct.shortDescription || '',
      longDescription: editingProduct.shortDescription || '',
      fullReview: editingProduct.fullReview || '',
      editorScore: Number(editingProduct.editorScore) || 9.0,
      verdict: editingProduct.shortDescription || '',
      bestFor: editingProduct.bestFor || 'Everyday Shoppers',
      asin: editingProduct.asin || '',
      amazonUrl: editingProduct.asin
        ? `https://www.amazon.com/dp/${editingProduct.asin}`
        : editingProduct.amazonUrl || '',
      imageUrl: editingProduct.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      galleryImages: editingProduct.galleryImages || [editingProduct.imageUrl || ''],
      price: Number(editingProduct.price) || 0,
      currency: 'USD',
      priceNote: editingProduct.priceNote || 'Verified on Amazon',
      priceLastUpdated: new Date().toISOString(),
      rating: 4.8,
      reviewCount: 150,
      availability: 'in_stock',
      keyFeatures: editingProduct.keyFeatures || [],
      specifications: editingProduct.specs || { 'Model': editingProduct.name },
      specs: editingProduct.specs || { 'Model': editingProduct.name },
      pros: (editingProduct.pros || []).filter(Boolean),
      cons: (editingProduct.cons || []).filter(Boolean),
      whoShouldBuy: editingProduct.whoShouldBuy || ['Anyone wanting top performance'],
      whoShouldAvoid: editingProduct.whoShouldAvoid || ['Shoppers on a strict budget'],
      featured: Boolean(editingProduct.featured),
      published: Boolean(editingProduct.published),
      createdAt: editingProduct.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveProduct(finalProduct);
    setIsEditingProduct(false);
  };

  // CATEGORY CRUD
  const handleStartNewCategory = () => {
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      iconName: 'Smartphone',
      featured: true,
      metaTitle: '',
      metaDescription: '',
    });
    setIsEditingCategory(true);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory({ ...cat });
    setIsEditingCategory(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category? Associated products will remain in the database.')) {
      StorageService.deleteCategory(id);
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory.name) return;

    const slug = editingCategory.slug || editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = editingCategory.id || `cat-${Date.now()}`;

    const finalCategory: Category = {
      id,
      slug,
      name: editingCategory.name,
      description: editingCategory.description || '',
      iconName: editingCategory.iconName || 'Layers',
      featured: Boolean(editingCategory.featured),
      metaTitle: editingCategory.metaTitle || `${editingCategory.name} Reviews & Top Picks 2026`,
      metaDescription: editingCategory.metaDescription || `Tested reviews and recommendations for ${editingCategory.name}.`,
    };

    StorageService.saveCategory(finalCategory);
    setIsEditingCategory(false);
  };

  // BLOG POST CRUD
  const handleStartNewPost = () => {
    const firstProduct = products[0];
    setHasSpotlight(Boolean(firstProduct));
    setSpotlightSource('catalog');
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: `## In-Depth Analysis\n\nWrite your product insights, lab benchmarks, and long-term user experience here...\n\n### Key Highlights\n- Feature 1\n- Feature 2\n\n### The Final Verdict\nIs it worth buying? Check the Amazon pricing in the spotlight box below.`,
      featuredImage: firstProduct?.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
      category: categories[0]?.name || 'Smartphones & Mobile',
      tags: ['Review', 'Amazon Deals', 'Buying Advice'],
      author: {
        name: 'Editorial Staff',
        role: 'Hardware & Tech Editor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      featuredProductId: firstProduct?.id || '',
      productSpotlight: firstProduct ? {
        productId: firstProduct.id,
        productName: firstProduct.name,
        brand: firstProduct.brand,
        productImageUrl: firstProduct.imageUrl,
        price: firstProduct.price,
        asin: firstProduct.asin,
        editorScore: firstProduct.editorScore,
        badgeText: 'Editor Recommended',
        shortVerdict: firstProduct.shortDescription,
        pros: firstProduct.pros.slice(0, 2),
        cons: firstProduct.cons.slice(0, 1),
        ctaText: 'Check Price on Amazon',
      } : undefined,
      published: true,
      readTimeMinutes: 5,
    });
    setIsEditingPost(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost({ ...post });
    setHasSpotlight(Boolean(post.productSpotlight || post.featuredProductId));
    setSpotlightSource(post.featuredProductId ? 'catalog' : 'custom');
    setIsEditingPost(true);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      StorageService.deleteBlogPost(id);
    }
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost.title) return;

    const slug = editingPost.slug || editingPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = editingPost.id || `post-${Date.now()}`;

    let spotlightObj: ProductSpotlight | undefined = undefined;
    let featuredProdId: string | undefined = undefined;

    if (hasSpotlight) {
      if (spotlightSource === 'catalog' && editingPost.featuredProductId) {
        const prod = products.find((p) => p.id === editingPost.featuredProductId);
        featuredProdId = editingPost.featuredProductId;
        if (prod) {
          spotlightObj = {
            productId: prod.id,
            productName: prod.name,
            brand: prod.brand,
            productImageUrl: prod.imageUrl,
            price: prod.price,
            asin: prod.asin,
            editorScore: prod.editorScore,
            badgeText: 'Top Pick',
            shortVerdict: prod.shortDescription,
            pros: prod.pros.slice(0, 2),
            cons: prod.cons.slice(0, 1),
            ctaText: 'Check Price on Amazon',
          };
        }
      } else if (editingPost.productSpotlight && editingPost.productSpotlight.productName) {
        spotlightObj = {
          ...editingPost.productSpotlight,
          productImageUrl: editingPost.productSpotlight.productImageUrl || editingPost.featuredImage || '',
          price: Number(editingPost.productSpotlight.price) || undefined,
          editorScore: Number(editingPost.productSpotlight.editorScore) || 9.0,
          pros: (editingPost.productSpotlight.pros || []).filter(Boolean),
          cons: (editingPost.productSpotlight.cons || []).filter(Boolean),
        };
      }
    }

    const finalPost: BlogPost = {
      id,
      slug,
      title: editingPost.title,
      excerpt: editingPost.excerpt || '',
      content: editingPost.content || '',
      featuredImage: editingPost.featuredImage || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
      category: editingPost.category || 'General',
      tags: typeof editingPost.tags === 'string' ? (editingPost.tags as any).split(',').map((t: string) => t.trim()) : editingPost.tags || [],
      author: editingPost.author || {
        name: 'Editorial Staff',
        role: 'Senior Reviewer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      featuredProductId: featuredProdId,
      productSpotlight: spotlightObj,
      metaTitle: `${editingPost.title} | SmartPick Guide`,
      metaDescription: editingPost.excerpt,
      published: Boolean(editingPost.published),
      publishedAt: editingPost.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTimeMinutes: Number(editingPost.readTimeMinutes) || 5,
    };

    StorageService.saveBlogPost(finalPost);
    setIsEditingPost(false);
  };

  // SETTINGS SAVE
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(settings);
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  // AI ASSISTANT GENERATION
  const handleGenerateAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic) return;
    setAiLoading(true);
    setAiError('');
    setAiResult('');

    try {
      const res = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: aiTaskType,
          topic: aiTopic,
          keywords: aiKeywords,
          categoryName: categories[0]?.name || 'Technology',
        }),
      });

      const data = await res.json();
      if (data.status === 'ok') {
        setAiResult(data.content);
      } else {
        setAiError(data.message || 'AI request failed');
      }
    } catch (err: any) {
      setAiError(err.message || 'Could not connect to Gemini API endpoint');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyAi = () => {
    if (navigator.clipboard && aiResult) {
      navigator.clipboard.writeText(aiResult);
      setCopiedAi(true);
      setTimeout(() => setCopiedAi(false), 2000);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.asin && p.asin.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCat = productCategoryFilter === 'all' || p.categoryId === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div id="admin-portal-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-emerald-400 rounded-full text-xs font-bold mb-2">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Admin Management Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif-editorial">
            Website Control Center
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Manage your categories, catalog products, blog articles with affiliate callouts, and Amazon Associate store settings.
          </p>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>View Public Site</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'categories'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('blog')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'blog'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Blog & Reviews ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('guides')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'guides'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Buying Guides ({guides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_assistant')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ai_assistant'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>AI Editorial</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Amazon Settings</span>
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Active Categories</span>
                <Layers className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{categories.length}</div>
              <button
                onClick={() => setActiveTab('categories')}
                className="text-xs text-emerald-700 font-bold hover:underline mt-2 inline-block"
              >
                + Add new category
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Catalog Products</span>
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{products.length}</div>
              <button
                onClick={() => setActiveTab('products')}
                className="text-xs text-blue-700 font-bold hover:underline mt-2 inline-block"
              >
                + Add new product
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Blog Articles</span>
                <FileText className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{posts.length}</div>
              <button
                onClick={() => setActiveTab('blog')}
                className="text-xs text-amber-700 font-bold hover:underline mt-2 inline-block"
              >
                + Write article with affiliate box
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Outbound Amazon Clicks</span>
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{clicks.length}</div>
              <p className="text-[11px] text-slate-400 mt-2">Logged in real-time</p>
            </div>
          </div>

          {/* Quick Action Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={handleStartNewCategory}
              className="bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 p-6 rounded-3xl cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-800">Add New Category</h3>
              <p className="text-xs text-slate-600">
                Create new product categories (e.g. Mobile Phones, Tablets, Drones) with custom icons.
              </p>
            </div>

            <div
              onClick={handleStartNewProduct}
              className="bg-blue-50 hover:bg-blue-100/80 border border-blue-200 p-6 rounded-3xl cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-800">Add Product Review</h3>
              <p className="text-xs text-slate-600">
                Publish a product into any category with auto-generated Amazon affiliate links.
              </p>
            </div>

            <div
              onClick={handleStartNewPost}
              className="bg-amber-50 hover:bg-amber-100/80 border border-amber-200 p-6 rounded-3xl cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-800">Write Product Blog Post</h3>
              <p className="text-xs text-slate-600">
                Author an article focusing on a specific product with an embedded Amazon buy box.
              </p>
            </div>
          </div>

          {/* Recent Outbound Click Activity */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Recent Outbound Amazon Affiliate Clicks</h2>
            {clicks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No affiliate clicks logged yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                      <th className="py-2 px-3">Product Name</th>
                      <th className="py-2 px-3">Placement</th>
                      <th className="py-2 px-3">Page Path</th>
                      <th className="py-2 px-3">ASIN</th>
                      <th className="py-2 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clicks.slice(0, 10).map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{c.productName}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-mono">{c.placement}</td>
                        <td className="py-2.5 px-3 text-slate-500">{c.pagePath}</td>
                        <td className="py-2.5 px-3 text-slate-700 font-mono">{c.asin || '—'}</td>
                        <td className="py-2.5 px-3 text-slate-400">
                          {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Product Categories</h2>
              <p className="text-xs text-slate-500">Organize your reviews and buying guides into top-level departments.</p>
            </div>
            <button
              onClick={handleStartNewCategory}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>

          {/* Category Edit / Create Modal Form */}
          {isEditingCategory && (
            <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-xl space-y-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-lg text-slate-900">
                  {editingCategory.id ? 'Edit Category' : 'Create New Category'}
                </h3>
                <button
                  onClick={() => setIsEditingCategory(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={editingCategory.name || ''}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setEditingCategory({
                          ...editingCategory,
                          name,
                          slug: editingCategory.slug ? editingCategory.slug : slug,
                        });
                      }}
                      placeholder="e.g. Smartphones & Mobile Phones"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={editingCategory.slug || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                      placeholder="e.g. smartphones-mobile-phones"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category Icon</label>
                    <select
                      value={editingCategory.iconName || 'Smartphone'}
                      onChange={(e) => setEditingCategory({ ...editingCategory, iconName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                    >
                      {POPULAR_CATEGORY_ICONS.map((ico) => (
                        <option key={ico.name} value={ico.name}>
                          {ico.label} ({ico.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={editingCategory.featured ?? true}
                        onChange={(e) => setEditingCategory({ ...editingCategory, featured: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Feature on Homepage & Navigation</span>
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Category Image URL (Product Photo / Illustration)</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={editingCategory.imageUrl || ''}
                        onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
                        placeholder="e.g. /src/assets/images/headphones_category.jpg or https://..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                      />
                      {editingCategory.imageUrl && (
                        <img
                          src={editingCategory.imageUrl}
                          alt="Preview"
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Short Category Description</label>
                    <textarea
                      rows={2}
                      value={editingCategory.description || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                      placeholder="e.g. Tested reviews of flagship, midrange, and budget Android & iOS mobile phones."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">SEO Meta Title (Optional)</label>
                    <input
                      type="text"
                      value={editingCategory.metaTitle || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, metaTitle: e.target.value })}
                      placeholder="e.g. Best Smartphones & Mobile Phones 2026 | SmartPick Guide"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsEditingCategory(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Category</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((c) => {
              const count = products.filter((p) => p.categoryId === c.id).length;
              return (
                <div
                  key={c.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {c.imageUrl && (
                      <div className="aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 mb-2 border border-slate-100">
                        <img
                          src={c.imageUrl}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-lg uppercase">
                        {c.iconName}
                      </span>
                      <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        {count} {count === 1 ? 'product' : 'products'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">{c.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate('category-detail', { slug: c.slug })}
                      className="text-xs font-bold text-emerald-700 hover:underline"
                    >
                      View Category Page →
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditCategory(c)}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50"
                        title="Edit Category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Catalog Products</h2>
              <p className="text-xs text-slate-500">Add or edit reviews across all product categories with verified Amazon ASINs.</p>
            </div>
            <button
              onClick={handleStartNewProduct}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm self-start sm:self-auto transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl border border-slate-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search products by title, brand, or ASIN..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Edit / Create Form Modal */}
          {isEditingProduct && (
            <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-xl space-y-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-lg text-slate-900">
                  {editingProduct.id ? 'Edit Product Review' : 'Create New Product Review'}
                </h3>
                <button
                  onClick={() => setIsEditingProduct(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="e.g. Apple iPhone 16 Pro Max (256GB)"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.brand || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                      placeholder="e.g. Apple"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Amazon ASIN (10 Characters)</label>
                    <input
                      type="text"
                      value={editingProduct.asin || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, asin: e.target.value })}
                      placeholder="e.g. B0DGHN5Y21"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Our system automatically builds compliant affiliate URLs with your tag from this ASIN.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">Category *</label>
                      <button
                        type="button"
                        onClick={handleStartNewCategory}
                        className="text-[10px] text-emerald-700 font-bold hover:underline"
                      >
                        + New Category
                      </button>
                    </div>
                    <select
                      value={editingProduct.categoryId || ''}
                      onChange={(e) => {
                        const catId = e.target.value;
                        const c = categories.find((item) => item.id === catId);
                        setEditingProduct({
                          ...editingProduct,
                          categoryId: catId,
                          categoryName: c ? c.name : '',
                        });
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Verified Amazon Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Editor Score (0.0 to 10.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="10.0"
                      value={editingProduct.editorScore || 9.0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, editorScore: parseFloat(e.target.value) || 9.0 })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Product Image URL</label>
                    <input
                      type="url"
                      value={editingProduct.imageUrl || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Short Editorial Verdict / Summary</label>
                    <textarea
                      rows={2}
                      value={editingProduct.shortDescription || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                      placeholder="1-2 sentences summarizing the verdict and best use case..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Full Long-Form Review (Markdown)</label>
                    <textarea
                      rows={6}
                      value={editingProduct.fullReview || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fullReview: e.target.value })}
                      placeholder="## Overview\n\nDetailed test notes..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsEditingProduct(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Product Review</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Editor Score</th>
                    <th className="py-3 px-4">ASIN</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No products match your search or filter.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-contain rounded-lg bg-slate-100 p-1 border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{p.name}</p>
                              <p className="text-[11px] text-slate-400">{p.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">{p.categoryName}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {p.price ? `$${p.price.toFixed(2)}` : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold rounded-md">
                            {p.editorScore} / 10
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{p.asin || '—'}</td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => onNavigate('product-detail', { slug: p.slug })}
                            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. BLOG ARTICLES TAB */}
      {activeTab === 'blog' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Blog Articles & Product Reviews</h2>
              <p className="text-xs text-slate-500">
                Write long-form articles, hardware deep-dives, or feature a specific product with an embedded Amazon affiliate buy box.
              </p>
            </div>
            <button
              onClick={handleStartNewPost}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm self-start sm:self-auto transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Article</span>
            </button>
          </div>

          {/* Blog Post Composer Modal */}
          <BlogPostComposerModal
            isOpen={isEditingPost}
            onClose={() => setIsEditingPost(false)}
            initialPost={editingPost}
            onPostSaved={() => {
              setPosts(StorageService.getBlogPosts());
              setIsEditingPost(false);
            }}
            onNavigate={onNavigate}
          />

          {/* Blog Articles List */}
          <div className="space-y-4">
            {posts.map((p) => {
              const hasSpot = Boolean(p.productSpotlight || p.featuredProductId);
              return (
                <div
                  key={p.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={p.featuredImage}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl bg-slate-100 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                        {hasSpot && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                            ★ Product Spotlight
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{p.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{p.excerpt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onNavigate('blog-detail', { slug: p.slug })}
                      className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100"
                      title="View Article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditPost(p)}
                      className="p-2 text-slate-400 hover:text-emerald-700 rounded-xl hover:bg-emerald-50"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(p.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. BUYING GUIDES TAB */}
      {activeTab === 'guides' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Buying Guides</h2>
              <p className="text-xs text-slate-500">Comprehensive category roundups and testing criteria rankings.</p>
            </div>
          </div>
          <div className="space-y-4">
            {guides.map((g) => (
              <div key={g.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {g.categoryName}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1">{g.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{g.excerpt}</p>
                </div>
                <button
                  onClick={() => onNavigate('guide-detail', { slug: g.slug })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl shrink-0 transition-colors"
                >
                  View Guide
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. AI EDITORIAL ASSISTANT TAB */}
      {activeTab === 'ai_assistant' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-3 border border-emerald-900/60 shadow-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Server-Side Gemini 3.7 Flash</span>
            </div>
            <h2 className="text-2xl font-bold font-serif-editorial">
              AI Editorial & SEO Assistant
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Accelerate your buying guide drafting, SEO meta description optimization, FAQ generation, and pros/cons brainstorming.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input form */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
              <form onSubmit={handleGenerateAi} className="space-y-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Editorial Task Type</label>
                  <select
                    value={aiTaskType}
                    onChange={(e) => setAiTaskType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="outline">Comprehensive Buying Guide Outline</option>
                    <option value="meta_seo">High-CTR SEO Meta Title & Descriptions</option>
                    <option value="pros_cons">Brainstorm Realistic Pros & Cons</option>
                    <option value="faqs">Generate High-Intent Shopper FAQs</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product or Category Topic *</label>
                  <input
                    type="text"
                    required
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g. Best Smartphones with Periscope Zoom"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Keywords (Optional)</label>
                  <input
                    type="text"
                    value={aiKeywords}
                    onChange={(e) => setAiKeywords(e.target.value)}
                    placeholder="e.g. 5x zoom, battery test, Snapdragon"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={aiLoading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{aiLoading ? 'Generating with Gemini...' : 'Generate Content'}</span>
                </button>
              </form>
            </div>

            {/* Output Display */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-sm">Generated Editorial Draft</span>
                {aiResult && (
                  <button
                    onClick={handleCopyAi}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1"
                  >
                    {copiedAi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAi ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {aiError && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                  {aiError}
                </div>
              )}

              {aiLoading ? (
                <div className="py-16 text-center space-y-2 text-slate-400 text-xs">
                  <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Synthesizing research-backed editorial advice...</p>
                </div>
              ) : aiResult ? (
                <div className="prose-editorial text-xs leading-relaxed max-h-[450px] overflow-y-auto whitespace-pre-wrap font-mono p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {aiResult}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 text-xs">
                  Select a task type and enter a topic to draft content with AI.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Amazon Associates & Branding Settings</h2>
            <p className="text-xs text-slate-500">
              Configure your affiliate tracking store tag, default Amazon marketplace, and custom CTA button copy.
            </p>
          </div>

          {savedSettingsNotice && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings updated successfully! Outbound links across the site now use your new tag.</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Amazon Associate Tag (Tracking ID) *</label>
                <input
                  type="text"
                  required
                  value={settings.amazonAssociateTag}
                  onChange={(e) => setSettings({ ...settings, amazonAssociateTag: e.target.value })}
                  placeholder="e.g. smartpick-20"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Amazon Marketplace</label>
                <select
                  value={settings.amazonMarketplace}
                  onChange={(e) => setSettings({ ...settings, amazonMarketplace: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="amazon.com">amazon.com (United States)</option>
                  <option value="amazon.co.uk">amazon.co.uk (United Kingdom)</option>
                  <option value="amazon.ca">amazon.ca (Canada)</option>
                  <option value="amazon.de">amazon.de (Germany)</option>
                  <option value="amazon.in">amazon.in (India)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Default CTA Button Copy</label>
                <input
                  type="text"
                  value={settings.defaultCtaText}
                  onChange={(e) => setSettings({ ...settings, defaultCtaText: e.target.value })}
                  placeholder="Check Price on Amazon"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Website Brand Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  placeholder="SmartPick Guide"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">FTC & Amazon Affiliate Disclosure Text</label>
                <textarea
                  rows={3}
                  value={settings.affiliateDisclosureText}
                  onChange={(e) => setSettings({ ...settings, affiliateDisclosureText: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 leading-relaxed focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Site Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
