import React from 'react';
import { ShieldCheck, Info, ExternalLink, Award, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { AMAZON_STANDARD_DISCLOSURE, AMAZON_COMPREHENSIVE_DISCLOSURE } from '../lib/amazon';

interface AffiliateDisclosurePageProps {
  onNavigate: (page: string) => void;
}

export const AffiliateDisclosurePage: React.FC<AffiliateDisclosurePageProps> = ({ onNavigate }) => {
  const settings = StorageService.getSettings();

  return (
    <div id="affiliate-disclosure-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Transparency & FTC Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
          Amazon Associates & Affiliate Disclosure
        </h1>
        <p className="text-slate-500 text-xs">
          Last Updated: February 2026 • Effective Immediately
        </p>
      </div>

      {/* Official Amazon Associates Declaration Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base">
          <Award className="w-5 h-5" />
          <span>Official Amazon Associates Operating Agreement Declaration</span>
        </div>
        <blockquote className="text-lg sm:text-xl font-serif-editorial italic text-slate-200 border-l-4 border-emerald-500 pl-4 py-1">
          &ldquo;{settings.affiliateDisclosureText || AMAZON_STANDARD_DISCLOSURE}&rdquo;
        </blockquote>
        <p className="text-xs text-slate-400 leading-relaxed">
          {settings.siteName} is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com, Amazon.co.uk, Amazon.ca, and affiliated Amazon marketplaces worldwide.
        </p>
      </div>

      {/* Explanation Sections */}
      <div className="prose-editorial bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 space-y-6">
        <section>
          <h2>How Affiliate Links Work</h2>
          <p>
            When you read our reviews, product comparisons, or buying guides and click a link to view a product on Amazon, that link contains a unique tracking tag ({settings.amazonAssociateTag || 'smartpick-20'}). If you choose to make a purchase after clicking our link, Amazon pays us a small percentage referral commission.
          </p>
          <p>
            <strong>This commission comes at zero additional cost to you.</strong> You pay the exact same price you would pay if you had navigated to Amazon directly.
          </p>
        </section>

        <section>
          <h2>Does Affiliate Compensation Influence Our Ratings?</h2>
          <p>
            <strong>No. Absolutely not.</strong> Our editorial team operates with total independence from affiliate partnerships.
          </p>
          <ul>
            <li>We do not accept paid placements to rank a product higher.</li>
            <li>We do not accept compensation in exchange for positive reviews.</li>
            <li>If a product is defective, ergonomically flawed, or overpriced, we state so directly in our Cons section.</li>
            <li>If a recommended product is returned by a buyer because it did not meet expectations, we earn no commission. Our sole business incentive is recommending products you will genuinely keep and enjoy.</li>
          </ul>
        </section>

        <section>
          <h2>Pricing & Real-Time Availability Transparency</h2>
          <p>
            Amazon prices and stock availability fluctuate dynamically due to algorithmic pricing and merchant inventory. While we record and display the price at the time of our testing, <strong>the price displayed on Amazon at the time of your checkout will always govern your purchase.</strong>
          </p>
        </section>

        <section>
          <h2>Questions or Corrections?</h2>
          <p>
            If you have questions about our affiliate disclosure or notice any inaccurate link, please reach out to our editorial desk directly on our{' '}
            <button
              onClick={() => onNavigate('contact')}
              className="text-emerald-700 font-bold underline"
            >
              Contact Page
            </button>
            .
          </p>
        </section>
      </div>
    </div>
  );
};
