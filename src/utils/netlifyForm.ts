export const NETLIFY_FORM_NAME = 'quote-request';
export const NETLIFY_FORM_ACTION = '/';
export const NETLIFY_HONEYPOT_FIELD = 'bot-field';

/**
 * Exact set of field names registered at build time in index.html & contact-us.html.
 * Netlify's build parser drops any submitted field not present in this schema.
 */
export const NETLIFY_REGISTERED_FIELDS = [
  'form-name',
  'bot-field',
  'name',
  'email',
  'phone',
  'message',
  'source',
  'page_url'
] as const;

export type NetlifyFieldKey = (typeof NETLIFY_REGISTERED_FIELDS)[number];

export interface QuoteFormInput {
  name: string;
  email: string;
  phone: string;
  message: string;
  source?: string;
  pageUrl?: string;
  botField?: string;
}

export interface QuoteFormValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateQuoteFields(data: Pick<QuoteFormInput, 'name' | 'email' | 'phone' | 'message'>): {
  isValid: boolean;
  errors: QuoteFormValidationErrors;
} {
  const errors: QuoteFormValidationErrors = {};

  const trimmedName = data.name.trim();
  if (!trimmedName || trimmedName.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }

  const trimmedEmail = data.email.trim();
  if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  const rawPhoneDigits = data.phone.replace(/\D/g, '');
  if (!rawPhoneDigits || rawPhoneDigits.length < 10) {
    errors.phone = 'Please enter a valid 10-digit phone number.';
  }

  const trimmedMessage = data.message.trim();
  if (!trimmedMessage || trimmedMessage.length < 10) {
    errors.message = 'Tell us a little about your home or space (at least 10 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function resolveCurrentPageUrl(): string {
  if (typeof window === 'undefined' || !window.location) {
    return '/';
  }
  return `${window.location.pathname || '/'}${window.location.search || ''}`;
}

export function buildNetlifyFormPayload(input: QuoteFormInput): string {
  const params = new URLSearchParams();
  params.set('form-name', NETLIFY_FORM_NAME);
  params.set(NETLIFY_HONEYPOT_FIELD, input.botField ?? '');
  params.set('name', input.name.trim());
  params.set('email', input.email.trim());
  params.set('phone', input.phone.trim());
  params.set('message', input.message.trim());
  params.set('source', (input.source || 'General').trim());
  params.set('page_url', (input.pageUrl || resolveCurrentPageUrl()).trim() || '/');
  return params.toString();
}

export interface SubmitNetlifyResult {
  honeypotTripped: boolean;
  payload: string;
}

export async function submitNetlifyQuoteForm(
  input: QuoteFormInput,
  fetchImpl: typeof fetch = fetch
): Promise<SubmitNetlifyResult> {
  const payload = buildNetlifyFormPayload(input);

  // Silent honeypot protection: do not forward bot spam to Netlify quota
  if (input.botField && input.botField.trim().length > 0) {
    return { honeypotTripped: true, payload };
  }

  const response = await fetchImpl(NETLIFY_FORM_ACTION, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload
  });

  if (!response.ok && response.type !== 'opaqueredirect') {
    throw new Error(`Netlify form submission rejected with HTTP ${response.status}`);
  }

  return { honeypotTripped: false, payload };
}
