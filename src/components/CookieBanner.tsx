import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { initGA } from '../lib/analytics';

interface CookieBannerProps {
  onNavigate?: (page: string) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onNavigate }) => {
  const [consent, setConsent] = useState<'accepted' | 'rejected' | 'pending'>('pending');

  useEffect(() => {
    setConsent(StorageService.getCookieConsent());
  }, []);

  if (consent !== 'pending') return null;

  const handleAccept = () => {
    StorageService.setCookieConsent('accepted');
    setConsent('accepted');
    initGA();
  };

  const handleReject = () => {
    StorageService.setCookieConsent('rejected');
    setConsent('rejected');
  };

  return (
    <div
      id="cookie-consent-banner"
      className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl p-4 text-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs">
          <h4 className="font-bold text-slate-900 text-sm mb-1">Privacy & Cookie Preferences</h4>
          <p className="text-slate-600 leading-relaxed mb-3">
            We use privacy-friendly cookies and anonymous analytics to understand site performance and improve our buying guides. We do not sell your personal data.
          </p>
          <div className="flex items-center gap-2">
            <button
              id="accept-cookies-btn"
              onClick={handleAccept}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
            >
              Accept All
            </button>
            <button
              id="reject-cookies-btn"
              onClick={handleReject}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={() => onNavigate?.('cookie-policy')}
              className="text-slate-500 hover:text-slate-700 underline text-xs ml-auto"
            >
              Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
