import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { StorageService } from '../lib/storage';

export const DisclaimerPage: React.FC = () => {
  const settings = StorageService.getSettings();

  return (
    <div id="disclaimer-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold">
          <AlertCircle className="w-4 h-4 text-emerald-600" />
          <span>Editorial Policies & Legal Disclaimers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
          Editorial Disclaimer
        </h1>
        <p className="text-slate-500 text-xs">Last Updated: February 2026</p>
      </div>

      <div className="prose-editorial bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 space-y-6">
        <section>
          <h2>Independent Review Platform</h2>
          <p>
            {settings.siteName} is an independently owned and operated product review website. The opinions, ratings, and verdicts published on this site are solely those of our editors and authors.
          </p>
        </section>

        <section>
          <h2>No Official Amazon Endorsement</h2>
          <p>
            Amazon, the Amazon logo, and Amazon Associates are trademarks of Amazon.com, Inc. or its affiliates. {settings.siteName} is not owned, operated, or directly endorsed by Amazon.com, Inc.
          </p>
        </section>

        <section>
          <h2>Real-Time Pricing & Availability</h2>
          <p>
            Product prices and availability are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on Amazon at the time of purchase will apply to the purchase of this product.
          </p>
        </section>
      </div>
    </div>
  );
};
