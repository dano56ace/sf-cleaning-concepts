import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, ChevronDown, ArrowUpRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { BUSINESS_NAP, SERVICES_CATALOG } from '../../data/siteData';

interface HeaderProps {
  onOpenQuoteModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuoteModal }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [servicesAccordionOpen, setServicesAccordionOpen] = useState(false);
  const [serviceAreasAccordionOpen, setServiceAreasAccordionOpen] = useState(false);
  const location = useLocation();

  const syncDrawerDom = (nextOpen: boolean) => {
    setDrawerOpen(nextOpen);
    const drawers = document.querySelectorAll('.mobile-nav-drawer');
    drawers.forEach((d) => d.classList.toggle('is-active', nextOpen));
    const overlays = document.querySelectorAll('.mobile-nav-overlay');
    overlays.forEach((o) => o.classList.toggle('is-active', nextOpen));
    const toggles = document.querySelectorAll('.mobile-nav-toggle');
    toggles.forEach((t) => t.setAttribute('aria-expanded', String(nextOpen)));
  };

  // Close drawer on route change
  useEffect(() => {
    syncDrawerDom(false);
    setServicesAccordionOpen(false);
    setServiceAreasAccordionOpen(false);
  }, [location.pathname]);

  // Handle ESC key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        syncDrawerDom(false);
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
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      {/* Desktop Executive Utility Bar */}
      <div className="hidden lg:block bg-[#071536] text-slate-300 border-b border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-slate-200 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#a3e6be]" />
              <span>Palm Beach · Broward · Miami-Dade</span>
            </span>
            <span className="text-slate-600" aria-hidden="true">|</span>
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#a3e6be]" />
              <span>Licensed, Insured &amp; Bonded · 100% Satisfaction Guarantee</span>
            </span>
          </div>
          <div className="flex items-center gap-6 font-mono tabular-nums">
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#a3e6be]" />
              <span>Mon–Sun: 7:00 AM – 8:00 PM</span>
            </span>
            <span className="text-slate-600" aria-hidden="true">|</span>
            <a
              href={`mailto:${BUSINESS_NAP.email}`}
              className="text-slate-200 hover:text-[#a3e6be] transition-colors font-sans font-medium"
            >
              {BUSINESS_NAP.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="site-header sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Logo */}
          <Link
            to="/"
            className="brand-logo flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-[#12582e]"
            aria-label="South Florida Cleaning Concepts Home"
          >
            <img
              src="/assets/images/logo/logo.svg"
              alt="South Florida Cleaning Concepts Logo"
              width="112"
              height="56"
              className="h-11 lg:h-14 w-24 lg:w-28 object-contain"
            />
          </Link>

          {/* Zone 2: Desktop Navigation */}
          <nav className="desktop-nav hidden lg:flex items-center" aria-label="Main Navigation">
            <ul className="nav-list flex items-center gap-7 m-0 p-0 list-none text-sm font-semibold text-slate-700">
              <li className="nav-item">
                <Link
                  to="/"
                  className={`nav-link whitespace-nowrap shrink-0 py-2 transition-colors relative ${
                    isActive('/') && location.pathname === '/'
                      ? 'text-[#12582e] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#12582e]'
                      : 'hover:text-[#071536]'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/about-us"
                  className={`nav-link whitespace-nowrap shrink-0 py-2 transition-colors relative ${
                    isActive('/about-us')
                      ? 'text-[#12582e] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#12582e]'
                      : 'hover:text-[#071536]'
                  }`}
                >
                  About Us
                </Link>
              </li>

              {/* Services Architectural Mega-Dropdown */}
              <li className="nav-item relative group">
                <Link
                  to="/our-services"
                  className={`nav-link inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 py-2 transition-colors relative ${
                    isActive('/our-services') || isActive('/service')
                      ? 'text-[#12582e] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#12582e]'
                      : 'hover:text-[#071536]'
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#12582e]" />
                </Link>

                <div className="nav-dropdown absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[680px] xl:w-[740px] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-5 overflow-hidden">
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
                      <div>
                        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#12582e] block">
                          10 Ways We Make Your Space Shine
                        </span>
                        <span className="text-xs text-slate-500 font-normal">
                          Pick a service below to see what’s included and get a fast quote
                        </span>
                      </div>
                      <Link
                        to="/our-services"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#12582e] hover:bg-[#0d4222] px-3.5 py-2 rounded-lg transition-colors shadow-2xs"
                      >
                        <span>See All Services</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {SERVICES_CATALOG.map((svc) => (
                        <Link
                          key={svc.slug}
                          to={`/service/${svc.slug}`}
                          className="group/item flex items-center gap-3.5 p-2.5 rounded-xl border border-transparent hover:border-slate-200/90 hover:bg-slate-50/90 transition-all"
                        >
                          <div className="w-14 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200/80 shadow-2xs">
                            <img
                              src={svc.image}
                              alt={svc.title}
                              width="56"
                              height="48"
                              className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-[#071536] group-hover/item:text-[#12582e] transition-colors truncate">
                              {svc.title}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1 font-normal mt-0.5">
                              {svc.shortDesc}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/80 -mx-5 -mb-5 px-5 py-3.5">
                      <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#12582e] shrink-0" />
                        <span>Backed by our <strong className="text-[#071536]">Love Your Clean or Don’t Pay Guarantee</strong></span>
                      </span>
                      <Link
                        to="/service"
                        className="text-xs font-bold text-[#12582e] hover:text-[#0d4222] transition-colors"
                      >
                        Compare All Services →
                      </Link>
                    </div>
                  </div>
                </div>
              </li>

              {/* Service Areas Navigation & Dropdown */}
              <li className="nav-item relative group">
                <Link
                  to="/service-areas"
                  className={`nav-link inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 py-2 transition-colors relative ${
                    isActive('/service-areas') || isActive('/service-area')
                      ? 'text-[#12582e] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#12582e]'
                      : 'hover:text-[#071536]'
                  }`}
                >
                  <span>Service Areas</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#12582e]" />
                </Link>

                <div className="nav-dropdown absolute top-full left-1/2 -translate-x-1/2 pt-3 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 overflow-hidden">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                        Top Service Hubs
                      </span>
                      <Link
                        to="/service-areas"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#12582e] hover:text-[#0d4222]"
                      >
                        <span>All 56 Areas</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="flex flex-col gap-1">
                      {[
                        { name: 'Jupiter', slug: 'jupiter' },
                        { name: 'West Palm Beach', slug: 'west-palm-beach' },
                        { name: 'Boca Raton', slug: 'boca-raton' },
                        { name: 'Delray Beach', slug: 'delray-beach' },
                        { name: 'Palm Beach Gardens', slug: 'palm-beach-gardens' },
                        { name: 'Wellington', slug: 'wellington' },
                        { name: 'Boynton Beach', slug: 'boynton-beach' }
                      ].map((city) => (
                        <Link
                          key={city.slug}
                          to={`/service-area/${city.slug}`}
                          className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-[#12582e] hover:bg-slate-50 transition-colors"
                        >
                          <span>{city.name}</span>
                          <span className="text-xs text-slate-400 font-mono">FL</span>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 bg-slate-50/70 -mx-4 -mb-4 px-4 py-2.5 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Palm Beach, Broward &amp; Miami-Dade</span>
                      <Link
                        to="/service-areas"
                        className="text-xs font-bold text-[#12582e] hover:underline"
                      >
                        All 56 Service Areas →
                      </Link>
                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <Link
                  to="/faqs"
                  className={`nav-link whitespace-nowrap shrink-0 py-2 transition-colors relative ${
                    isActive('/faqs')
                      ? 'text-[#12582e] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#12582e]'
                      : 'hover:text-[#071536]'
                  }`}
                >
                  FAQs
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/our-publications"
                  className={`nav-link whitespace-nowrap shrink-0 py-2 transition-colors relative ${
                    isActive('/our-publications') || isActive('/blog')
                      ? 'text-[#12582e] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#12582e]'
                      : 'hover:text-[#071536]'
                  }`}
                >
                  Publications
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact-us"
                  className={`nav-link whitespace-nowrap shrink-0 py-2 transition-colors relative ${
                    isActive('/contact-us')
                      ? 'text-[#12582e] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#12582e]'
                      : 'hover:text-[#071536]'
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Zone 3: Desktop CTA Actions */}
          <div className="header-cta hidden lg:flex items-center gap-3 shrink-0">
            <a
              href={`tel:${BUSINESS_NAP.phoneRaw}`}
              className="btn btn-phone inline-flex items-center gap-2 text-[#071536] hover:text-[#12582e] bg-slate-50 hover:bg-slate-100 font-mono font-semibold text-sm py-2.5 px-3.5 rounded-xl border border-slate-200/90 transition-colors whitespace-nowrap shrink-0 tabular-nums"
              aria-label={`Call ${BUSINESS_NAP.phone}`}
            >
              <Phone className="w-4 h-4 text-[#12582e]" />
              <span>{BUSINESS_NAP.phone}</span>
            </a>
            {onOpenQuoteModal ? (
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
              >
                Free Quote
              </button>
            ) : (
              <Link
                to="/contact-us"
                className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-xs hover:shadow-md transition-all duration-150 whitespace-nowrap shrink-0"
              >
                Free Quote
              </Link>
            )}
          </div>

          {/* Mobile & Tablet Controls (< 1024px) */}
          <div className="mobile-controls flex lg:hidden items-center gap-2">
            <a
              href={`tel:${BUSINESS_NAP.phoneRaw}`}
              className="mobile-call-btn w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[#e8f5ee] text-[#12582e] border border-[#12582e]/20 hover:bg-[#12582e] hover:text-white transition-colors"
              aria-label="Call South Florida Cleaning Concepts"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              type="button"
              data-react-managed="true"
              className="mobile-nav-toggle mobile-menu-toggle w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-slate-200 bg-white text-[#071536] hover:bg-slate-50 transition-colors cursor-pointer"
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              aria-label="Toggle navigation menu"
              onClick={() => syncDrawerDom(!drawerOpen)}
            >
              {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      <div
        className={`mobile-nav-overlay fixed inset-0 bg-[#071536]/60 z-50 backdrop-blur-xs transition-opacity duration-200 ${
          drawerOpen ? 'is-active is-open opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
        }`}
        aria-hidden="true"
        onClick={() => syncDrawerDom(false)}
      />

      {/* Mobile Navigation Drawer */}
      <aside
        id="mobile-nav-drawer"
        className={`mobile-nav-drawer fixed top-0 right-0 w-80 max-w-[86vw] h-full bg-white z-50 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-x-0 is-active is-open visible' : 'translate-x-full invisible'
        }`}
        aria-label="Mobile Navigation Drawer"
      >
        <div className="drawer-content overflow-y-auto flex-grow p-6">
          <div className="drawer-header flex items-center justify-between pb-5 border-b border-slate-200/80">
            <Link
              to="/"
              className="brand-logo inline-flex items-center"
              onClick={() => syncDrawerDom(false)}
              aria-label="South Florida Cleaning Concepts Home"
            >
              <img
                src="/assets/images/logo/logo.svg"
                alt="South Florida Cleaning Concepts Logo"
                width="160"
                height="80"
                className="w-20 h-10 object-contain block"
              />
            </Link>
            <button
              type="button"
              className="drawer-close-btn w-12 h-12 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl text-slate-500 hover:text-[#071536] hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close navigation menu"
              onClick={() => syncDrawerDom(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="drawer-nav mt-5" aria-label="Mobile Navigation">
            <ul className="drawer-nav-list flex flex-col gap-1.5 list-none p-0 m-0 text-base font-bold text-[#071536]">
              <li>
                <Link
                  to="/"
                  className="nav-link flex items-center min-h-[48px] py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                  onClick={() => syncDrawerDom(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="nav-link flex items-center min-h-[48px] py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                  onClick={() => syncDrawerDom(false)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="mobile-accordion-toggle w-full flex items-center justify-between min-h-[48px] py-3 px-4 rounded-xl hover:bg-slate-50 text-left font-bold text-[#071536] cursor-pointer"
                  aria-expanded={servicesAccordionOpen}
                  onClick={(e) => {
                    const nextAcc = !servicesAccordionOpen;
                    setServicesAccordionOpen(nextAcc);
                    const contents = document.querySelectorAll('.mobile-accordion-content');
                    contents.forEach((c) => c.classList.toggle('is-open', nextAcc));
                    e.currentTarget.setAttribute('aria-expanded', String(nextAcc));
                  }}
                >
                  <span>Our Services</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      servicesAccordionOpen ? 'rotate-180 text-[#12582e]' : ''
                    }`}
                  />
                </button>
                <ul
                  className={`mobile-accordion-content pl-3 py-1.5 flex flex-col gap-1 list-none m-0 border-l border-slate-200 ml-4 overflow-hidden transition-all duration-200 ${
                    servicesAccordionOpen ? 'is-open max-h-[1200px] opacity-100 block' : 'max-h-0 opacity-0 hidden'
                  }`}
                >
                  <li>
                    <Link
                      to="/our-services"
                      className="drawer_sub_link flex items-center min-h-[48px] py-2.5 px-3 text-sm font-bold text-[#12582e] hover:bg-[#e8f5ee] rounded-lg transition-colors"
                      onClick={() => syncDrawerDom(false)}
                    >
                      All Services Overview →
                    </Link>
                  </li>
                  {SERVICES_CATALOG.map((svc) => (
                    <li key={svc.slug}>
                      <Link
                        to={`/service/${svc.slug}`}
                        className="drawer_sub_link flex items-center min-h-[48px] py-2.5 px-3 text-sm font-medium text-slate-600 hover:text-[#12582e] hover:bg-slate-50 rounded-lg transition-colors"
                        onClick={() => syncDrawerDom(false)}
                      >
                        {svc.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <button
                  type="button"
                  className="mobile-accordion-toggle w-full flex items-center justify-between min-h-[48px] py-3 px-4 rounded-xl hover:bg-slate-50 text-left font-bold text-[#071536] cursor-pointer"
                  aria-expanded={serviceAreasAccordionOpen}
                  onClick={(e) => {
                    const nextAcc = !serviceAreasAccordionOpen;
                    setServiceAreasAccordionOpen(nextAcc);
                    e.currentTarget.setAttribute('aria-expanded', String(nextAcc));
                  }}
                >
                  <span>Service Areas</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      serviceAreasAccordionOpen ? 'rotate-180 text-[#12582e]' : ''
                    }`}
                  />
                </button>
                <ul
                  className={`mobile-accordion-content pl-3 py-1.5 flex flex-col gap-1 list-none m-0 border-l border-slate-200 ml-4 overflow-hidden transition-all duration-200 ${
                    serviceAreasAccordionOpen ? 'is-open max-h-[800px] opacity-100 block' : 'max-h-0 opacity-0 hidden'
                  }`}
                >
                  <li>
                    <Link
                      to="/service-areas"
                      className="drawer_sub_link flex items-center min-h-[48px] py-2.5 px-3 text-sm font-bold text-[#12582e] hover:bg-[#e8f5ee] rounded-lg transition-colors"
                      onClick={() => syncDrawerDom(false)}
                    >
                      All 56 Service Areas Overview →
                    </Link>
                  </li>
                  {[
                    { name: 'Jupiter', slug: 'jupiter' },
                    { name: 'West Palm Beach', slug: 'west-palm-beach' },
                    { name: 'Boca Raton', slug: 'boca-raton' },
                    { name: 'Delray Beach', slug: 'delray-beach' },
                    { name: 'Palm Beach Gardens', slug: 'palm-beach-gardens' },
                    { name: 'Wellington', slug: 'wellington' },
                    { name: 'Boynton Beach', slug: 'boynton-beach' }
                  ].map((city) => (
                    <li key={city.slug}>
                      <Link
                        to={`/service-area/${city.slug}`}
                        className="drawer_sub_link flex items-center min-h-[48px] py-2.5 px-3 text-sm font-medium text-slate-600 hover:text-[#12582e] hover:bg-slate-50 rounded-lg transition-colors"
                        onClick={() => syncDrawerDom(false)}
                      >
                        {city.name}, FL
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="nav-link flex items-center min-h-[48px] py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                  onClick={() => syncDrawerDom(false)}
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/our-publications"
                  className="nav-link flex items-center min-h-[48px] py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                  onClick={() => syncDrawerDom(false)}
                >
                  Publications
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="nav-link flex items-center min-h-[48px] py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                  onClick={() => syncDrawerDom(false)}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="drawer-footer p-6 border-t border-slate-200/80 flex flex-col gap-3 bg-slate-50">
          <a
            href={`tel:${BUSINESS_NAP.phoneRaw}`}
            className="btn btn-phone w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-300 bg-white font-mono font-bold text-[#071536] hover:bg-slate-100 transition-colors tabular-nums"
          >
            <Phone className="w-4 h-4 text-[#12582e]" />
            <span>Call {BUSINESS_NAP.phone}</span>
          </a>
          {onOpenQuoteModal ? (
            <button
              type="button"
              onClick={() => {
                syncDrawerDom(false);
                onOpenQuoteModal();
              }}
              className="btn btn-primary w-full min-h-[48px] py-3 px-4 rounded-xl bg-[#12582e] hover:bg-[#0d4222] font-bold text-white text-center shadow-xs transition-colors cursor-pointer"
            >
              Get Free Quote
            </button>
          ) : (
            <Link
              to="/contact-us"
              className="btn btn-primary w-full min-h-[48px] py-3 px-4 rounded-xl bg-[#12582e] hover:bg-[#0d4222] font-bold text-white text-center shadow-xs transition-colors flex items-center justify-center"
              onClick={() => syncDrawerDom(false)}
            >
              Get Free Quote
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};
