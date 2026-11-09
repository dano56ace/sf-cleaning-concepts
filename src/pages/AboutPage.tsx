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
            <span>Family-Owned Since 2004 · Your Local South Florida Neighbors</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            About Us
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
            For over 20 years, our family-owned team has helped South Florida homeowners, vacation rental hosts, and local businesses enjoy spotless spaces—backed by our Love Your Clean or Don’t Pay guarantee.
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
                <span>Our Family Story &amp; Promise</span>
              </div>
              <h2 id="story-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-6">
                20+ Years of Making South Florida Homes &amp; Workplaces Sparkle
              </h2>
              <div className="space-y-4 text-slate-600 text-base leading-relaxed">
                <p>
                  We started South Florida Cleaning Concepts over 20 years ago with a simple belief: when you invite someone into your home or business, you deserve a friendly team that treats your space with the exact same care they’d give their own family’s home.
                </p>
                <p>
                  Unlike big national franchises that send random, revolving-door contractors, our cleaners are full-time, background-checked, and trained team members who genuinely love making your place shine. We bring all the supplies, show up on time, and never cut corners.
                </p>
                <p>
                  Best of all, we stand behind every single visit with our famous <strong>Love Your Clean or Don’t Pay Guarantee</strong>: if anything isn’t 100% up to your standards, just let us know within 24 hours and we’ll come right back to make it right for free—or you don’t pay a dime.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200/80">
                <div>
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#071536] tabular-nums">20+</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Years in Business</div>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#12582e] tabular-nums">100%</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Happy Home Pledge</div>
                </div>
                <div className="col-span-2 sm:col-span-1 sm:border-l sm:border-slate-200 sm:pl-4 pt-2 sm:pt-0">
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#071536] tabular-nums">3 Counties</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Local Coverage</div>
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
                      Personal Quality Check
                    </div>
                    <p className="text-sm font-medium text-slate-200 leading-relaxed m-0">
                      Every single clean is checked against our 50-point room-by-room sparkle checklist before we lock up.
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
              <span>Why Families &amp; Businesses Love Us</span>
            </div>
            <h2 id="pillars-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-3">
              4 Reasons You’ll Love Coming Home to Our Clean
            </h2>
            <p className="text-slate-600 text-base sm:text-lg m-0">
              Here’s how we make sure every visit is effortless, safe, and spotless from top to bottom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                icon: ShieldCheck,
                title: 'Love It or Don’t Pay',
                desc: 'If you aren’t smiling when you walk through the door, you don’t pay. We’ll re-clean any spot for free within 24 hours.'
              },
              {
                num: '02',
                icon: Users,
                title: 'Friendly, Vetted Pros',
                desc: 'Every cleaner is background-checked, insured, and trained by our family team so you always feel comfortable handing us the keys.'
              },
              {
                num: '03',
                icon: Heart,
                title: 'Kid & Pet Safe',
                desc: 'We bring all our own gentle, eco-friendly cleaning supplies and fresh microfiber cloths—zero harsh chemical smells.'
              },
              {
                num: '04',
                icon: Award,
                title: '4-Step Rotation Clean',
                desc: 'We rotate deep-detailing work across your kitchens, baths, bedrooms, and living areas so dust and grime never build up.'
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
            <span>Get Your Weekend Back</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Let Our Family Take Care of Your Clean?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            See why hundreds of South Florida homeowners and businesses trust us every single week. Get your free, no-obligation quote in minutes!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact-us"
              className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-3.5 px-8 rounded-xl text-base shadow-lg transition-colors inline-flex items-center gap-2"
            >
              <span>Book My Free Quote</span>
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
