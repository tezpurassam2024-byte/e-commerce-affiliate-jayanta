import React, { useState, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Sparkles,
  ShoppingBag,
  Eye,
  Edit3,
  CheckCircle,
  FileText,
  Plus,
  Trash2,
  HelpCircle,
  Clock,
  User,
  Tag,
  Maximize2,
  Layers,
  DollarSign,
  Star,
  ExternalLink
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BlogPost, Product, Category, ProductSpotlight } from '../types';
import { StorageService } from '../lib/storage';

interface BlogPostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSaved?: (post: BlogPost) => void;
  initialPost?: Partial<BlogPost> | null;
  onNavigate?: (page: string, params?: Record<string, any>) => void;
}

// Curated high quality product images for quick selection
const CURATED_PRODUCT_IMAGES = [
  {
    category: 'Smartphones',
    name: 'Flagship Smartphone (Titanium)',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
  },
  {
    category: 'Smartphones',
    name: 'Triple Camera Array Close-up',
    url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80',
  },
  {
    category: 'Audio',
    name: 'Wireless Noise-Canceling Headphones',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    category: 'Audio',
    name: 'Premium Audio Drivers & Ear Cups',
    url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80',
  },
  {
    category: 'Laptops',
    name: 'Slim Ultrabook on Wooden Desk',
    url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80',
  },
  {
    category: 'Laptops',
    name: 'Backlit Keyboard & Trackpad',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
  },
  {
    category: 'Smart Home',
    name: 'Smart Speaker & Smart Hub',
    url: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=80',
  },
  {
    category: 'Ergonomics',
    name: 'Ergonomic Mesh Office Chair',
    url: 'https://images.unsplash.com/photo-1580481077114-1e0e84b80e43?auto=format&fit=crop&w=1000&q=80',
  },
  {
    category: 'Cameras',
    name: 'Mirrorless Camera & Prime Lens',
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
  },
];

