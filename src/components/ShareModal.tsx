import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Mail,
  MessageCircle,
  Globe,
  Smartphone,
} from 'lucide-react';
import { copyToClipboard, getSocialShareLinks, triggerNativeShare, ShareDataOptions } from '../lib/share';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: ShareDataOptions;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const socialLinks = getSocialShareLinks(shareData);
  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleCopy = async () => {
    const success = await copyToClipboard(shareData.url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    const shared = await triggerNativeShare(shareData);
    if (shared) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                Share Article
              </h3>
              <p className="text-xs text-slate-500">
                Share this review & verified buying guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Title Preview */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
          <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
            {shareData.title}
          </p>
          {shareData.category && (
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {shareData.category}
            </span>
          )}
        </div>

        {/* Copy Link Input & Button */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Direct Article Link
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 focus-within:border-emerald-500 transition-colors">
            <input
              type="text"
              readOnly
              value={shareData.url}
              className="flex-1 bg-transparent px-2.5 text-xs text-slate-700 font-mono outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1 animate-in fade-in duration-200">
              <Check className="w-3 h-3" /> Link copied to your clipboard!
            </p>
          )}
        </div>

        {/* Social Share Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            Share directly to
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {/* WhatsApp */}
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 transition-all hover:scale-103 group"
            >
              <MessageCircle className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform text-emerald-600" />
              <span className="text-[10px] font-bold">WhatsApp</span>
            </a>

            {/* X / Twitter */}
            <a
              href={socialLinks.x}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white transition-all hover:scale-103 group"
            >
              <span className="font-extrabold text-sm mb-0.5 leading-none">𝕏</span>
              <span className="text-[10px] font-bold">Post</span>
            </a>

            {/* Facebook */}
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/60 transition-all hover:scale-103 group"
            >
              <Globe className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform text-blue-600" />
              <span className="text-[10px] font-bold">Facebook</span>
            </a>

            {/* LinkedIn */}
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200/60 transition-all hover:scale-103 group"
            >
              <ExternalLink className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform text-sky-600" />
              <span className="text-[10px] font-bold">LinkedIn</span>
            </a>

            {/* Reddit */}
            <a
              href={socialLinks.reddit}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200/60 transition-all hover:scale-103 group"
            >
              <Globe className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform text-orange-600" />
              <span className="text-[10px] font-bold">Reddit</span>
            </a>

            {/* Telegram */}
            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200/60 transition-all hover:scale-103 group"
            >
              <MessageCircle className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform text-cyan-600" />
              <span className="text-[10px] font-bold">Telegram</span>
            </a>

            {/* Email */}
            <a
              href={socialLinks.email}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all hover:scale-103 group col-span-2"
            >
              <Mail className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform text-slate-600" />
              <span className="text-[10px] font-bold">Email to Friend</span>
            </a>
          </div>
        </div>

        {/* Native Mobile Share fallback if available */}
        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Smartphone className="w-4 h-4" />
            <span>Open System Share Menu</span>
          </button>
        )}
      </div>
    </div>
  );
};
