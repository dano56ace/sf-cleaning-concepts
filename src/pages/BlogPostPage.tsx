import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, User, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BLOG_POSTS, BUSINESS_NAP, SERVICES_CATALOG } from '../data/siteData';

const EXACT_BLOG_H1_MAP: { [slug: string]: string } = {
  'revitalize-your-office-space': 'Revitalize Your Office Space with South Florida Cleaning Concepts: Unleashing the Power of a Pristine Workspace',
  'complete-guide-to-home-cleaning': 'South Florida Cleaning Concepts – Complete Guide to Home Cleaning Tips and Tricks',
  'restaurant-and-bar-cleaning-services': 'Shining a Light on Clean: How Restaurant and Bar Cleaning Services Enhance Your Business',
  'office-cleaning-made-easy': 'Office Cleaning Made Easy with South Florida Cleaning Concepts',
  'short-term-rental-cleaning-guide': 'Short Term Rental Cleaning with South Florida Cleaning Concepts: The Ultimate Guide',
  'high-quality-cleaning-services-south-florida': 'High-Quality Cleaning Services South Florida with South Florida Cleaning Concepts',
  'medical-office-cleaning-guide': 'Medical Office Cleaning with South Florida Cleaning Concepts: A Comprehensive Guide',
  'deep-cleaning-for-homes-and-offices': 'Deep Cleaning for Homes and Offices with South Florida Cleaning Concepts',
  'post-construction-cleaning-guide': 'Post-Construction Cleaning with South Florida Cleaning Concepts: A Comprehensive Guide',
  'south-florida-home-maintenance-services': 'Maximize the Beauty of Your Home: South Florida Home Maintenance Services with South Florida Cleaning Concepts',
  'residential-cleaning-services-journey': 'Revitalize Your Home: A Journey with South Florida Cleaning Concepts’ Residential Cleaning Services'
};

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const cleanSlug = slug?.replace(/\.html$/, '');
  const post = BLOG_POSTS.find((p) => p.slug === cleanSlug);

  if (!post) {
    return <Navigate to="/our-publications" replace />;
  }

  const exactH1 = EXACT_BLOG_H1_MAP[post.slug] || post.title;

  return (
    <article className="blog-post-page">
      {/* Subpage Hero Header */}
      <section className="page-hero relative bg-[#071536] text-white py-20 overflow-hidden" aria-label="Article Header">
        <div className="container relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12582e] text-emerald-100 text-xs font-bold uppercase tracking-wider mb-4">
            <span>{post.category}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            {exactH1}
          </h1>
          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-slate-300 mb-6">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#a3e6be]" />
              <span>South Florida Cleaning Concepts Editorial Team</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#a3e6be]" />
              <span>{post.date}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#a3e6be]" />
              <span>{post.readTime}</span>
            </span>
          </div>
          <nav className="breadcrumbs flex items-center justify-center gap-2 text-xs font-semibold text-slate-300" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/our-publications" className="hover:text-white transition-colors">Publications</Link>
            <span>/</span>
            <span aria-current="page" className="text-[#a3e6be] truncate max-w-xs">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Main Article Body Section */}
      <section className="section py-16 sm:py-20 bg-white" aria-labelledby="article-content-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Article Featured Banner Image */}
          <div className="rounded-3xl overflow-hidden shadow-xl mb-12 border border-slate-100 bg-slate-100">
            <img
              src={post.image}
              alt={post.title}
              width="1200"
              height="600"
              className="w-full h-80 sm:h-[450px] object-cover"
            />
          </div>

          {/* Lead Summary Callout */}
          <div className="bg-[#e8f5ee] border-l-4 border-[#12582e] p-6 rounded-r-2xl mb-12">
            <h2 id="article-content-heading" className="text-lg font-bold text-[#071536] mb-2">
              Executive Summary
            </h2>
            <p className="text-slate-700 text-base leading-relaxed m-0 italic">
              {post.summary}
            </p>
          </div>

          {/* Article Content Sections */}
          <div className="article-body space-y-10">
            {post.sections.map((section, idx) => (
              <div key={idx} className="section-block">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071536] mb-4">
                  {section.heading}
                </h2>
                <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
                  {section.paragraphs.map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-6 space-y-2.5 p-0 m-0 list-none">
                    {section.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-slate-700 text-sm sm:text-base">
                        <CheckCircle2 className="w-5 h-5 text-[#12582e] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Cross-Service Promotion Banner */}
          <div className="mt-16 p-8 rounded-3xl bg-[#071536] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12582e] text-emerald-100 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Professional Cleaners</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Need Professional Cleaning in South Florida?
              </h3>
              <p className="text-slate-300 text-sm m-0">
                Contact our specialists today for a personalized commercial or residential estimate.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/contact-us"
                className="btn btn-primary bg-[#12582e] hover:bg-[#0d4222] text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
              >
                Get Free Quote
              </Link>
              <a
                href={`tel:${BUSINESS_NAP.phoneRaw}`}
                className="btn btn-phone p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Call (561) 704-5303"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Publications */}
      <section className="section py-16 bg-slate-50 border-t border-slate-200/60" aria-label="Related Articles">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#071536] m-0">
              More Cleaning Insights
            </h2>
            <Link to="/our-publications" className="text-sm font-bold text-[#12582e] hover:underline flex items-center gap-1">
              <span>View All Guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.filter((p) => p.slug !== post.slug)
              .slice(0, 3)
              .map((other) => (
                <Link
                  key={other.slug}
                  to={`/blog/${other.slug}`}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#12582e]/40 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#12582e] uppercase tracking-wider block mb-2">
                      {other.category}
                    </span>
                    <h3 className="text-base font-bold text-[#071536] group-hover:text-[#12582e] transition-colors mb-2 line-clamp-2">
                      {other.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {other.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-[#12582e]">
                    <span>Read Article</span>
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
