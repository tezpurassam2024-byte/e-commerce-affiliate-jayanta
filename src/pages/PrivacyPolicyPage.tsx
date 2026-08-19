import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { StorageService } from '../lib/storage';

export const PrivacyPolicyPage: React.FC = () => {
  const settings = StorageService.getSettings();

  return (
    <div id="privacy-policy-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>User Privacy & Data Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
          Privacy Policy
        </h1>
        <p className="text-slate-500 text-xs">
          Last Updated: February 2026 • Compliant with GDPR, CCPA, and ePrivacy Directive
        </p>
      </div>

      <div className="prose-editorial bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 space-y-6">
        <section>
          <h2>1. Introduction</h2>
          <p>
            {settings.siteName} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and is committed to protecting the personal data of our visitors. This Privacy Policy explains what information we collect, how it is processed, and your rights under data privacy laws.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We believe in data minimization. We only collect information strictly necessary to provide our service:</p>
          <ul>
            <li><strong>Analytics Data:</strong> If you grant cookie consent, we collect anonymous aggregate metrics such as pages viewed, device type, and referral sources via Google Analytics 4 (with IP anonymization enabled).</li>
            <li><strong>Newsletter Subscriptions:</strong> If you voluntarily enter your email to receive product roundups, we store your email address solely for delivering updates. We will never sell or rent your email address.</li>
            <li><strong>Contact Inquiries:</strong> When you send a message through our contact form, we collect your name, email, and message content to respond to your inquiry.</li>
            <li><strong>Affiliate Link Telemetry:</strong> When you click outbound Amazon product links, an anonymous event is logged to measure aggregate popularity of reviewed items.</li>
          </ul>
        </section>

        <section>
          <h2>3. Cookies & Tracking Technologies</h2>
          <p>
            We use essential cookies to maintain site functionality (such as remembering your comparison tray and cookie preferences) and optional analytical cookies. You can modify or withdraw your cookie consent at any time via our Cookie Preferences bar.
          </p>
        </section>

        <section>
          <h2>4. Third-Party Links & Amazon</h2>
          <p>
            Our website contains links to Amazon.com and affiliated platforms. Once you click an outbound link to Amazon, their privacy policy and terms of service govern your interactions on their platform.
          </p>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>
            Depending on your jurisdiction (e.g., GDPR in the EU or CCPA in California), you have the right to request access to, correction of, or deletion of your personal data. Contact us at <code>privacy@{settings.siteName.toLowerCase().replace(/\s+/g, '')}.com</code> for any data privacy requests.
          </p>
        </section>
      </div>
    </div>
  );
};
