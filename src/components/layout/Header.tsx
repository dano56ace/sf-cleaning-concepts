import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';
import { BUSINESS_NAP, SERVICES_CATALOG } from '../../data/siteData';

interface HeaderProps {
  onOpenQuoteModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuoteModal }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [servicesAccordionOpen, setServicesAccordionOpen] = useState(false);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
    setServicesAccordionOpen(false);
  }, [location.pathname]);

  // Handle ESC key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="site-header sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo flex items-center gap-3 shrink-0" aria-label="South Florida Cleaning Concepts Home">
            <img
              src="/assets/images/logo/logo.svg"
              alt="South Florida Cleaning Concepts Logo"
              width="160"
              height="40"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav hidden lg:flex items-center gap-7" aria-label="Main Navigation">
            <ul className="nav-list flex items-center gap-6 m-0 p-0 list-none font-medium text-slate-700 text-sm">
              <li className="nav-item">
                <Link
                  to="/"
                  className={`nav-link hover:text-[#12582e] transition-colors py-2 ${isActive('/') && location.pathname === '/' ? 'text-[#12582e] font-bold' : ''}`}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/about-us"
                  className={`nav-link hover:text-[#12582e] transition-colors py-2 ${isActive('/about-us') ? 'text-[#12582e] font-bold' : ''}`}
                >
                  About Us
                </Link>
              </li>

              {/* Services Dropdown */}
              <li className="nav-item relative group">
                <Link
                  to="/our-services"
                  className={`nav-link flex items-center gap-1.5 hover:text-[#12582e] transition-colors py-2 ${isActive('/our-services') || isActive('/service') ? 'text-[#12582e] font-bold' : ''}`}
                >
                  <span>Services</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </Link>
                <div className="nav-dropdown absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-3 hidden group-hover:block transition-all duration-200 z-50">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-4 py-1.5">
                    Commercial & Residential
                  </div>
                  {SERVICES_CATALOG.map((svc) => (
                    <Link
                      key={svc.slug}
                      to={`/service/${svc.slug}`}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#e8f5ee] hover:text-[#12582e] transition-colors"
                    >
                      {svc.title}
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <Link
                      to="/our-services"
                      className="block px-4 py-2 text-sm font-bold text-[#12582e] hover:bg-[#e8f5ee] transition-colors"
                    >
                      View All Services →
                    </Link>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <Link
                  to="/faqs"
                  className={`nav-link hover:text-[#12582e] transition-colors py-2 ${isActive('/faqs') ? 'text-[#12582e] font-bold' : ''}`}
                >
                  FAQs
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/our-publications"
                  className={`nav-link hover:text-[#12582e] transition-colors py-2 ${isActive('/our-publications') || isActive('/blog') ? 'text-[#12582e] font-bold' : ''}`}
                >
                  Publications
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact-us"
                  className={`nav-link hover:text-[#12582e] transition-colors py-2 ${isActive('/contact-us') ? 'text-[#12582e] font-bold' : ''}`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="header-cta hidden lg:flex items-center gap-4">
            <a
              href={`tel:${BUSINESS_NAP.phoneRaw}`}
              className="btn btn-phone flex items-center gap-2 text-slate-800 hover:text-[#12582e] font-semibold text-sm py-2 px-3 rounded-lg border border-slate-200 hover:border-[#12582e] transition-colors"
              aria-label={`Call ${BUSINESS_NAP.phone}`}
            >
              <Phone className="w-4 h-4 text-[#12582e]" />
              <span>{BUSINESS_NAP.phone}</span>
            </a>
            {onOpenQuoteModal ? (
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white text-sm font-bold py-2.5 px-5 rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
              >
                Free Quote
              </button>
            ) : (
              <Link
                to="/contact-us"
                className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white text-sm font-bold py-2.5 px-5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
              >
                Free Quote
              </Link>
            )}
          </div>

          {/* Mobile Controls (Phone Call + Hamburger Toggle) */}
          <div className="mobile-controls flex lg:hidden items-center gap-2">
            <a
              href={`tel:${BUSINESS_NAP.phoneRaw}`}
              className="mobile-call-btn w-12 h-12 flex items-center justify-center rounded-lg bg-[#e8f5ee] text-[#12582e] hover:bg-[#12582e] hover:text-white transition-colors"
              aria-label="Call South Florida Cleaning Concepts"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              type="button"
              className="mobile-nav-toggle w-12 h-12 flex items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              aria-label="Toggle navigation menu"
              onClick={(e) => {
                const nextState = !drawerOpen;
                setDrawerOpen(nextState);
                const drawers = document.querySelectorAll('.mobile-nav-drawer');
                drawers.forEach(d => d.classList.toggle('is-active', nextState));
                const overlays = document.querySelectorAll('.mobile-nav-overlay');
                overlays.forEach(o => o.classList.toggle('is-active', nextState));
                e.currentTarget.setAttribute('aria-expanded', String(nextState));
              }}
            >
              {drawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer & Overlay */}
      <div
        className={`mobile-nav-overlay fixed inset-0 bg-black/50 z-50 backdrop-blur-xs transition-opacity duration-200 ${
          drawerOpen ? 'is-active opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={() => {
          setDrawerOpen(false);
          const drawers = document.querySelectorAll('.mobile-nav-drawer');
          drawers.forEach(d => d.classList.remove('is-active'));
          const overlays = document.querySelectorAll('.mobile-nav-overlay');
          overlays.forEach(o => o.classList.remove('is-active'));
          const toggles = document.querySelectorAll('.mobile-nav-toggle');
          toggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
        }}
      />

      <aside
        id="mobile-nav-drawer"
        className={`mobile-nav-drawer fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-white z-50 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-x-0 is-active' : 'translate-x-full'
        }`}
        aria-label="Mobile Navigation Drawer"
      >
        <div className="drawer-content overflow-y-auto flex-grow p-6">
          <div className="drawer-header flex items-center justify-between pb-6 border-b border-slate-100">
            <Link to="/" className="brand-logo" onClick={() => setDrawerOpen(false)} aria-label="South Florida Cleaning Concepts Home">
              <img
                src="/assets/images/logo/logo.svg"
                alt="South Florida Cleaning Concepts Logo"
                width="140"
                height="35"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <button
              type="button"
              className="drawer-close-btn w-12 h-12 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close navigation menu"
              onClick={() => {
                setDrawerOpen(false);
                const drawers = document.querySelectorAll('.mobile-nav-drawer');
                drawers.forEach(d => d.classList.remove('is-active'));
                const overlays = document.querySelectorAll('.mobile-nav-overlay');
                overlays.forEach(o => o.classList.remove('is-active'));
                const toggles = document.querySelectorAll('.mobile-nav-toggle');
                toggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
              }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="drawer-nav mt-6">
            <ul className="drawer-nav-list flex flex-col gap-2 list-none p-0 m-0 text-base font-semibold text-slate-800">
              <li>
                <Link
                  to="/"
                  className="nav-link flex items-center min-h-[48px] py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="nav-link flex items-center min-h-[48px] py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="mobile-accordion-toggle w-full flex items-center justify-between min-h-[48px] py-3 px-4 rounded-lg hover:bg-slate-50 text-left font-semibold text-slate-800 cursor-pointer"
                  aria-expanded={servicesAccordionOpen}
                  onClick={(e) => {
                    const nextAcc = !servicesAccordionOpen;
                    setServicesAccordionOpen(nextAcc);
                    const contents = document.querySelectorAll('.mobile-accordion-content');
                    contents.forEach(c => c.classList.toggle('is-open', nextAcc));
                    e.currentTarget.setAttribute('aria-expanded', String(nextAcc));
                  }}
                >
                  <span>Our Services</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      servicesAccordionOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <ul
                  className={`mobile-accordion-content pl-4 py-2 flex flex-col gap-1 list-none m-0 border-l-2 border-[#12582e]/20 ml-4 overflow-hidden transition-all duration-300 ${
                    servicesAccordionOpen ? 'is-open max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <li>
                    <Link
                      to="/our-services"
                      className="drawer_sub_link flex items-center min-h-[48px] py-2 px-3 text-sm font-bold text-[#12582e] hover:bg-[#e8f5ee] rounded-md transition-colors"
                      onClick={() => setDrawerOpen(false)}
                    >
                      All Services Overview →
                    </Link>
                  </li>
                  {SERVICES_CATALOG.map((svc) => (
                    <li key={svc.slug}>
                      <Link
                        to={`/service/${svc.slug}`}
                        className="drawer_sub_link flex items-center min-h-[48px] py-2 px-3 text-sm text-slate-600 hover:text-[#12582e] hover:bg-slate-50 rounded-md transition-colors"
                        onClick={() => setDrawerOpen(false)}
                      >
                        {svc.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="nav-link block py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/our-publications"
                  className="nav-link block py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  Publications
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="nav-link block py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                  onClick={() => setDrawerOpen(false)}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="drawer-footer p-6 border-t border-slate-100 flex flex-col gap-3 bg-slate-50/50">
          <a
            href={`tel:${BUSINESS_NAP.phoneRaw}`}
            className="btn btn-phone w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-slate-300 font-bold text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Phone className="w-4 h-4 text-[#12582e]" />
            <span>Call (561) 704-5303</span>
          </a>
          {onOpenQuoteModal ? (
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                onOpenQuoteModal();
              }}
              className="btn btn-primary w-full py-3 px-4 rounded-lg bg-[#12582e] hover:bg-[#0d4222] font-bold text-white text-center shadow-sm transition-colors cursor-pointer"
            >
              Get Free Quote
            </button>
          ) : (
            <Link
              to="/contact-us"
              className="btn btn-primary w-full py-3 px-4 rounded-lg bg-[#12582e] hover:bg-[#0d4222] font-bold text-white text-center shadow-sm transition-colors"
              onClick={() => setDrawerOpen(false)}
            >
              Get Free Quote
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};
