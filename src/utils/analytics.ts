export const GA_MEASUREMENT_ID = 'G-R1LCQWZJW0';

export type GtagFn = (
  command: 'config' | 'event' | 'js',
  targetOrEvent: string | Date,
  params?: Record<string, unknown>
) => void;

function resolveGtag(customGtag?: GtagFn): GtagFn | undefined {
  if (customGtag) return customGtag;
  if (typeof window !== 'undefined') {
    const win = window as Window & { gtag?: GtagFn };
    if (typeof win.gtag === 'function') {
      return win.gtag;
    }
  }
  return undefined;
}

export function extractTelNumber(href: string | null | undefined): string | null {
  if (!href) return null;
  const trimmed = href.trim();
  if (!trimmed.toLowerCase().startsWith('tel:')) return null;
  const raw = trimmed.slice(4).trim();
  return raw.length > 0 ? raw : null;
}

export function trackSpaPageView(
  pagePath: string,
  pageTitle: string,
  customGtag?: GtagFn
): boolean {
  const gtag = resolveGtag(customGtag);
  if (!gtag) return false;

  gtag('config', GA_MEASUREMENT_ID, {
    page_path: pagePath,
    page_title: pageTitle
  });
  return true;
}

export interface LeadEventOptions {
  source: string;
  pagePath?: string;
}

export function trackLeadSubmission(
  options: LeadEventOptions,
  customGtag?: GtagFn
): boolean {
  const gtag = resolveGtag(customGtag);
  if (!gtag) return false;

  const pagePath =
    options.pagePath ??
    (typeof window !== 'undefined' ? window.location.pathname : '/');

  gtag('event', 'generate_lead', {
    event_category: 'engagement',
    form_source: options.source || 'General',
    page_path: pagePath,
    currency: 'USD',
    value: 1
  });
  return true;
}

export interface ClickToCallOptions {
  phoneNumber: string;
  linkLocation?: string;
  pagePath?: string;
}

export function trackClickToCall(
  options: ClickToCallOptions,
  customGtag?: GtagFn
): boolean {
  const gtag = resolveGtag(customGtag);
  if (!gtag) return false;

  const pagePath =
    options.pagePath ??
    (typeof window !== 'undefined' ? window.location.pathname : '/');

  gtag('event', 'click_to_call', {
    event_category: 'engagement',
    phone_number: options.phoneNumber,
    link_location: options.linkLocation || 'page',
    page_path: pagePath
  });
  return true;
}
