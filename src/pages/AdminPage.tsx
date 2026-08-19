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
  Check
} from 'lucide-react';
import { StorageService } from '../lib/storage';
import { Product, Category, BuyingGuide, BlogPost, SiteSettings } from '../types';
import { buildAmazonAffiliateUrl } from '../lib/amazon';

interface AdminPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'guides' | 'settings' | 'ai_assistant' | 'guide_setup'
  >('overview');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [guides, setGuides] = useState<BuyingGuide[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [clicks, setClicks] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  // Product Editing Form State
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
    specs: { 'Connectivity': 'Bluetooth 5.3', 'Battery Life': '30 Hours' },
    published: true,
    featured: true,
  });

  // AI Assistant State
  const [aiTaskType, setAiTaskType] = useState<'outline' | 'meta_seo' | 'pros_cons' | 'faqs'>('outline');
  const [aiTopic, setAiTopic] = useState('');
  const [aiCategory, setAiCategory] = useState('');
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiError, setAiError] = useState('');
  const [copiedAi, setCopiedAi] = useState(false);

  // Settings Save Notification
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

  // Product CRUD Handlers
  const handleStartNewProduct = () => {
    const defaultCat = categories[0] || { id: 'c1', name: 'Audio' };
    setEditingProduct({
      id: `prod-${Date.now()}`,
      name: '',
      slug: '',
      brand: '',
      categoryId: defaultCat.id,
      categoryName: defaultCat.name,
      price: 199.99,
      priceNote: 'Price verified on Amazon',
      amazonUrl: '',
      affiliateUrl: '',
      asin: '',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      editorScore: 9.2,
      shortDescription: '',
      fullReview: '## Overview\n\nDetailed testing review notes...\n\n## Performance\n\nLaboratory benchmark analysis...',
      pros: ['Exceptional sound quality', 'Comfortable ear cups', 'Long battery life'],
      cons: ['Premium price point', 'Case is slightly bulky'],
      specs: { 'Battery Life': '30 Hours', 'Weight': '250g', 'Warranty': '1 Year' },
      published: true,
      featured: true,
      priceLastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsEditingProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.brand) return;

    const slug =
      editingProduct.slug ||
      editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const cat = categories.find((c) => c.id === editingProduct.categoryId);

    const productToSave: Product = {
      id: editingProduct.id || `prod-${Date.now()}`,
      name: editingProduct.name || '',
      slug,
      brand: editingProduct.brand || '',
      categoryId: editingProduct.categoryId || 'c1',
      categoryName: cat ? cat.name : (editingProduct.categoryName || 'Tech'),
      price: Number(editingProduct.price) || 0,
      priceNote: editingProduct.priceNote || 'Price verified on Amazon',
      amazonUrl: editingProduct.amazonUrl || '',
      affiliateUrl: editingProduct.affiliateUrl || '',
      asin: editingProduct.asin ? editingProduct.asin.toUpperCase().trim() : '',
      imageUrl: editingProduct.imageUrl || '',
      galleryImages: editingProduct.galleryImages || [editingProduct.imageUrl || ''],
      editorScore: Number(editingProduct.editorScore) || 9.0,
      shortDescription: editingProduct.shortDescription || '',
      fullReview: editingProduct.fullReview || '',
      pros: (editingProduct.pros || []).filter((p) => p && p.trim() !== ''),
      cons: (editingProduct.cons || []).filter((c) => c && c.trim() !== ''),
      specs: editingProduct.specs || {},
      published: editingProduct.published ?? true,
      featured: editingProduct.featured ?? true,
      priceLastUpdated: new Date().toISOString(),
      createdAt: editingProduct.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveProduct(productToSave);
    setIsEditingProduct(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      StorageService.deleteProduct(id);
    }
  };

  // Settings Save Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(settings);
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  // AI Assistant Generator
  const handleGenerateAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setAiLoading(true);
    setAiResult('');
    setAiError('');

    try {
      const response = await fetch('/api/ai/editorial-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: aiTaskType,
          topic: aiTopic,
          category: aiCategory,
          targetKeywords: aiKeywords,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setAiResult(data.result);
    } catch (err: any) {
      setAiError(err.message || 'AI request failed. Ensure GEMINI_API_KEY is configured.');
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

  return (
    <div id="admin-portal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold mb-2">
            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Founder & Editorial Management Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Manage your Amazon affiliate products, categories, affiliate tags, AI content generator, and analytics.
          </p>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 self-start md:self-auto"
        >
          <Eye className="w-4 h-4 text-emerald-600" />
          <span>View Public Site</span>
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Overview & Metrics', icon: TrendingUp },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { id: 'guides', label: `Buying Guides (${guides.length})`, icon: BookOpen },
          { id: 'ai_assistant', label: 'AI Editorial Assistant', icon: Sparkles },
          { id: 'settings', label: 'Amazon & Site Settings', icon: Settings },
          { id: 'guide_setup', label: 'Non-Technical Setup Guide', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW & METRICS TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Key Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Active Products</span>
                <Package className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{products.length}</p>
              <p className="text-[11px] text-slate-500">100% affiliate tagged</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Buying Guides</span>
                <BookOpen className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{guides.length}</p>
              <p className="text-[11px] text-slate-500">In-depth roundups</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Affiliate Outbound Clicks</span>
                <ExternalLink className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-700">{clicks.length}</p>
              <p className="text-[11px] text-slate-500">Tracked Amazon referrals</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Newsletter Subscribers</span>
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{subscribers.length}</p>
              <p className="text-[11px] text-slate-500">Active email readers</p>
            </div>
          </div>

          {/* Recent Affiliate Clicks Log */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Recent Affiliate CTA Clicks Log</h3>
              <span className="text-xs text-slate-500">{clicks.length} total events recorded</span>
            </div>

            {clicks.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No outbound affiliate clicks recorded yet. Click a &ldquo;Check Price on Amazon&rdquo; button to test tracking.
              </div>
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

      {/* 2. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Action */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Manage Catalog Products</h2>
            <button
              onClick={handleStartNewProduct}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
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
                      placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
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
                      placeholder="e.g. Sony"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Amazon ASIN (10 Characters)</label>
                    <input
                      type="text"
                      value={editingProduct.asin || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, asin: e.target.value })}
                      placeholder="e.g. B09XS7JWHH"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Our system automatically builds compliant affiliate URLs with your tag from this ASIN.
                    </p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
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
                      placeholder="https://..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Short Editorial Summary</label>
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
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                  >
                    Save Product Review
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">ASIN</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover bg-slate-100"
                        />
                        <span className="truncate max-w-xs">{p.name}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{p.brand}</td>
                      <td className="py-3 px-4 text-slate-600">{p.categoryName}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{p.asin || '—'}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {p.price ? `$${p.price.toFixed(2)}` : 'Check Amazon'}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">{p.editorScore?.toFixed(1)}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsEditingProduct(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Categories Directory</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono">{c.slug}</span>
                </div>
                <p className="text-xs text-slate-500">{c.description}</p>
                <div className="text-xs font-bold text-emerald-700 pt-2">
                  {products.filter((p) => p.categoryId === c.id).length} Products Assigned
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. BUYING GUIDES TAB */}
      {activeTab === 'guides' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Editorial Buying Guides</h2>
          </div>
          <div className="space-y-4">
            {guides.map((g) => (
              <div key={g.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    {g.categoryName}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{g.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{g.excerpt}</p>
                </div>
                <button
                  onClick={() => onNavigate('guide-detail', { slug: g.slug })}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl shrink-0"
                >
                  View Guide
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. AI EDITORIAL ASSISTANT TAB */}
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
              Accelerate your buying guide drafting, SEO meta description optimization, FAQ generation, and pros/cons brainstorming. All outputs are strictly conditioned never to hallucinate fake Amazon user reviews or prices.
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
                    placeholder="e.g. Best Ergonomic Keyboards for Programmers"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Keywords (Optional)</label>
                  <input
                    type="text"
                    value={aiKeywords}
                    onChange={(e) => setAiKeywords(e.target.value)}
                    placeholder="e.g. split keyboard, wrist pain, mechanical"
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
                  Select a task type and topic on the left to generate structured buying guide drafts.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Amazon Associates & Global Site Settings</h2>
              <p className="text-xs text-slate-500">Configure your affiliate tracking tags, branding, and legal disclosures.</p>
            </div>
          </div>

          {savedSettingsNotice && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Settings saved successfully and applied across all product buttons and disclosures!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Site Brand Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Amazon Associates Tag *</label>
                <input
                  type="text"
                  value={settings.amazonAssociateTag}
                  onChange={(e) => setSettings({ ...settings, amazonAssociateTag: e.target.value })}
                  placeholder="e.g. smartpick-20"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">This tag is appended to all outbound Amazon product links.</p>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Default Amazon Marketplace</label>
                <select
                  value={settings.amazonMarketplace}
                  onChange={(e) => setSettings({ ...settings, amazonMarketplace: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="amazon.com">amazon.com (United States)</option>
                  <option value="amazon.co.uk">amazon.co.uk (United Kingdom)</option>
                  <option value="amazon.ca">amazon.ca (Canada)</option>
                  <option value="amazon.de">amazon.de (Germany)</option>
                  <option value="amazon.fr">amazon.fr (France)</option>
                  <option value="amazon.it">amazon.it (Italy)</option>
                  <option value="amazon.es">amazon.es (Spain)</option>
                  <option value="amazon.com.au">amazon.com.au (Australia)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Default CTA Button Text</label>
                <input
                  type="text"
                  value={settings.defaultCtaText}
                  onChange={(e) => setSettings({ ...settings, defaultCtaText: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-800 block mb-1">Site Tagline / Mission</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-800 block mb-1">Amazon Operating Agreement Disclosure Statement</label>
                <textarea
                  rows={3}
                  value={settings.affiliateDisclosureText}
                  onChange={(e) => setSettings({ ...settings, affiliateDisclosureText: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Required by Amazon Associates Operating Agreement Section 5.</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7. NON-TECHNICAL FOUNDER SETUP GUIDE */}
      {activeTab === 'guide_setup' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-2xs space-y-8 animate-in fade-in">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Step-by-Step Playbook</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif-editorial">
              Founder Deployment & Setup Guide
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Written in plain English for non-technical founders. Follow these simple steps to launch your website.
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm">
            {/* Step 1 */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                  1
                </span>
                <span>Get Your Amazon Associates Store ID / Tag</span>
              </div>
              <p className="text-slate-600 leading-relaxed pl-8">
                Sign up at <strong>affiliate-program.amazon.com</strong>. Once approved, Amazon assigns you an Associate Tag (e.g. <code>smartpick-20</code>). Enter this tag in the <strong>Amazon & Site Settings</strong> tab of this admin portal to automatically link all buttons on your site.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                  2
                </span>
                <span>Setting Up Cloud Database (Supabase)</span>
              </div>
              <p className="text-slate-600 leading-relaxed pl-8">
                We have provided the complete SQL migration file in <code>/supabase/migrations/001_initial_schema.sql</code>. In your Supabase dashboard, navigate to <strong>SQL Editor</strong>, paste the file contents, and click <strong>Run</strong>. Then add your Supabase URL and Anon Key to your environment secrets.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                  3
                </span>
                <span>Deploying to Vercel or Cloud Run</span>
              </div>
              <p className="text-slate-600 leading-relaxed pl-8">
                Push this project to your GitHub repository and import it into Vercel or Google Cloud Run. The build command is pre-configured as <code>npm run build</code>, and static assets will be served instantly with worldwide edge caching.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
