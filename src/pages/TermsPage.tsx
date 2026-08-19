import React from 'react';
import { StorageService } from '../lib/storage';

export const TermsPage: React.FC = () => {
  const settings = StorageService.getSettings();

  return (
    <div id="terms-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
          Terms and Conditions
        </h1>
        <p className="text-slate-500 text-xs">Last Updated: February 2026</p>
      </div>

      <div className="prose-editorial bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 space-y-6">
        <section>
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using {settings.siteName}, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
          </p>
        </section>

        <section>
          <h2>2. Intellectual Property Rights</h2>
          <p>
            All editorial reviews, testing benchmarks, photography, comparison matrices, and proprietary analysis published on {settings.siteName} are the exclusive intellectual property of {settings.siteName}, unless otherwise noted. Unauthorized scraping, reproduction, or redistribution is strictly prohibited.
          </p>
        </section>

        <section>
          <h2>3. Accuracy of Information & Disclaimer of Warranties</h2>
          <p>
            Our reviews reflect the honest opinions, test results, and evaluations of our editorial staff at the time of publication. Hardware specifications and prices are subject to change by manufacturers and retailers at any time. We make no warranty that product availability or prices displayed on our website will match current real-time prices on merchant platforms.
          </p>
        </section>

        <section>
          <h2>4. Limitation of Liability</h2>
          <p>
            In no event shall {settings.siteName} or its contributors be liable for any direct, indirect, incidental, or consequential damages resulting from your use of recommended products or reliance on information presented on this website.
          </p>
        </section>
      </div>
    </div>
  );
};
