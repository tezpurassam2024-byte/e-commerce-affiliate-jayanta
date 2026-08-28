import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  Clock,
  User,
  Share2,
  Tag,
  ShieldCheck,
  ExternalLink,
  CheckCircle,
  XCircle,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  MessageCircle,
  Globe,
  Mail,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { StorageService } from '../lib/storage';
import { BlogPost, Product, SiteSettings } from '../types';
import { buildAmazonAffiliateUrl, getPriceDisclaimer } from '../lib/amazon';
import { ShareModal } from '../components/ShareModal';
import { copyToClipboard, buildShareUrl, getSocialShareLinks, triggerNativeShare } from '../lib/share';

interface BlogDetailPageProps {
  slug: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const allPosts = StorageService.getBlogPosts();
    const found = allPosts.find((p) => p.slug === slug || p.id === slug);
    if (found) {
      setPost(found);

      // Find matching catalog product if linked
      const targetProdId = found.featuredProductId || found.productSpotlight?.productId;
      if (targetProdId) {
        const prod = StorageService.getProductById(targetProdId);
        if (prod) {
          setFeaturedProduct(prod);
        }
      }
    }
    setSettings(StorageService.getSettings());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Article Not Found</h2>
        <button
          onClick={() => onNavigate('blog')}
          className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 transition-colors"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  const shareUrl = buildShareUrl('blog', post.slug);
  const socialLinks = getSocialShareLinks({
    title: post.title,
    text: post.excerpt,
    url: shareUrl,
  });

  const handleShareClick = async () => {
    // If native share is available on mobile, try it; otherwise open share modal
    if (typeof navigator !== 'undefined' && navigator.share) {
      const shared = await triggerNativeShare({
        title: post.title,
        text: post.excerpt,
        url: shareUrl,
      });
      if (shared) return;
    }
    setShareModalOpen(true);
  };

  const handleDirectCopy = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Resolve spotlight information
  const spotlight = post.productSpotlight || (featuredProduct ? {
    productId: featuredProduct.id,
    productName: featuredProduct.name,
    brand: featuredProduct.brand,
    productImageUrl: featuredProduct.imageUrl,
    price: featuredProduct.price,
    asin: featuredProduct.asin,
    editorScore: featuredProduct.editorScore,
    badgeText: featuredProduct.bestFor || 'Editor Recommended',
    shortVerdict: featuredProduct.verdict || featuredProduct.shortDescription,
    pros: featuredProduct.pros.slice(0, 3),
    cons: featuredProduct.cons.slice(0, 2),
    ctaText: settings.defaultCtaText || 'Check Price on Amazon',
  } : null);

  const affiliateUrl = spotlight
    ? (spotlight.affiliateUrl || buildAmazonAffiliateUrl({
        asin: spotlight.asin,
        name: spotlight.productName,
      }))
    : '#';

  const handleAffiliateClick = () => {
    if (spotlight) {
      StorageService.recordAffiliateClick({
        productId: spotlight.productId || spotlight.asin || 'blog-spotlight',
        productName: spotlight.productName,
        placement: 'blog_post_spotlight',
        pagePath: `/blog/${post.slug}`,
        asin: spotlight.asin,
        marketplace: settings.amazonMarketplace,
      });
    }
  };

