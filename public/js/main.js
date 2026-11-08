/**
 * South Florida Cleaning Concepts - Master Client Controller
 * Responsive Navigation, Zero-CLS Video Hero, Video Modal, Form Validation & FAQ Accordions
 */

function initAll() {
  initMobileNavigation();
  initHeroVideo();
  initVideoModals();
  initLeadQuoteForm();
  initFaqAccordions();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/**
 * 1. Mobile Navigation & Drawer Controller
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const closeBtn = document.querySelector('.drawer-close-btn');
  const accordionToggle = document.querySelector('.mobile-accordion-toggle');
  const accordionContent = document.querySelector('.mobile-accordion-content');

  if (!toggleBtn || !drawer) return;
  if (toggleBtn.getAttribute('data-react-managed') === 'true') return;

  function openDrawer() {
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('is-active');
    if (overlay) overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function closeDrawer() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-active');
    if (overlay) overlay.classList.remove('is-active');
    document.body.style.overflow = '';
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-active')) {
      closeDrawer();
      toggleBtn.focus();
    }
  });

  // Mobile Services Accordion Toggle
  if (accordionToggle && accordionContent) {
    accordionToggle.addEventListener('click', () => {
      const isOpen = accordionContent.classList.contains('is-open');
      accordionContent.classList.toggle('is-open', !isOpen);
      accordionToggle.setAttribute('aria-expanded', String(!isOpen));
      const icon = accordionToggle.querySelector('.dropdown-indicator');
      if (icon) {
        icon.style.transform = !isOpen ? 'rotate(180deg)' : '';
      }
    });
  }

  // Close drawer when any nav link is tapped
  const navLinks = drawer.querySelectorAll('a');
  navLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * 2. Hero Background Video Controller
 */
function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay prevented (e.g. low power mode); fallback poster background is active
    });
  }
}

/**
 * 3. Accessible Video Modal Player Controller
 */
function initVideoModals() {
  const openTriggers = document.querySelectorAll('[data-video-modal-open]');

  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-video-modal-open');
      const modal = document.getElementById(modalId);
      if (!modal) return;

      const video = modal.querySelector('video');
      const closeButtons = modal.querySelectorAll('[data-video-modal-close]');
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];

      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';

      if (firstFocusable) firstFocusable.focus();

      if (video) {
        video.play().catch(() => {
          video.controls = true;
        });
      }

      function closeModal() {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
        modal.setAttribute('hidden', '');
        document.body.style.overflow = '';
        trigger.focus();
        document.removeEventListener('keydown', handleKeydown);
      }

      function handleKeydown(e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeModal();
        }

        // Trap focus inside modal
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              e.preventDefault();
              lastFocusable.focus();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              e.preventDefault();
              firstFocusable.focus();
            }
          }
        }
      }

      closeButtons.forEach((btn) => {
        btn.onclick = closeModal;
      });

      document.addEventListener('keydown', handleKeydown);
    });
  });
}

/**
 * 4. 4-Field Lead Quote Form Validation & Submission Controller
 */
