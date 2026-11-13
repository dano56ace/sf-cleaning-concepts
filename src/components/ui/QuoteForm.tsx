import React, { useState } from 'react';
import { Phone, CheckCircle2, AlertCircle, Send, Loader2, ShieldCheck } from 'lucide-react';
import { BUSINESS_NAP } from '../../data/siteData';
import { formatPhoneNumberInput } from '../../utils/estimatorLogic';
import { trackLeadSubmission } from '../../utils/analytics';
import {
  NETLIFY_FORM_ACTION,
  NETLIFY_FORM_NAME,
  NETLIFY_HONEYPOT_FIELD,
  resolveCurrentPageUrl,
  submitNetlifyQuoteForm,
  validateQuoteFields
} from '../../utils/netlifyForm';

interface QuoteFormProps {
  onSuccess?: () => void;
  className?: string;
  source?: string;
  idPrefix?: string;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  onSuccess,
  className = '',
  source = 'General',
  idPrefix = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    botField: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formId = idPrefix ? `${idPrefix}lead-quote-form` : 'lead-quote-form';
  const nameId = idPrefix ? `${idPrefix}quote-name` : 'quote-name';
  const emailId = idPrefix ? `${idPrefix}quote-email` : 'quote-email';
  const phoneId = idPrefix ? `${idPrefix}quote-phone` : 'quote-phone';
  const messageId = idPrefix ? `${idPrefix}quote-message` : 'quote-message';
  const submitBtnId = idPrefix ? `${idPrefix}quote-submit-btn` : 'quote-submit-btn';
  const currentPageUrl = resolveCurrentPageUrl();

