import React, { useState } from 'react';
import {
  Compass,
  Mail,
  ShieldCheck,
  ExternalLink,
  Heart,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { StorageService } from '../lib/storage';
import { AMAZON_STANDARD_DISCLOSURE } from '../lib/amazon';

interface FooterProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const settings = StorageService.getSettings();
  const categories = StorageService.getCategories();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSubmitting(true);
    try {
      StorageService.addSubscriber(email, window.location.pathname);
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => {});
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer id="site-footer" className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {settings.siteName}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {settings.siteDescription} We rigorously test and evaluate products so you don&apos;t have to waste time or money on buyer&apos;s remorse.
            </p>

            {/* Newsletter form */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                Get Weekly Product Roundups
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold bg-emerald-950/60 border border-emerald-800/60 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You&apos;re on the list! Check your inbox for our latest buying guides.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email..."
                    className="bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 flex-1"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors shrink-0 disabled:opacity-50"
                  >
                    {submitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              )}
              <p className="text-[11px] text-slate-400 mt-1.5">No spam ever. Unsubscribe with a single click anytime.</p>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Top Categories</h4>
            <ul className="space-y-2.5 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('category-detail', { slug: cat.slug })}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Editorial</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('guides')} className="hover:text-white transition-colors">
                  Buying Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  All Product Reviews
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare')} className="hover:text-white transition-colors">
                  Comparison Matrix
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('recommend')} className="hover:text-white transition-colors">
                  Smart Product Finder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors">
                  Tech & Gear Blog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Our Team
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Legal Col */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Trust & Policies</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('affiliate-disclosure')} className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy-policy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cookie-policy')} className="hover:text-white transition-colors">
                  Cookie Preferences
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('disclaimer')} className="hover:text-white transition-colors">
                  Editorial Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact Editorial Desk
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Amazon Associates Disclosure Section */}
        <div className="py-8 border-b border-slate-800/80 text-xs leading-relaxed text-slate-400">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Amazon Associates Compliance & Pricing Disclosure</span>
            </div>
            <p>
              &ldquo;{settings.affiliateDisclosureText || AMAZON_STANDARD_DISCLOSURE}&rdquo;
            </p>
            <p className="text-slate-400">
              Product prices and availability are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on Amazon at the time of purchase will apply to the purchase of this product. SmartPick Guide is an independent editorial entity and does not represent or claim affiliation as an official Amazon enterprise.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('privacy-policy')} className="hover:text-slate-400">
              Privacy
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-slate-400">
              Terms
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('admin')} className="hover:text-emerald-400 font-medium">
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
