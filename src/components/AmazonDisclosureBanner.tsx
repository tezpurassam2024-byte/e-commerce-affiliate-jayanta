import React, { useState } from 'react';
import { Info, ExternalLink, X } from 'lucide-react';
import { StorageService } from '../lib/storage';

interface AmazonDisclosureBannerProps {
  onNavigate?: (page: string) => void;
}

export const AmazonDisclosureBanner: React.FC<AmazonDisclosureBannerProps> = ({ onNavigate }) => {
  const [dismissed, setDismissed] = useState(false);
  const settings = StorageService.getSettings();

  if (dismissed) return null;

  return (
    <div id="amazon-associates-disclosure" className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800 py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <p className="truncate sm:text-clip">
            <span className="font-semibold text-slate-100">Affiliate Disclosure:</span> As an Amazon Associate I earn from qualifying purchases.{' '}
            <button
              onClick={() => onNavigate?.('affiliate-disclosure')}
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-1 inline-flex items-center gap-0.5"
            >
              Learn more <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
          className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
