import React, { useState } from 'react';
import { Phone, CheckCircle2, AlertCircle, Send, Loader2, ShieldCheck } from 'lucide-react';
import { BUSINESS_NAP } from '../../data/siteData';
import { formatPhoneNumberInput } from '../../utils/estimatorLogic';

interface QuoteFormProps {
  onSuccess?: () => void;
  className?: string;
  source?: string;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ onSuccess, className = '', source = 'General' }) => {
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
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name (minimum 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    const rawPhone = formData.phone.replace(/\D/g, '');
    if (!rawPhone || rawPhone.length < 10) {
      newErrors.phone = 'Please provide a valid 10-digit phone number.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please describe your space or cleaning needs (minimum 10 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      const payload = new URLSearchParams();
      payload.append('form-name', 'quote-request');
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('message', formData.message);
      payload.append('source', source);

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      });

      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch {
      setIsSubmitted(true);
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
          id="quote-success-banner"
          className="form-feedback-banner form-feedback-success bg-[#e8f5ee] border border-[#12582e] rounded-2xl p-6 text-center block"
          role="alert"
          aria-live="polite"
        >
          <div className="banner-icon-wrapper w-12 h-12 mx-auto mb-4 bg-[#12582e] text-white rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="banner-title text-xl font-extrabold text-[#071536] mb-2">
            Quote Request Received
          </h3>
          <p id="quote-success-message" className="banner-message text-slate-700 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Thank you, <strong>{formData.name}</strong>! Your cleaning request has been logged. Our dispatch team will review your property details and call you shortly at <strong className="font-mono">{formData.phone}</strong>.
          </p>
          <div className="banner-cta flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`tel:${BUSINESS_NAP.phoneRaw}`}
              className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-2.5 px-5 rounded-xl text-sm inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Urgent Dispatch: {BUSINESS_NAP.phone}</span>
            </a>
            <button
              type="button"
              id="reset-quote-form"
              onClick={handleReset}
              className="btn btn-outline border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {submitError && (
        <div
          id="quote-error-banner"
          className="form-feedback-banner form-feedback-error bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-900 text-sm">Unable to submit online</h4>
            <p className="text-red-700 text-xs mt-1">
              Please call us directly at <a href={`tel:${BUSINESS_NAP.phoneRaw}`} className="underline font-bold">{BUSINESS_NAP.phone}</a>.
            </p>
          </div>
        </div>
      )}

      {/* Main Form */}
      {!isSubmitted && (
        <form
          id="lead-quote-form"
          data-react-managed="true"
          name="quote-request"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          noValidate
          className="lead-form space-y-4"
        >
          <input type="hidden" name="form-name" value="quote-request" />
          <input type="hidden" name="source" value={source} />

          {/* Honeypot for bots */}
          <p className="bot-field-container hidden" aria-hidden="true">
            <label>
              Do not fill this out:
              <input
                name="bot-field"
                value={formData.botField}
                onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </p>

          {/* Field 1: Full Name */}
          <div className="form-group" id="group-name">
            <label htmlFor="quote-name" className="form-label block text-xs font-bold text-[#071536] uppercase tracking-wider mb-1.5">
              Full Name <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <div className="input-wrapper relative">
              <input
                type="text"
                id="quote-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                aria-required="true"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={`form-control w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-200 bg-red-50/40'
                    : 'border-slate-300 focus:border-[#12582e] focus:ring-[#12582e]/20 bg-white'
                }`}
              />
            </div>
            {errors.name && (
              <span id="name-error" className="form-error-text block text-xs font-medium text-red-600 mt-1" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          {/* Field 2 & 3 Grid on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Field 2: Email */}
            <div className="form-group" id="group-email">
              <label htmlFor="quote-email" className="form-label block text-xs font-bold text-[#071536] uppercase tracking-wider mb-1.5">
                Email Address <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <div className="input-wrapper relative">
                <input
                  type="email"
                  id="quote-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                  maxLength={100}
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`form-control w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-200 bg-red-50/40'
                      : 'border-slate-300 focus:border-[#12582e] focus:ring-[#12582e]/20 bg-white'
                  }`}
                />
              </div>
              {errors.email && (
                <span id="email-error" className="form-error-text block text-xs font-medium text-red-600 mt-1" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Field 3: Phone Number */}
            <div className="form-group" id="group-phone">
              <label htmlFor="quote-phone" className="form-label block text-xs font-bold text-[#071536] uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <div className="input-wrapper relative">
                <input
                  type="tel"
                  id="quote-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="(561) 000-0000"
                  required
                  maxLength={14}
                  autoComplete="tel"
                  aria-required="true"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className={`form-control w-full px-4 py-3 rounded-xl border font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all tabular-nums ${
                    errors.phone
                      ? 'border-red-500 focus:ring-red-200 bg-red-50/40'
                      : 'border-slate-300 focus:border-[#12582e] focus:ring-[#12582e]/20 bg-white'
                  }`}
                />
              </div>
              {errors.phone && (
                <span id="phone-error" className="form-error-text block text-xs font-medium text-red-600 mt-1" role="alert">
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          {/* Field 4: Space Description */}
          <div className="form-group" id="group-message">
            <label htmlFor="quote-message" className="form-label block text-xs font-bold text-[#071536] uppercase tracking-wider mb-1.5">
              Property Scope &amp; Cleaning Requirements <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <div className="input-wrapper relative">
              <textarea
                id="quote-message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us your property type (office, medical, restaurant, residence), approximate square footage, and preferred schedule..."
                required
                minLength={10}
                maxLength={2000}
                aria-required="true"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className={`form-control form-textarea w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.message
                    ? 'border-red-500 focus:ring-red-200 bg-red-50/40'
                    : 'border-slate-300 focus:border-[#12582e] focus:ring-[#12582e]/20 bg-white'
                }`}
              />
            </div>
            {errors.message && (
              <span id="message-error" className="form-error-text block text-xs font-medium text-red-600 mt-1" role="alert">
                {errors.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions pt-2">
            <button
              type="submit"
              id="quote-submit-btn"
              disabled={isSubmitting}
              className="btn btn-primary btn-submit w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-[#12582e] hover:bg-[#0d4222] text-white font-bold text-base shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Estimate...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="btn-text">Request Free Estimate</span>
                </>
              )}
            </button>
            <p className="privacy-note text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5 m-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#12582e] shrink-0" />
              <span>100% Confidential · Same-Day Estimator Response</span>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