  return (
    <>
      <article id={`blog-detail-${post.slug}`} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto">
          <button onClick={() => onNavigate('home')} className="hover:text-slate-900">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => onNavigate('blog')} className="hover:text-slate-900">
            Blog
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800 truncate">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-serif-editorial">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author info & Header Share Action */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">{post.author.name}</p>
                <p className="text-[11px] text-slate-400">
                  {post.author.role} • Published {new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="blog-direct-copy-btn"
                onClick={handleDirectCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                title="Copy link to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <button
                id="blog-header-share-btn"
                onClick={handleShareClick}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:scale-102"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Article</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Header Image */}
        <div className="aspect-16/9 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
          <img
            src={post.featuredImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* MAIN ARTICLE BODY */}
        <div className="prose-editorial bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <ReactMarkdown
            components={{
              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl sm:text-3xl font-bold text-slate-900 pt-6 pb-2 border-b border-slate-100 font-serif-editorial first:pt-0"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-xl sm:text-2xl font-bold text-slate-800 pt-4 pb-1 font-serif-editorial"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="text-slate-700 leading-relaxed text-base sm:text-lg mb-4" {...props} />
              ),
              img: ({ node, ...props }) => (
                <figure className="my-6 space-y-2">
                  <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs max-h-[500px] flex items-center justify-center">
                    <img
                      className="w-full h-auto max-h-[500px] object-cover hover:scale-101 transition-transform duration-300"
                      {...props}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  {props.alt && (
                    <figcaption className="text-xs text-slate-500 text-center font-medium">
                      {props.alt}
                    </figcaption>
                  )}
                </figure>
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside space-y-2 text-slate-700 text-base my-4 pl-2" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside space-y-2 text-slate-700 text-base my-4 pl-2" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-emerald-500 pl-4 py-2 italic text-slate-700 bg-emerald-50/50 rounded-r-2xl my-6 text-base"
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-bold text-slate-900" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-emerald-700 hover:text-emerald-800 underline font-semibold"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  {...props}
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* BOTTOM SOCIAL SHARING & COMMUNITY BAR */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Found this review helpful? Share with friends</span>
              </h3>
              <p className="text-xs text-slate-500">
                Help fellow buyers make informed hardware and smartphone decisions.
              </p>
            </div>

            <button
              onClick={handleDirectCopy}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Article Link'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* WhatsApp */}
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 text-xs font-bold transition-all hover:scale-102"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* X / Twitter */}
            <a
              href={socialLinks.x}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all hover:scale-102"
            >
              <span className="font-mono text-sm leading-none">𝕏</span>
              <span>Post</span>
            </a>

            {/* Facebook */}
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/60 text-xs font-bold transition-all hover:scale-102"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Facebook</span>
            </a>

            {/* LinkedIn */}
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200/60 text-xs font-bold transition-all hover:scale-102"
            >
              <ExternalLink className="w-4 h-4 text-sky-600" />
              <span>LinkedIn</span>
            </a>

            {/* Email */}
            <a
              href={socialLinks.email}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all hover:scale-102"
            >
              <Mail className="w-4 h-4 text-slate-600" />
              <span>Email</span>
            </a>

            {/* More / Modal trigger */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors ml-auto"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>More Options</span>
            </button>
          </div>
        </div>

        {/* EMBEDDED PRODUCT SPOTLIGHT & AFFILIATE CALLOUT BOX */}
        {spotlight && (
          <div
            id={`blog-product-spotlight-${spotlight.asin || 'card'}`}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/80 relative overflow-hidden"
          >
            {/* Subtle Background Glow */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Product Spotlight</span>
                </span>
                {spotlight.badgeText && (
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[11px] font-semibold">
                    {spotlight.badgeText}
                  </span>
                )}
              </div>

              {spotlight.editorScore && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Editor Score:</span>
                  <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 font-black rounded-lg text-sm">
                    {spotlight.editorScore.toFixed(1)} / 10
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Product Image */}
              <div className="md:col-span-4 bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-center">
                <img
                  src={spotlight.productImageUrl}
                  alt={spotlight.productName}
                  referrerPolicy="no-referrer"
                  className="max-h-48 w-auto object-contain rounded-xl drop-shadow-md hover:scale-105 transition-transform"
                />
              </div>

              {/* Product Summary Details */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  {spotlight.brand && (
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                      {spotlight.brand}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                    {spotlight.productName}
                  </h3>
                </div>

                {spotlight.shortVerdict && (
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {spotlight.shortVerdict}
                  </p>
                )}

                {/* Pros & Cons Preview */}
                {(spotlight.pros || spotlight.cons) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    {spotlight.pros && spotlight.pros.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">Highlights</p>
                        {spotlight.pros.slice(0, 2).map((pro, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-slate-200">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{pro}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {spotlight.cons && spotlight.cons.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">Considerations</p>
                        {spotlight.cons.slice(0, 2).map((con, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-slate-300">
                            <XCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{con}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Price & Action Button */}
                <div className="pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    {typeof spotlight.price === 'number' ? (
                      <div>
                        <div className="text-2xl font-black text-white">
                          ${spotlight.price.toFixed(2)}
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {getPriceDisclaimer()}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">Check Amazon for live pricing & promotions</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {featuredProduct && (
                      <button
                        onClick={() => onNavigate('product-detail', { slug: featuredProduct.slug })}
                        className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <span>Full Review</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <a
                      href={affiliateUrl}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      onClick={handleAffiliateClick}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{spotlight.ctaText || settings.defaultCtaText || 'Check Price on Amazon'}</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>
                  </div>
                </div>

                {/* Direct Affiliate Hyperlink */}
                <div className="pt-2 border-t border-slate-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] text-slate-400">
                  <span>Direct Amazon Link:</span>
                  <a
                    href={affiliateUrl}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    onClick={handleAffiliateClick}
                    className="text-amber-400 hover:text-amber-300 font-mono font-bold hover:underline inline-flex items-center gap-1 break-all"
                  >
                    <span>{affiliateUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
            <Tag className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-600">Tags:</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FTC / Amazon Affiliate Statement */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-700 mb-0.5">Editorial Integrity & Affiliate Notice</p>
            <p>{settings.affiliateDisclosureText}</p>
          </div>
        </div>
      </article>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareData={{
          title: post.title,
          text: post.excerpt,
          url: shareUrl,
          category: post.category,
        }}
      />
    </>
  );
};
