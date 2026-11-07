import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Heart, Users, CheckCircle2, Phone, ArrowRight } from 'lucide-react';
import { BUSINESS_NAP } from '../data/siteData';
import { RotationSystemSection } from '../components/ui/TrustBadges';

export const AboutPage: React.FC = () => {
  return (
    <article className="about-page">
      {/* Subpage Hero Header */}
      <section className="page-hero relative bg-[#071536] text-white py-20 overflow-hidden" aria-label="About Us Header">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="/assets/images/about/about-us-img-4.jpg"
            alt="South Florida Cleaning Concepts Facility Background"
            width="1920"
            height="600"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            About Us
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Over 20 years of family-owned excellence, certified staff, and our 100% satisfaction guarantee across Palm Beach &amp; Broward counties.
          </p>
          <nav className="breadcrumbs flex items-center justify-center gap-2 text-xs font-semibold text-slate-300" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span aria-current="page" className="text-[#a3e6be]">About Us</span>
          </nav>
        </div>
      </section>

      {/* Main Story & Values Section */}
      <section className="section py-20 bg-white" aria-labelledby="story-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5ee] text-[#12582e] text-xs font-bold uppercase tracking-wider mb-4">
                <span>Our Heritage</span>
              </div>
              <h2 id="story-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-6">
                20+ Years of Dedication to South Florida Properties
              </h2>
              <div className="space-y-4 text-slate-600 text-base leading-relaxed">
                <p>
                  South Florida Cleaning Concepts was founded with a singular commitment: to deliver an uncompromising standard of cleanliness backed by total accountability and personal care. Over the past two decades, our family-owned enterprise has grown to become one of the region’s most trusted commercial janitorial and luxury residential cleaning teams.
                </p>
                <p>
                  We treat every corporate headquarters, healthcare facility, restaurant, and private estate with the same meticulous attention to detail that we would demand in our own home. Our team members are not transient subcontractors; they are background-checked, bonded, and trained specialists who take genuine pride in their craft.
                </p>
                <p>
                  We stand firmly behind our signature 100% Satisfaction Guarantee: if you are ever dissatisfied with any portion of our work, notify us within 24 hours and we will return promptly to re-clean for free—or you do not pay.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-[#12582e]" />
                  <div>
                    <div className="text-2xl font-extrabold text-[#071536]">20+</div>
                    <div className="text-xs text-slate-500 font-semibold uppercase">Years In Business</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-[#12582e]" />
                  <div>
                    <div className="text-2xl font-extrabold text-[#071536]">100%</div>
                    <div className="text-xs text-slate-500 font-semibold uppercase">Guaranteed Results</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/assets/images/about/about-us-img-5.jpg"
                  alt="South Florida Cleaning Concepts Professional Cleaning Specialists"
                  width="800"
                  height="600"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#071536] text-white p-6 rounded-2xl shadow-xl max-w-xs hidden sm:block">
                <p className="text-xs text-[#a3e6be] font-bold uppercase tracking-wider mb-1">
                  Family-Owned &amp; Operated
                </p>
                <p className="text-sm font-semibold">
                  Personalized attention on every account with direct supervisor oversight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Excellence */}
      <section className="section py-20 bg-slate-50 border-t border-slate-200/60" aria-labelledby="pillars-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 id="pillars-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-4">
              Our 4 Pillars of Cleaning Excellence
            </h2>
            <p className="text-slate-600 text-base">
              The foundational standards that guide every member of our cleaning crew on every job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#e8f5ee] text-[#12582e] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#071536] mb-3">
                100% Guarantee
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                If we fail to make you happy, you do not pay. That unwavering commitment holds our team accountable on every pass.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#e8f5ee] text-[#12582e] flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#071536] mb-3">
                Vetted Specialists
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every cleaner undergoes rigorous criminal background screening, reference verification, and intensive hands-on training.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#e8f5ee] text-[#12582e] flex items-center justify-center mb-5">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#071536] mb-3">
                Green Chemistry
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We prioritize non-toxic, eco-friendly green cleaning products that protect air quality, children, and pets without sacrificing sanitizing power.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#e8f5ee] text-[#12582e] flex items-center justify-center mb-5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#071536] mb-3">
                Rotation System
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our exclusive rotation schedule cycles deep-scrub tasks across visits so your entire facility or home stays in showroom condition perpetually.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rotation System Section */}
      <RotationSystemSection />

      {/* Call to Action */}
      <section className="section py-20 bg-[#071536] text-white text-center" aria-label="About Us Call to Action">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Partner with South Florida’s Most Trusted Cleaners
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Experience the difference of dedicated professionals backed by 20+ years of family-owned excellence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact-us"
              className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-3.5 px-8 rounded-xl text-base shadow-lg transition-colors inline-flex items-center gap-2"
            >
              <span>Get Your Free Estimate</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${BUSINESS_NAP.phoneRaw}`}
              className="btn btn-phone flex items-center gap-2 py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-colors"
            >
              <Phone className="w-4 h-4 text-[#a3e6be]" />
              <span>Call (561) 704-5303</span>
            </a>
          </div>
        </div>
      </section>
    </article>
  );
};
