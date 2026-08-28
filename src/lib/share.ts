/**
 * Utility functions for sharing blog posts, products, and guides
 * Works seamlessly in desktop browsers, mobile devices, and iframe environments
 */

export interface ShareDataOptions {
  title: string;
  text?: string;
  url: string;
  category?: string;
}

/**
 * Robust copy-to-clipboard with fallback support for iframes and sandboxed environments
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1. Try modern navigator.clipboard API if available
  if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard failed, falling back to execCommand:', err);
    }
  }

  // 2. Reliable Fallback using temporary textarea element
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('execCommand copy fallback failed:', err);
    return false;
  }
}

/**
 * Builds a shareable canonical URL that opens the exact content
 */
export function buildShareUrl(type: 'blog' | 'guide' | 'product' | 'page', slug?: string): string {
  const origin = window.location.origin;
  const pathname = window.location.pathname;

  if (type === 'blog' && slug) {
    return `${origin}${pathname}#blog/${slug}`;
  }
  if (type === 'guide' && slug) {
    return `${origin}${pathname}#guide/${slug}`;
  }
  if (type === 'product' && slug) {
    return `${origin}${pathname}#product/${slug}`;
  }
  if (slug) {
    return `${origin}${pathname}#${slug}`;
  }
  return `${origin}${pathname}`;
}

/**
 * Native Device Share Sheet trigger (if supported on mobile/tablet)
 */
export async function triggerNativeShare(options: ShareDataOptions): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.(options)) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text || options.title,
        url: options.url,
      });
      return true;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.warn('Native share error:', err);
      }
      return false;
    }
  }
  return false;
}

/**
 * Share direct URLs for social platforms
 */
export function getSocialShareLinks(options: ShareDataOptions) {
  const url = encodeURIComponent(options.url);
  const text = encodeURIComponent(options.text || options.title);
  const title = encodeURIComponent(options.title);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    x: `https://x.com/intent/tweet?text=${text}&url=${url}`,
    whatsapp: `https://api.whatsapp.com/send?text=${text}%20${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    reddit: `https://reddit.com/submit?url=${url}&title=${title}`,
    telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    email: `mailto:?subject=${title}&body=${text}%0A%0ARead%20the%20full%20article%20here:%20${url}`,
  };
}
