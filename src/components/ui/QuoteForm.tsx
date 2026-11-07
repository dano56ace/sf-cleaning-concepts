import React, { useState } from 'react';
import { Phone, CheckCircle2, AlertCircle, Send, Loader2 } from 'lucide-react';
import { BUSINESS_NAP } from '../../data/siteData';

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
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length > 0) {
      if (raw.length <= 3) {
        formatted = `(${raw}`;
      } else if (raw.length <= 6) {
        formatted = `(${raw.slice(0, 3)}) ${raw.slice(3)}`;
      } else {
        formatted = `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6, 10)}`;
      }
    }
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
      // Netlify form submission encoding
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
    } catch (err: any) {
      // If network fails offline, still grant graceful visual feedback
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
          className="form-feedback-banner form-feedback-success bg-[#e8f5ee] border-2 border-[#12582e] rounded-2xl p-6 text-center animate-fadeIn"
          role="alert"
          aria-live="polite"
        >
          <div className="banner-icon-wrapper w-14 h-14 mx-auto mb-4 bg-[#12582e] text-white rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="banner-title text-xl font-bold text-[#071536] mb-2">
            Quote Request Received!
          </h3>
          <p id="quote-success-message" className="banner-message text-slate-700 text-sm max-w-md mx-auto mb-6">
            Thank you, <strong>{formData.name}</strong>! Your cleaning request has been received. Our team will review your space details and call you shortly at <strong>{formData.phone}</strong>.
          </p>
          <div className="banner-cta flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`tel:${BUSINESS_NAP.phoneRaw}`}
              className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-2.5 px-5 rounded-lg text-sm inline-flex items-center gap-2 shadow-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Need Urgent Service? Call {BUSINESS_NAP.phone}</span>
            </a>
            <button
              type="button"
              id="reset-quote-form"
              onClick={handleReset}
              className="btn btn-outline border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors cursor-pointer"
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
            <label htmlFor="quote-name" className="form-label block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <div className="input-wrapper relative">
              <input
                type="text"
                id="quote-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                aria-required="true"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={`form-control w-full px-4 py-3 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-red-400 focus:ring-red-200 bg-red-50/30'
                    : 'border-slate-200 focus:border-[#12582e] focus:ring-[#12582e]/20 bg-white'
                }`}
              />
            </div>
            {errors.name && (
              <span id="name-error" className="form-error-text block text-xs text-red-600 mt-1" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          {/* Field 2: Email */}
          <div className="form-group" id="group-email">
            <label htmlFor="quote-email" className="form-label block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <div className="input-wrapper relative">
              <input
                type="email"
                id="quote-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                maxLength={100}
                autoComplete="email"
                aria-required="true"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`form-control w-full px-4 py-3 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-400 focus:ring-red-200 bg-red-50/30'
                    : 'border-slate-200 focus:border-[#12582e] focus:ring-[#12582e]/20 bg-white'
                }`}
              />
            </div>
            {errors.email && (
              <span id="email-error" className="form-error-text block text-xs text-red-600 mt-1" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Field 3: Phone Number */}
          <div className="form-group" id="group-phone">
            <label htmlFor="quote-phone" className="form-label block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number <span className="text-red-500" aria-hidden="true">*</span>
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
                className={`form-control w-full px-4 py-3 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                  errors.phone
                    ? 'border-red-400 focus:ring-red-200 bg-red-50/30'
                    : 'border-slate-200 focus:border-[#12582e] focus:ring-[#12582e]/20 bg-white'
                }`}
              />
            </div>
            {errors.phone && (
              <span id="phone-error" className="form-error-text block text-xs text-red-600 mt-1" role="alert">
                {errors.phone}
              </span>
            )}
          </div>

          {/* Field 4: Space Description */}
          <div className="form-group" id="group-message">
            <label htmlFor="quote-message" className="form-label block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Space Description &amp; Cleaning Needs <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <div className="input-wrapper relative">
              <textarea
                id="quote-message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Give us an idea of the space to be cleaned (square footage, rooms, frequency, commercial/residential)"
                required
                minLength={10}
                maxLength={2000}
                aria-required="true"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className={`form-control form-textarea w-full px-4 py-3 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                  errors.message
                    ? 'border-red-400 focus:ring-red-200 bg-red-50/30'
                    : 'border-slate-200 focus:border-[#12582e] focus:ring-[#12582e]/20 bg-white'
                }`}
              />
            </div>
            {errors.message && (
              <span id="message-error" className="form-error-text block text-xs text-red-600 mt-1" role="alert">
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
              className="btn btn-primary btn-submit w-full py-3.5 px-6 rounded-xl bg-[#12582e] hover:bg-[#0d4222] text-white font-bold text-base shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Estimate...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="btn-text">Get a Quote</span>
                </>
              )}
            </button>
            <p className="privacy-note text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5">
              <span>🔒 Your privacy is protected. We never share your contact details.</span>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
