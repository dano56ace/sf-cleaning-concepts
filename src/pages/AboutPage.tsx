import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Heart, Users, CheckCircle2, Phone, ArrowRight } from 'lucide-react';
import { BUSINESS_NAP } from '../data/siteData';
import { RotationSystemSection } from '../components/ui/TrustBadges';

export const AboutPage: React.FC = () => {
  return (
    <article className="about-page">
      {/* Subpage Hero Header */}
      <section className="page-hero relative bg-[#071536] text-white py-20 lg:py-24 overflow-hidden border-b border-slate-800" aria-label="About Us Header">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/assets/images/about/about-us-img-4.jpg"
            alt="South Florida Cleaning Concepts Facility Background"
            width="1920"
            height="600"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071536] via-[#071536]/80 to-[#071536]/60" />
        </div>
        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="editorial-kicker-light mb-4 justify-center">
            <span>Est. 2004 · Family-Owned &amp; Operated</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            About Us
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
            Over 20 years of family-owned excellence, background-checked specialists, and our ironclad 100% satisfaction guarantee across Palm Beach, Broward &amp; Miami-Dade counties.
          </p>
          <nav className="breadcrumbs flex items-center justify-center gap-2 text-xs font-mono font-semibold text-slate-300" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span aria-current="page" className="text-[#a3e6be]">About Us</span>
          </nav>
        </div>
      </section>

      {/* Main Story & Values Section */}
      <section className="section py-20 lg:py-24 bg-white" aria-labelledby="story-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="editorial-kicker mb-3">
                <span>Our Heritage &amp; Accountability</span>
              </div>
              <h2 id="story-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-6">
                20+ Years of Dedication to South Florida Properties
              </h2>
              <div className="space-y-4 text-slate-600 text-base leading-relaxed">
                <p>
                  South Florida Cleaning Concepts was founded with a singular commitment: to deliver an uncompromising standard of cleanliness backed by total accountability and personal supervision. Over the past two decades, our family-owned enterprise has grown into one of the region’s most trusted commercial janitorial and luxury residential cleaning teams.
                </p>
                <p>
                  We treat every corporate headquarters, medical clinic, hospitality venue, and private coastal estate with the same meticulous care that we demand in our own home. Our team members are not transient subcontractors—they are background-checked, bonded, and trained employees who take pride in their craft.
                </p>
                <p>
                  We stand firmly behind our signature 100% Satisfaction Guarantee: if you are ever dissatisfied with any portion of our work, notify us within 24 hours and we will return promptly to re-clean for free—or you do not pay.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200/80">
                <div>
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#071536] tabular-nums">20+</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Years Operating</div>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#12582e] tabular-nums">100%</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Money-Back Pledge</div>
                </div>
                <div className="col-span-2 sm:col-span-1 sm:border-l sm:border-slate-200 sm:pl-4 pt-2 sm:pt-0">
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#071536] tabular-nums">3 Counties</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Tri-County Dispatch</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
                <div className="sm:col-span-7 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
                  <img
                    src="/assets/images/about/about-us-img-5.jpg"
                    alt="South Florida Cleaning Concepts Professional Cleaning Specialists"
                    width="800"
                    height="600"
                    className="w-full h-full min-h-[280px] object-cover"
                  />
                </div>
                <div className="sm:col-span-5 flex flex-col justify-between gap-4">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-48 sm:h-full">
                    <img
                      src="/assets/images/about/about-us-img-7.jpg"
                      alt="Sanitization Equipment and Microfiber Detailing"
                      width="500"
                      height="400"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-[#071536] text-white p-6 rounded-2xl border border-slate-800">
                    <div className="font-mono text-xs text-[#a3e6be] uppercase tracking-widest mb-1.5">
                      Direct Supervisor Oversight
                    </div>
                    <p className="text-sm font-medium text-slate-200 leading-relaxed m-0">
                      Every commercial and residential account is inspected against our 50-point quality checklist.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Excellence */}
      <section className="section py-20 lg:py-24 bg-white border-t border-slate-200/80" aria-labelledby="pillars-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <div className="editorial-kicker mb-3">
              <span>Operational Standards</span>
            </div>
            <h2 id="pillars-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-3">
              Our 4 Pillars of Cleaning Excellence
            </h2>
            <p className="text-slate-600 text-base sm:text-lg m-0">
              The foundational standards that guide every member of our cleaning crew on every job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                icon: ShieldCheck,
                title: '100% Guarantee',
                desc: 'If we fail to make you happy, you do not pay. That unwavering commitment holds our team accountable on every pass.'
              },
              {
                num: '02',
                icon: Users,
                title: 'Vetted Specialists',
                desc: 'Every cleaner undergoes rigorous criminal background screening, reference verification, and intensive hands-on training.'
              },
              {
                num: '03',
                icon: Heart,
                title: 'Green Chemistry',
                desc: 'We prioritize non-toxic, eco-friendly green cleaning products that protect indoor air quality, children, and pets.'
              },
              {
                num: '04',
                icon: Award,
                title: 'Rotation System',
                desc: 'Our exclusive rotation schedule cycles deep-scrub tasks across visits so your entire property stays in showroom condition.'
              }
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.num}
                  className="p-7 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:bg-white hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-11 h-11 rounded-xl bg-[#071536] text-[#a3e6be] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-400 tabular-nums">
                        {pillar.num}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-[#071536] mb-2.5">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed m-0">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rotation System Section */}
      <RotationSystemSection />

      {/* Call to Action */}
      <section className="section py-20 bg-[#071536] text-white text-center border-t border-slate-800" aria-label="About Us Call to Action">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="editorial-kicker-light mb-4 justify-center">
            <span>Schedule Your Walkthrough</span>
          </div>
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
              className="btn btn-phone flex items-center gap-2 py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-semibold transition-colors tabular-nums"
            >
              <Phone className="w-4 h-4 text-[#a3e6be]" />
              <span>Call {BUSINESS_NAP.phone}</span>
            </a>
          </div>
        </div>
      </section>
    </article>
  );
};