export const BlogPostComposerModal: React.FC<BlogPostComposerModalProps> = ({
  isOpen,
  onClose,
  onPostSaved,
  initialPost,
  onNavigate,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);

  // Composer Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('Editorial Team');
  const [authorRole, setAuthorRole] = useState('Staff Hardware Reviewer');
  const [tags, setTags] = useState('Product Review, Buying Advice, Amazon Deals');

  // Product Spotlight Box State
  const [hasSpotlight, setHasSpotlight] = useState(true);
  const [spotlightSource, setSpotlightSource] = useState<'catalog' | 'custom'>('catalog');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customSpotlight, setCustomSpotlight] = useState<ProductSpotlight>({
    productName: '',
    brand: '',
    productImageUrl: '',
    price: 99.99,
    asin: '',
    editorScore: 9.3,
    badgeText: 'Editor Spotlight',
    shortVerdict: 'High-performance gear tested for real-world reliability.',
    pros: ['Top-tier build quality', 'Excellent battery & efficiency'],
    cons: ['Slightly premium price point'],
    ctaText: 'Check Price on Amazon',
  });

  // Active View Mode: 'edit' or 'preview'
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [activeTab, setActiveTab] = useState<'content' | 'featured_image' | 'spotlight'>('content');

  // In-Post Image Insertion Drawer State
  const [showImageInserter, setShowImageInserter] = useState(false);
  const [insertImageUrl, setInsertImageUrl] = useState('');
  const [insertImageCaption, setInsertImageCaption] = useState('');
  const [insertImageAlt, setInsertImageAlt] = useState('');
  const [insertImageAlignment, setInsertImageAlignment] = useState<'full' | 'center'>('full');

  // File Upload Handling
  const featuredFileInputRef = useRef<HTMLInputElement>(null);
  const insertFileInputRef = useRef<HTMLInputElement>(null);
  const spotlightFileInputRef = useRef<HTMLInputElement>(null);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize data on mount or when initialPost changes
  React.useEffect(() => {
    if (isOpen) {
      const cats = StorageService.getCategories();
      const prods = StorageService.getProducts();
      setCategories(cats);
      setCatalogProducts(prods);

      if (initialPost) {
        setTitle(initialPost.title || '');
        setSlug(initialPost.slug || '');
        setCategory(initialPost.category || (cats[0]?.name || 'Technology'));
        setReadTime(initialPost.readTimeMinutes || 5);
        setExcerpt(initialPost.excerpt || '');
        setFeaturedImage(initialPost.featuredImage || CURATED_PRODUCT_IMAGES[0].url);
        setContent(
          initialPost.content ||
            `## Hands-On Overview\n\nIn our continuous testing across consumer hardware, finding the balance between long-term durability and price is crucial. Here is our breakdown of real-world benchmarks.\n\n### Lab Performance & Findings\n- Build quality and ergonomic tactile feel exceeded expectations.\n- Battery endurance and efficiency are among the class leaders.\n\n### The Final Verdict\nCheck the real-time Amazon pricing and availability in our spotlight box below.`
        );
        setAuthorName(initialPost.author?.name || 'Editorial Team');
        setAuthorRole(initialPost.author?.role || 'Staff Hardware Reviewer');
        setTags(Array.isArray(initialPost.tags) ? initialPost.tags.join(', ') : 'Product Review, Amazon Deals');

        const hasSpot = Boolean(initialPost.productSpotlight || initialPost.featuredProductId);
        setHasSpotlight(hasSpot);
        if (initialPost.featuredProductId) {
          setSpotlightSource('catalog');
          setSelectedProductId(initialPost.featuredProductId);
        } else if (initialPost.productSpotlight) {
          setSpotlightSource('custom');
          setCustomSpotlight(initialPost.productSpotlight);
        }
      } else {
        // Defaults for brand new post
        const defaultCat = cats[0]?.name || 'Smartphones & Mobile';
        const defaultProd = prods[0];
        setTitle('');
        setSlug('');
        setCategory(defaultCat);
        setReadTime(5);
        setExcerpt('');
        setFeaturedImage(defaultProd?.imageUrl || CURATED_PRODUCT_IMAGES[0].url);
        setContent(
          `## In-Depth Analysis & Hands-on Impressions\n\nWe spent over 40 hours testing this product against leading competitors in controlled benchmarks and everyday use.\n\n### Key Highlights\n- **Superior Build**: Lightweight chassis engineered for daily durability.\n- **Performance**: Instant responsiveness with reliable battery efficiency.\n\n### Testing Results & Final Thoughts\nFor prospective buyers searching for verified performance, check the Amazon pricing in the spotlight card below.`
        );
        setAuthorName('Editorial Staff');
        setAuthorRole('Senior Tech Reviewer');
        setTags('Product Review, Buying Advice, Amazon Deals');
        setHasSpotlight(true);
        if (defaultProd) {
          setSpotlightSource('catalog');
          setSelectedProductId(defaultProd.id);
        } else {
          setSpotlightSource('custom');
        }
      }
    }
  }, [isOpen, initialPost]);

  if (!isOpen) return null;

  // Title change with auto slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(autoSlug);
  };

  // Convert File to Data URL (Base64)
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          callback(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Insert Image into Markdown Body at cursor
  const handleInsertImageIntoBody = () => {
    if (!insertImageUrl) {
      alert('Please enter an image URL or upload an image file first.');
      return;
    }

    const caption = insertImageCaption.trim();
    const alt = insertImageAlt.trim() || caption || 'Product photo';

    let markdownSnippet = `\n\n![${alt}](${insertImageUrl})\n`;
    if (caption) {
      markdownSnippet += `*Photo: ${caption}*\n\n`;
    } else {
      markdownSnippet += `\n`;
    }

    const textarea = bodyTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + markdownSnippet + content.substring(end);
      setContent(newContent);
    } else {
      setContent((prev) => prev + markdownSnippet);
    }

    // Reset inserter drawer
    setInsertImageUrl('');
    setInsertImageCaption('');
    setInsertImageAlt('');
    setShowImageInserter(false);
    setActiveTab('content');
  };

  // Quick formatting helper
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = bodyTextareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'Sample text';
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
  };

  // Build Spotlight Data
  const getActiveSpotlight = (): ProductSpotlight | undefined => {
    if (!hasSpotlight) return undefined;
    if (spotlightSource === 'catalog' && selectedProductId) {
      const p = catalogProducts.find((item) => item.id === selectedProductId);
      if (p) {
        return {
          productId: p.id,
          productName: p.name,
          brand: p.brand,
          productImageUrl: p.imageUrl,
          price: p.price,
          asin: p.asin,
          editorScore: p.editorScore,
          badgeText: 'Editor Pick',
          shortVerdict: p.shortDescription || p.verdict || 'Highly recommended in our testing.',
          pros: p.pros?.slice(0, 2) || ['Class leading', 'High reliability'],
          cons: p.cons?.slice(0, 1) || ['Standard warranty'],
          ctaText: 'Check Price on Amazon',
        };
      }
    }
    if (customSpotlight.productName) {
      return {
        ...customSpotlight,
        productImageUrl: customSpotlight.productImageUrl || featuredImage || CURATED_PRODUCT_IMAGES[0].url,
        price: Number(customSpotlight.price) || undefined,
        editorScore: Number(customSpotlight.editorScore) || 9.0,
        pros: (customSpotlight.pros || []).filter(Boolean),
        cons: (customSpotlight.cons || []).filter(Boolean),
      };
    }
    return undefined;
  };

  // Handle Save / Publish
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter an article title.');
      return;
    }

    const finalSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalId = initialPost?.id || `post-${Date.now()}`;
    const spotlightObj = getActiveSpotlight();

    const newPost: BlogPost = {
      id: finalId,
      slug: finalSlug,
      title: title.trim(),
      excerpt: excerpt.trim() || `${title.trim()} - in-depth testing, specs, and buying guidance.`,
      content: content.trim(),
      featuredImage: featuredImage.trim() || CURATED_PRODUCT_IMAGES[0].url,
      category: category.trim() || 'General',
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      author: {
        name: authorName.trim() || 'Editorial Staff',
        role: authorRole.trim() || 'Hardware Reviewer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      featuredProductId: spotlightSource === 'catalog' && hasSpotlight ? selectedProductId : undefined,
      productSpotlight: spotlightObj,
      metaTitle: `${title.trim()} | SmartPick Guide`,
      metaDescription: excerpt.trim(),
      published: true,
      publishedAt: initialPost?.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTimeMinutes: Number(readTime) || 5,
    };

    StorageService.saveBlogPost(newPost);

    if (onPostSaved) {
      onPostSaved(newPost);
    }

    onClose();

    // Offer navigation
    if (onNavigate) {
      onNavigate('blog-detail', { slug: finalSlug });
    }
  };

  const currentSpotlightPreview = getActiveSpotlight();

  return (
    <div
      id="blog-post-composer-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                <span>{initialPost?.id ? 'Edit Article & Product Review' : 'Create New Blog Post'}</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-md">
                  Amazon Affiliate Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Author articles with rich product images, Markdown formatting, and Amazon buy boxes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                  viewMode === 'edit'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {viewMode === 'edit' ? (
            <form id="blog-composer-form" onSubmit={handleSave} className="space-y-6">
              {/* Top Sub-tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
                    activeTab === 'content'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>1. Title & Article Content</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('featured_image')}
                  className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
                    activeTab === 'featured_image'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>2. Header Product Image</span>
                  {featuredImage && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('spotlight')}
                  className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
                    activeTab === 'spotlight'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>3. Product Spotlight & Amazon Buy Box</span>
                  {hasSpotlight && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}
                </button>
              </div>

              {/* 1. CONTENT TAB */}
              {activeTab === 'content' && (
                <div className="space-y-5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-800 block mb-1">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Apple iPhone 16 Pro Max Review: The Definitive Creator Phone"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                        <option value="Smartphones & Mobile">Smartphones & Mobile</option>
                        <option value="Audio & Headphones">Audio & Headphones</option>
                        <option value="Laptops & Computing">Laptops & Computing</option>
                        <option value="Smart Home">Smart Home</option>
                        <option value="Wearables & Watches">Wearables & Watches</option>
                        <option value="General Tech">General Tech</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="article-slug"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">
                        Estimated Read Time
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={readTime}
                        onChange={(e) => setReadTime(parseInt(e.target.value) || 5)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Editorial Staff"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Article Excerpt / Sub-headline
                    </label>
                    <textarea
                      rows={2}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="1-2 sentences summarizing what this article covers and the core finding..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* IN-ARTICLE FORMATTING & PRODUCT IMAGE INSERTION TOOLBAR */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-100 rounded-2xl border border-slate-200">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase px-2">
                          Formatting Tools:
                        </span>
                        <button
                          type="button"
                          onClick={() => insertFormatting('## ', '\n')}
                          className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-lg font-bold shadow-2xs border border-slate-200"
                          title="Heading 2"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('### ', '\n')}
                          className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-lg font-bold shadow-2xs border border-slate-200"
                          title="Heading 3"
                        >
                          H3
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('**', '**')}
                          className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-lg font-bold shadow-2xs border border-slate-200"
                          title="Bold Text"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('*', '*')}
                          className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-lg italic shadow-2xs border border-slate-200"
                          title="Italic Text"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('- ')}
                          className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-lg shadow-2xs border border-slate-200"
                          title="Bullet List"
                        >
                          • List
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('> ')}
                          className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-lg shadow-2xs border border-slate-200"
                          title="Quote"
                        >
                          “ Quote
                        </button>
                      </div>

                      {/* Prominent Insert Product Image Button */}
                      <button
                        type="button"
                        onClick={() => setShowImageInserter(!showImageInserter)}
                        className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                          showImageInserter
                            ? 'bg-emerald-700 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>+ Add Product Image to Article</span>
                      </button>
                    </div>

                    {/* Expandable Image Inserter Subpanel */}
                    {showImageInserter && (
                      <div className="bg-emerald-50/70 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-2">
                        <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-emerald-700" />
                            <span className="font-bold text-emerald-950 text-xs sm:text-sm">
                              Insert In-Article Product Image
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowImageInserter(false)}
                            className="text-emerald-800 hover:text-emerald-950 font-bold"
                          >
                            ✕ Cancel
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Image Source */}
                          <div className="space-y-3">
                            <label className="font-bold text-emerald-950 block">
                              1. Select Image Source
                            </label>

                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                ref={insertFileInputRef}
                                onChange={(e) =>
                                  handleFileChange(e, (dataUrl) => setInsertImageUrl(dataUrl))
                                }
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => insertFileInputRef.current?.click()}
                                className="px-3 py-2 bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs"
                              >
                                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Upload from Computer</span>
                              </button>
                              <span className="text-slate-400">or</span>
                            </div>

                            <div>
                              <input
                                type="url"
                                value={insertImageUrl}
                                onChange={(e) => setInsertImageUrl(e.target.value)}
                                placeholder="Paste Image URL (https://...)"
                                className="w-full p-2 bg-white border border-emerald-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                              />
                            </div>

                            {/* Presets */}
                            <div>
                              <span className="text-[11px] font-bold text-emerald-900 block mb-1.5">
                                Or Pick Curated Product Photo:
                              </span>
                              <div className="grid grid-cols-3 gap-1.5 max-h-28 overflow-y-auto p-1 bg-white/60 rounded-xl border border-emerald-200">
                                {CURATED_PRODUCT_IMAGES.map((img, idx) => (
                                  <div
                                    key={idx}
                                    onClick={() => {
                                      setInsertImageUrl(img.url);
                                      setInsertImageCaption(img.name);
                                    }}
                                    className="cursor-pointer group relative rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-500 aspect-4/3"
                                  >
                                    <img
                                      src={img.url}
                                      alt={img.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center p-1 text-center transition-opacity">
                                      <span className="text-[9px] text-white font-bold leading-tight">
                                        {img.name}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Image Caption & Insertion Controls */}
                          <div className="space-y-3 flex flex-col justify-between">
                            <div>
                              <label className="font-bold text-emerald-950 block mb-1">
                                2. Product Image Caption & Alt Text
                              </label>
                              <input
                                type="text"
                                value={insertImageCaption}
                                onChange={(e) => setInsertImageCaption(e.target.value)}
                                placeholder="e.g. Camera bump close-up showing 5x periscope lens"
                                className="w-full p-2 bg-white border border-emerald-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 mb-2"
                              />

                              <input
                                type="text"
                                value={insertImageAlt}
                                onChange={(e) => setInsertImageAlt(e.target.value)}
                                placeholder="Alt text (for accessibility/SEO)"
                                className="w-full p-2 bg-white border border-emerald-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                              />
                            </div>

                            {/* Preview of chosen image */}
                            {insertImageUrl && (
                              <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-emerald-300">
                                <img
                                  src={insertImageUrl}
                                  alt="Preview"
                                  className="w-16 h-12 object-cover rounded-lg bg-slate-100 shrink-0"
                                />
                                <div className="text-[11px] truncate flex-1 text-slate-600">
                                  <span className="font-bold text-emerald-900 block truncate">
                                    {insertImageCaption || 'Image ready to insert'}
                                  </span>
                                  <span>Will be inserted at cursor position</span>
                                </div>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={handleInsertImageIntoBody}
                              disabled={!insertImageUrl}
                              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Insert Image into Article Body</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Main Markdown Textarea */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-800">
                          Article Body Content (Markdown Supported) *
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {content.length} characters • Markdown formatting active
                        </span>
                      </div>
                      <textarea
                        ref={bodyTextareaRef}
                        rows={12}
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your article paragraphs here...\n\nUse the '+ Add Product Image' tool above to insert photos directly into this text!"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-mono text-xs focus:outline-none focus:border-emerald-500 focus:bg-white leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. FEATURED HEADER IMAGE TAB */}
              {activeTab === 'featured_image' && (
                <div className="space-y-6 text-xs">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Header Banner & Thumbnail Photo
                      </h3>
                      <p className="text-slate-500 text-xs mt-0.5">
                        This image appears at the top of the article and as the primary card image on the blog directory.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Image Input Options */}
                      <div className="space-y-4">
                        <div>
                          <label className="font-bold text-slate-800 block mb-1">
                            Option A: Upload Image File from Device
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            ref={featuredFileInputRef}
                            onChange={(e) =>
                              handleFileChange(e, (dataUrl) => setFeaturedImage(dataUrl))
                            }
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => featuredFileInputRef.current?.click()}
                            className="w-full py-3 bg-white hover:bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl text-slate-700 font-bold flex items-center justify-center gap-2 transition-colors"
                          >
                            <Upload className="w-4 h-4 text-emerald-600" />
                            <span>Click to Browse & Upload Image File</span>
                          </button>
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block mb-1">
                            Option B: Direct Image URL
                          </label>
                          <div className="relative">
                            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="url"
                              value={featuredImage}
                              onChange={(e) => setFeaturedImage(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        {/* Presets */}
                        <div>
                          <label className="font-bold text-slate-800 block mb-1.5">
                            Option C: Pick From Curated Product Gallery
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {CURATED_PRODUCT_IMAGES.map((preset, idx) => (
                              <div
                                key={idx}
                                onClick={() => setFeaturedImage(preset.url)}
                                className={`cursor-pointer group relative rounded-xl overflow-hidden border-2 transition-all aspect-4/3 ${
                                  featuredImage === preset.url
                                    ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                                    : 'border-slate-200 hover:border-slate-400'
                                }`}
                              >
                                <img
                                  src={preset.url}
                                  alt={preset.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center p-1 text-center transition-opacity">
                                  <span className="text-[9px] text-white font-bold leading-tight">
                                    {preset.name}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Header Image Preview Box */}
                      <div>
                        <label className="font-bold text-slate-800 block mb-1">
                          Header Image Live Preview
                        </label>
                        <div className="aspect-16/9 rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 relative shadow-xs">
                          {featuredImage ? (
                            <img
                              src={featuredImage}
                              alt="Featured Article Header"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                              <ImageIcon className="w-8 h-8" />
                              <span>No header image specified</span>
                            </div>
                          )}
                        </div>
                        {featuredImage && (
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Image attached successfully
                            </span>
                            <button
                              type="button"
                              onClick={() => setFeaturedImage('')}
                              className="text-[11px] text-rose-600 hover:underline font-semibold"
                            >
                              Remove Image
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. PRODUCT SPOTLIGHT & AMAZON BUY BOX TAB */}
              {activeTab === 'spotlight' && (
                <div className="space-y-6 text-xs">
                  <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl border border-slate-700 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700">
                      <div>
                        <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-emerald-400" />
                          <span>Embed Amazon Product Spotlight & Affiliate Buy Box</span>
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Highlights a specific product with high-converting CTA, verified pricing, score badge, and compliant Amazon affiliate link.
                        </p>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-600 self-start sm:self-auto">
                        <input
                          type="checkbox"
                          checked={hasSpotlight}
                          onChange={(e) => setHasSpotlight(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                        />
                        <span className="font-bold text-emerald-300 text-xs">
                          {hasSpotlight ? 'Spotlight Enabled' : 'Disabled'}
                        </span>
                      </label>
                    </div>

                    {hasSpotlight && (
                      <div className="space-y-5">
                        {/* Source switch */}
                        <div className="flex items-center gap-4 text-xs font-semibold">
                          <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                            <input
                              type="radio"
                              name="modalSpotlightSource"
                              checked={spotlightSource === 'catalog'}
                              onChange={() => setSpotlightSource('catalog')}
                            />
                            <span>Option 1: Choose from Catalog Products</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                            <input
                              type="radio"
                              name="modalSpotlightSource"
                              checked={spotlightSource === 'custom'}
                              onChange={() => setSpotlightSource('custom')}
                            />
                            <span>Option 2: Enter Custom Product & Image</span>
                          </label>
                        </div>

                        {spotlightSource === 'catalog' ? (
                          <div className="space-y-3">
                            <label className="font-bold text-slate-200 block">
                              Select Catalog Product
                            </label>
                            <select
                              value={selectedProductId}
                              onChange={(e) => setSelectedProductId(e.target.value)}
                              className="w-full p-3 bg-slate-800 border border-slate-600 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-400"
                            >
                              <option value="">-- Choose a product from catalog --</option>
                              {catalogProducts.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} ({p.brand}) — ${p.price?.toFixed(2) || 'N/A'} [{p.categoryName}]
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="font-bold text-slate-200 block mb-1">
                                Product Name *
                              </label>
                              <input
                                type="text"
                                value={customSpotlight.productName}
                                onChange={(e) =>
                                  setCustomSpotlight({
                                    ...customSpotlight,
                                    productName: e.target.value,
                                  })
                                }
                                placeholder="e.g. Samsung Galaxy S24 Ultra"
                                className="w-full p-2 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                              />
                            </div>

                            <div>
                              <label className="font-bold text-slate-200 block mb-1">
                                Brand Name
                              </label>
                              <input
                                type="text"
                                value={customSpotlight.brand || ''}
                                onChange={(e) =>
                                  setCustomSpotlight({
                                    ...customSpotlight,
                                    brand: e.target.value,
                                  })
                                }
                                placeholder="e.g. Samsung"
                                className="w-full p-2 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                              />
                            </div>

                            <div>
                              <label className="font-bold text-slate-200 block mb-1">
                                Amazon ASIN (10 characters)
                              </label>
                              <input
                                type="text"
                                value={customSpotlight.asin || ''}
                                onChange={(e) =>
                                  setCustomSpotlight({
                                    ...customSpotlight,
                                    asin: e.target.value,
                                  })
                                }
                                placeholder="e.g. B0CQ2LPHJ7"
                                className="w-full p-2 bg-slate-800 border border-slate-600 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-400"
                              />
                            </div>

                            <div>
                              <label className="font-bold text-slate-200 block mb-1">
                                Verified Amazon Price ($)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={customSpotlight.price || ''}
                                onChange={(e) =>
                                  setCustomSpotlight({
                                    ...customSpotlight,
                                    price: parseFloat(e.target.value) || 0,
                                  })
                                }
                                placeholder="1199.99"
                                className="w-full p-2 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-bold text-slate-200">
                                  Spotlight Product Image
                                </label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  ref={spotlightFileInputRef}
                                  onChange={(e) =>
                                    handleFileChange(e, (dataUrl) =>
                                      setCustomSpotlight({
                                        ...customSpotlight,
                                        productImageUrl: dataUrl,
                                      })
                                    )
                                  }
                                  className="hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => spotlightFileInputRef.current?.click()}
                                  className="text-[11px] text-emerald-400 hover:underline font-bold flex items-center gap-1"
                                >
                                  <Upload className="w-3 h-3" /> Upload File
                                </button>
                              </div>
                              <input
                                type="url"
                                value={customSpotlight.productImageUrl || ''}
                                onChange={(e) =>
                                  setCustomSpotlight({
                                    ...customSpotlight,
                                    productImageUrl: e.target.value,
                                  })
                                }
                                placeholder="https://... or click 'Upload File'"
                                className="w-full p-2 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                              />
                            </div>
                          </div>
                        )}

                        {/* Live Mini Preview of Buy Box */}
                        {currentSpotlightPreview && (
                          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-700/80 space-y-3">
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span>Buy Box Preview:</span>
                              <span className="text-emerald-400 font-bold">★ Active in Article</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <img
                                src={currentSpotlightPreview.productImageUrl || featuredImage}
                                alt={currentSpotlightPreview.productName}
                                className="w-14 h-14 object-cover rounded-xl bg-slate-800 border border-slate-700 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-white text-xs truncate">
                                  {currentSpotlightPreview.productName || 'Product Title'}
                                </p>
                                <p className="text-[11px] text-emerald-400 font-bold">
                                  {currentSpotlightPreview.price
                                    ? `$${currentSpotlightPreview.price.toFixed(2)}`
                                    : 'Check Amazon'}
                                  {currentSpotlightPreview.asin && (
                                    <span className="text-slate-400 font-normal ml-2">
                                      ASIN: {currentSpotlightPreview.asin}
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shrink-0">
                                Check Price on Amazon →
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'content') setActiveTab('featured_image');
                      else if (activeTab === 'featured_image') setActiveTab('spotlight');
                      else setActiveTab('content');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                  >
                    Next Step →
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-700/20 transition-all hover:scale-102"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{initialPost?.id ? 'Save Changes' : 'Publish Blog Post'}</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* LIVE PREVIEW MODE */
            <div className="max-w-3xl mx-auto space-y-6 py-2">
              <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs flex items-center justify-between">
                <span>
                  <strong>Live Preview:</strong> This is how your blog post and product images will look when published.
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode('edit')}
                  className="font-bold underline hover:text-emerald-950"
                >
                  Return to Editor
                </button>
              </div>

              {/* Simulated Article Header */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md uppercase text-[10px]">
                    {category || 'Technology'}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {readTime} min read
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif-editorial leading-tight">
                  {title || 'Untitled Article'}
                </h1>

                {excerpt && (
                  <p className="text-sm text-slate-600 leading-relaxed font-sans">
                    {excerpt}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>By {authorName} ({authorRole})</span>
                </div>
              </div>

              {/* Featured Image */}
              {featuredImage && (
                <div className="aspect-16/9 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                  <img
                    src={featuredImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Markdown Body Rendering */}
              <div className="prose-editorial bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <ReactMarkdown
                  components={{
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-xl font-bold text-slate-900 pt-3 pb-1 border-b border-slate-100 font-serif-editorial"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-lg font-bold text-slate-800 pt-2 font-serif-editorial"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-slate-700 leading-relaxed text-sm" {...props} />
                    ),
                    img: ({ node, ...props }) => (
                      <div className="my-4 space-y-1.5">
                        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                          <img
                            className="w-full max-h-96 object-cover"
                            {...props}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        {props.alt && (
                          <p className="text-[11px] text-slate-500 italic text-center">
                            Photo: {props.alt}
                          </p>
                        )}
                      </div>
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside text-sm space-y-1 text-slate-700" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-emerald-500 pl-4 py-1 italic text-slate-600 bg-emerald-50/50 rounded-r-xl my-2 text-sm"
                        {...props}
                      />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>

              {/* Spotlight Live Preview */}
              {currentSpotlightPreview && (
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Featured Product Spotlight</span>
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 font-black rounded-lg text-xs">
                      {currentSpotlightPreview.editorScore?.toFixed(1) || '9.2'} / 10
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <img
                      src={currentSpotlightPreview.productImageUrl || featuredImage}
                      alt={currentSpotlightPreview.productName}
                      className="w-full sm:w-36 h-36 object-cover rounded-2xl bg-slate-800 border border-slate-700"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-lg text-white">
                        {currentSpotlightPreview.productName}
                      </h3>
                      <p className="text-xs text-slate-300">
                        {currentSpotlightPreview.shortVerdict}
                      </p>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xl font-black text-emerald-400">
                          {currentSpotlightPreview.price
                            ? `$${currentSpotlightPreview.price.toFixed(2)}`
                            : 'Check Amazon'}
                        </span>
                        <div className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5">
                          <span>Check Price on Amazon</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