  // Auto-format phone as user types: (XXX) XXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumberInput(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const result = validateQuoteFields(formData);
    setErrors({ ...result.errors });
    return result.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Bot honeypot check
    if (formData.botField) {
      setIsSubmitted(true);
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitNetlifyQuoteForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source,
        pageUrl: resolveCurrentPageUrl(),
        botField: formData.botField
      });

      trackLeadSubmission({ source });
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      console.error('[QuoteForm] Submission error:', err);
      setSubmitError(
        'We couldn’t send your request online right now. Please try again or give us a quick call at (561) 704-5303.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '', message: '', botField: '' });
    setErrors({});
    setIsSubmitted(false);
    setSubmitError(null);
  };

  return (
    <div className={`quote-form-wrapper ${className}`}>
      {/* Success Banner */}
      {isSubmitted && (
        <div
          id={idPrefix ? `${idPrefix}quote-success-banner` : 'quote-success-banner'}
          className="form-feedback-banner form-feedback-success bg-[#e8f5ee] border border-[#12582e] rounded-2xl p-6 text-center block"
          role="alert"
          aria-live="polite"
        >
          <div className="banner-icon-wrapper w-12 h-12 mx-auto mb-4 bg-[#12582e] text-white rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="banner-title text-xl font-extrabold text-[#071536] mb-2">
            We Got Your Quote Request!
          </h3>
          <p
            id={idPrefix ? `${idPrefix}quote-success-message` : 'quote-success-message'}
            className="banner-message text-slate-700 text-sm max-w-md mx-auto mb-6 leading-relaxed"
          >
            Thanks so much, <strong>{formData.name}</strong>! Our friendly local team is reviewing your note right now and will call or text you shortly at <strong className="font-mono">{formData.phone}</strong>.
          </p>
          <div className="banner-cta flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`tel:${BUSINESS_NAP.phoneRaw}`}
              className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-2.5 px-5 rounded-xl text-sm inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us Now: {BUSINESS_NAP.phone}</span>
            </a>
            <button
              type="button"
              id={idPrefix ? `${idPrefix}reset-quote-form` : 'reset-quote-form'}
              onClick={handleReset}
              className="btn btn-outline border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Send Another Request
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {submitError && (
        <div
          id={idPrefix ? `${idPrefix}quote-error-banner` : 'quote-error-banner'}
          className="form-feedback-banner form-feedback-error bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-900 text-sm">Oops! Something went wrong</h4>
            <p className="text-red-700 text-xs mt-1">
              {submitError} You can also reach us directly at <a href={`tel:${BUSINESS_NAP.phoneRaw}`} className="underline font-bold">{BUSINESS_NAP.phone}</a>.
            </p>
          </div>
        </div>
      )}

      {/* Main Form */}
      {!isSubmitted && (
        <form
          id={formId}
          data-react-managed="true"
          name={NETLIFY_FORM_NAME}
          method="POST"
          action={NETLIFY_FORM_ACTION}
          data-netlify="true"
          data-netlify-honeypot={NETLIFY_HONEYPOT_FIELD}
          netlify-honeypot={NETLIFY_HONEYPOT_FIELD}
          onSubmit={handleSubmit}
          noValidate
          className="lead-form space-y-3.5"
        >
          <input type="hidden" name="form-name" value={NETLIFY_FORM_NAME} />
          <input type="hidden" name="source" value={source} />
          <input type="hidden" name="page_url" value={currentPageUrl} />

          {/* Honeypot for bots (hidden from human users) */}
          <p className="bot-field-container hidden" aria-hidden="true">
            <label>
              Do not fill this out:
              <input
                type="text"
                name={NETLIFY_HONEYPOT_FIELD}
                value={formData.botField}
                onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </p>

          {/* Field 1: Full Name */}
          <div className="form-group" id={idPrefix ? `${idPrefix}group-name` : 'group-name'}>
            <label htmlFor={nameId} className="form-label block text-xs font-bold text-[#071536] uppercase tracking-wider mb-1">
              Your Name <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <div className="input-wrapper relative">
              <input
                type="text"
                id={nameId}
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Jane Doe"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                aria-required="true"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${nameId}-error` : undefined}
                className={`form-control w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-200 bg-red-50/40'
                    : 'border-slate-300 focus:border-[#12582e] focus:ring-[#12582e]/20 bg-white'
                }`}
              />
            </div>
            {errors.name && (
              <span id={`${nameId}-error`} className="form-error-text block text-xs font-medium text-red-600 mt-1" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          {/* Field 2 & 3 Grid on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Field 2: Email */}
            <div className="form-group" id={idPrefix ? `${idPrefix}group-email` : 'group-email'}>
              <label htmlFor={emailId} className="form-label block text-xs font-bold text-[#071536] uppercase tracking-wider mb-1">
                Email Address <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <div className="input-wrapper relative">
                <input
                  type="email"
                  id={emailId}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="you@email.com"
                  required
                  maxLength={100}
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? `${emailId}-error` : undefined}
                  className={`form-control w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-200 bg-red-50/40'
                      : 'border-slate-300 focus:border-[#12582e] focus:ring-[#12582e]/20 bg-white'
                  }`}
                />
              </div>
              {errors.email && (
                <span id={`${emailId}-error`} className="form-error-text block text-xs font-medium text-red-600 mt-1" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Field 3: Phone Number */}
            <div className="form-group" id={idPrefix ? `${idPrefix}group-phone` : 'group-phone'}>
              <label htmlFor={phoneId} className="form-label block text-xs font-bold text-[#071536] uppercase tracking-wider mb-1">
                Phone Number <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <div className="input-wrapper relative">
                <input
                  type="tel"
                  id={phoneId}
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  disabled={isSubmitting}
                  placeholder="(561) 000-0000"
                  required
                  maxLength={14}
                  autoComplete="tel"
                  aria-required="true"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
                  className={`form-control w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all tabular-nums disabled:bg-slate-100 disabled:cursor-not-allowed ${
                    errors.phone
                      ? 'border-red-500 focus:ring-red-200 bg-red-50/40'
                      : 'border-slate-300 focus:border-[#12582e] focus:ring-[#12582e]/20 bg-white'
                  }`}
                />
              </div>
              {errors.phone && (
                <span id={`${phoneId}-error`} className="form-error-text block text-xs font-medium text-red-600 mt-1" role="alert">
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          {/* Field 4: Space Description */}
          <div className="form-group" id={idPrefix ? `${idPrefix}group-message` : 'group-message'}>
            <label htmlFor={messageId} className="form-label block text-xs font-bold text-[#071536] uppercase tracking-wider mb-1">
              How Can We Help You Shine? <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <div className="input-wrapper relative">
              <textarea
                id={messageId}
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Tell us about your home or space (bedrooms/baths or approx. size) and what kind of clean you’re looking for..."
                required
                minLength={10}
                maxLength={2000}
                aria-required="true"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? `${messageId}-error` : undefined}
                className={`form-control form-textarea w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed ${
                  errors.message
                    ? 'border-red-500 focus:ring-red-200 bg-red-50/40'
                    : 'border-slate-300 focus:border-[#12582e] focus:ring-[#12582e]/20 bg-white'
                }`}
              />
            </div>
            {errors.message && (
              <span id={`${messageId}-error`} className="form-error-text block text-xs font-medium text-red-600 mt-1" role="alert">
                {errors.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions pt-1">
            <button
              type="submit"
              id={submitBtnId}
              disabled={isSubmitting}
              className="btn btn-primary btn-submit w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-[#12582e] hover:bg-[#0d4222] text-white font-bold text-base shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending Your Request...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="btn-text">Get My Free Quote Now</span>
                </>
              )}
            </button>
            <p className="privacy-note text-center text-xs text-slate-500 mt-2.5 flex items-center justify-center gap-1.5 m-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#12582e] shrink-0" />
              <span>100% Free &amp; No Obligation · Fast Local Reply</span>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