function initLeadQuoteForm() {
  const form = document.getElementById('lead-quote-form') || document.getElementById('quote-form');
  if (!form) return;
  if (form.getAttribute('data-react-managed') === 'true') return;

  const nameInput = form.querySelector('input[name="name"]') || form.querySelector('input[name="your-name"]');
  const emailInput = form.querySelector('input[name="email"]') || form.querySelector('input[name="your-email"]');
  const phoneInput = form.querySelector('input[name="phone"]') || form.querySelector('input[name="your-phone"]');
  const messageInput = form.querySelector('textarea[name="message"]') || form.querySelector('textarea[name="your-message"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const successBanner = document.getElementById('quote-success-banner');
  const errorBanner = document.getElementById('quote-error-banner');
  const resetBtn = document.getElementById('reset-quote-form');

  // Phone auto-formatter: (XXX) XXX-XXXX
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? `-${x[3]}` : ''}`;
      validateField(phoneInput);
    });
  }

  // Field validation helper
  function validateField(input) {
    if (!input) return true;
    const errorEl = document.getElementById(`${input.id ? input.id.replace('quote-', '') : input.name}-error`);
    let isValid = true;
    let message = '';

    const val = input.value.trim();

    if (input === nameInput) {
      if (!val) {
        isValid = false;
        message = 'Please enter your full name.';
      } else if (val.length < 2) {
        isValid = false;
        message = 'Name must be at least 2 characters.';
      }
    } else if (input === emailInput) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) {
        isValid = false;
        message = 'Please enter your email address.';
      } else if (!emailRegex.test(val)) {
        isValid = false;
        message = 'Please enter a valid email address.';
      }
    } else if (input === phoneInput) {
      const rawDigits = val.replace(/\D/g, '');
      if (!val) {
        isValid = false;
        message = 'Please enter your phone number.';
      } else if (rawDigits.length !== 10) {
        isValid = false;
        message = 'Please enter a valid 10-digit phone number.';
      }
    } else if (input === messageInput) {
      if (!val) {
        isValid = false;
        message = 'Please describe the space you would like cleaned.';
      } else if (val.length < 10) {
        isValid = false;
        message = 'Please provide at least a few details (min 10 characters).';
      }
    }

    if (isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (errorEl) errorEl.textContent = '';
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (errorEl) errorEl.textContent = message;
    }

    return isValid;
  }

  // Real-time re-validation on blur & input
  [nameInput, emailInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid') || input.classList.contains('is-valid')) {
        validateField(input);
      }
    });
  });

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput);
    const isEmailValid = validateField(emailInput);
    const isPhoneValid = validateField(phoneInput);
    const isMsgValid = validateField(messageInput);

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isMsgValid) {
      // Focus first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Set Loading State
    if (submitBtn) {
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      if (btnText) btnText.textContent = 'Submitting...';
      if (btnSpinner) btnSpinner.removeAttribute('hidden');
    }

    const formData = new FormData(form);

    try {
      // Submit via Netlify AJAX endpoint
      const response = await fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok || response.status === 200 || response.type === 'opaqueredirect') {
        form.style.display = 'none';
        if (errorBanner) errorBanner.setAttribute('hidden', '');
        if (successBanner) {
          successBanner.removeAttribute('hidden');
          const msgEl = document.getElementById('quote-success-message');
          if (msgEl && nameInput) {
            msgEl.textContent = `Thank you, ${nameInput.value.trim()}! Your cleaning quote request has been received. Our South Florida team will call you at ${phoneInput.value.trim()} shortly.`;
          }
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        throw new Error('Network response not ok');
      }
    } catch {
      // Network or submission error fallback: keep form visible, display error banner
      if (successBanner) successBanner.setAttribute('hidden', '');
      if (errorBanner) {
        errorBanner.removeAttribute('hidden');
        errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        const btnText = submitBtn.querySelector('.btn-text');
        const btnSpinner = submitBtn.querySelector('.btn-spinner');
        if (btnText) btnText.textContent = 'Get a Free Quote';
        if (btnSpinner) btnSpinner.setAttribute('hidden', '');
      }
    }
  });

  // Reset Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      [nameInput, emailInput, phoneInput, messageInput].forEach((input) => {
        if (!input) return;
        input.classList.remove('is-valid', 'is-invalid');
      });
      if (successBanner) successBanner.setAttribute('hidden', '');
      if (errorBanner) errorBanner.setAttribute('hidden', '');
      form.style.display = 'flex';
      if (nameInput) nameInput.focus();
    });
  }
}

/**
 * 5. Accessible FAQ Accordions (Exclusive Single-Open)
 */
function initFaqAccordions() {
  const accordions = document.querySelectorAll('.faq-accordion-group .faq-item');

  accordions.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        // Close other items in the same group
        accordions.forEach((other) => {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });
}
