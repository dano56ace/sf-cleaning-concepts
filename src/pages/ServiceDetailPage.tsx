import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Phone, ArrowRight, Award, Sparkles } from 'lucide-react';
import { SERVICES_CATALOG, BUSINESS_NAP } from '../data/siteData';
import { QuoteForm } from '../components/ui/QuoteForm';

// Exact H1 mappings from verified M4 pages
const EXACT_H1_MAP: { [slug: string]: string } = {
  'office-cleaning': 'Office Cleaning Services',
  'medical-office-cleaning': 'Specialized Medical Office Cleaning',
  'bars-and-restaurant-cleaning': 'Commercial Cleaning for Bars and Restaurants',
  'short-term-rentals': 'Short-Term Rental Cleaning Services',
  'post-construction-cleaning': 'Post-Construction Cleaning',
  'move-in-out-cleaning': 'Move In / Out Cleaning Services',
  'home-maintenance': 'Comprehensive Home Maintenance Services',
  'school-cleaning': 'School Cleaning Services',
  'home-watching': 'Home Watching Service',
  'covid-19-disinfection': 'COVID-19 Disinfection Services'
};

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const cleanSlug = slug?.replace(/\.html$/, '');
  const service = SERVICES_CATALOG.find((s) => s.slug === cleanSlug);

  if (!service) {
    return <Navigate to="/our-services" replace />;
  }

  const exactH1 = EXACT_H1_MAP[service.slug] || service.title;

  return (
    <article className="service-detail-page">
      {/* Subpage Hero Header */}
      <section className="page-hero relative bg-[#071536] text-white py-20 overflow-hidden" aria-label={`${service.title} Header`}>
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src={service.image}
            alt={`${service.title} Background`}
            width="1920"
            height="600"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            {exactH1}
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-6">
            {service.shortDesc}
          </p>
          <nav className="breadcrumbs flex items-center justify-center gap-2 text-xs font-semibold text-slate-300" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/our-services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span aria-current="page" className="text-[#a3e6be]">{service.title}</span>
          </nav>
        </div>
      </section>

      {/* Main Content & Lead Form Grid */}
      <section className="section py-20 bg-white" aria-labelledby="service-spec-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 7 Cols: Detailed Scope, Features, and Checklists */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5ee] text-[#12582e] text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Professional Service Specifications</span>
              </div>
              <h2 id="service-spec-heading" className="text-2xl sm:text-3xl font-extrabold text-[#071536] mb-6">
                Comprehensive {service.title} in South Florida
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                {service.fullDesc}
              </p>

              {/* Service Hero Image */}
              <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-100 mb-10 bg-slate-100">
                <img
                  src={service.image}
                  alt={`${service.title} - Professional On-Site Operations`}
                  width="900"
                  height="500"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>

              {/* Scope Deliverables */}
              <h3 className="text-xl font-bold text-[#071536] mb-4">
                What Our Service Includes:
              </h3>
              <ul className="space-y-3 mb-10 p-0 m-0 list-none">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-[#12582e] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Standard Cleaning Checklist */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 mb-10">
                <h3 className="text-lg font-bold text-[#071536] mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#12582e]" />
                  <span>Standard Quality Inspection Checklist</span>
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-600 p-0 m-0 list-none">
                  {service.checklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#12582e] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Client Benefits */}
              <h3 className="text-xl font-bold text-[#071536] mb-4">
                Key Benefits for Your Property:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.benefits.map((benefit, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-[#12582e] mb-2" />
                    <p className="text-xs sm:text-sm text-slate-700 font-semibold m-0">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Sticky Quote Request Form */}
            <div className="lg:col-span-5 sticky top-28">
              <div className="bg-[#071536] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12582e] text-xs font-bold uppercase tracking-wider mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Satisfaction Guarantee</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Get a Free Quote for {service.title}
                </h2>
                <p className="text-xs text-slate-300 mb-6">
                  Fill out our quick 4-field form below and our team will get in touch with an accurate estimate.
                </p>

                <div className="bg-white rounded-2xl p-6 text-slate-800 shadow-md">
                  <QuoteForm source={service.title} />
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-300">
                  <p className="m-0 mb-2">Prefer to speak with an estimator immediately?</p>
                  <a
                    href={`tel:${BUSINESS_NAP.phoneRaw}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-300 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call (561) 704-5303</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross Links to Other Services */}
      <section className="section py-16 bg-slate-50 border-t border-slate-200/60" aria-label="Other Services Navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#071536] m-0">
              Other Specialized Services
            </h2>
            <Link to="/our-services" className="text-sm font-bold text-[#12582e] hover:underline flex items-center gap-1">
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES_CATALOG.filter((s) => s.slug !== service.slug)
              .slice(0, 4)
              .map((other) => (
                <Link
                  key={other.slug}
                  to={`/service/${other.slug}`}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#12582e]/40 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-bold text-[#071536] group-hover:text-[#12582e] transition-colors mb-2">
                      {other.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {other.shortDesc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-[#12582e]">
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </article>
  );
};
