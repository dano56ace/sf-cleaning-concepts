import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BLOG_POSTS } from '../data/siteData';
import { QuoteForm } from '../components/ui/QuoteForm';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const EXACT_BLOG_H1_MAP: Record<string, string> = {
  'revitalize-your-office-space': 'Revitalize Your Office Space with South Florida Cleaning Concepts: Unleashing the Power of a Pristine Workspace',
  'post-construction-cleaning-guide': 'Post-Construction Cleaning with South Florida Cleaning Concepts: A Comprehensive Guide',
  'office-cleaning-made-easy': 'Office Cleaning Made Easy with South Florida Cleaning Concepts',
  'medical-office-cleaning-guide': 'Medical Office Cleaning with South Florida Cleaning Concepts: A Comprehensive Guide',
  'restaurant-and-bar-cleaning-services': 'Shining a Light on Clean: How Restaurant and Bar Cleaning Services Enhance Your Business',
  'residential-cleaning-services-journey': 'Revitalize Your Home: A Journey with South Florida Cleaning Concepts’ Residential Cleaning Services',
  'complete-guide-to-home-cleaning': 'South Florida Cleaning Concepts – Complete Guide to Home Cleaning Tips and Tricks',
  'deep-cleaning-for-homes-and-offices': 'Deep Cleaning for Homes and Offices with South Florida Cleaning Concepts',
  'south-florida-home-maintenance-services': 'Maximize the Beauty of Your Home: South Florida Home Maintenance Services with South Florida Cleaning Concepts',
  'high-quality-cleaning-services-south-florida': 'High-Quality Cleaning Services South Florida with South Florida Cleaning Concepts',
  'short-term-rental-cleaning-guide': 'Short Term Rental Cleaning with South Florida Cleaning Concepts: The Ultimate Guide',
};

export const BlogPostPage: React.FC = () => {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const slug = rawSlug ? rawSlug.replace(/\.html$/, '') : undefined;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  const exactH1 = (slug && EXACT_BLOG_H1_MAP[slug]) || post.title;
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Article Header */}
      <section className="relative bg-[#07111a] text-white py-20 lg:py-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img
            src={post.image}
            alt={exactH1}
            className="w-full h-full object-cover opacity-25"
            width="1920"
            height="700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111a] via-[#07111a]/85 to-[#07111a]/60"></div>
          <div className="absolute inset-0 bg-architectural-grid opacity-15"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-slate-400 mb-6"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-slate-600">/</span>
            <Link to="/our-publications" className="hover:text-white transition-colors">
              Our Publications
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-[#4fd18b] font-semibold">{post.category}</span>
          </nav>

          <div className="editorial-kicker-light mb-4">
            {post.category} · Technical Publication
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-[1.12] text-white">
            {exactH1}
          </h1>

          {/* Unboxed inline metadata separated by middot */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono text-slate-300">
            <span className="font-semibold text-white">By South Florida Cleaning Concepts</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>{post.date}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="text-[#4fd18b] tabular-nums">{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Article Body & Sidebar */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Article Content */}
            <article className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-sm">
              <div className="rounded-2xl overflow-hidden mb-8 shadow-md border border-slate-100">
                <img
                  src={post.image}
                  alt={exactH1}
                  className="w-full h-64 sm:h-96 object-cover"
                  width="900"
                  height="500"
                />
              </div>

              {/* Clean all-around bordered Executive Summary box (zero border-l-4) */}
              <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 mb-8">
                <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#2a8655] font-bold block mb-2">
                  Executive Summary
                </span>
                <p className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="space-y-8 text-slate-700 leading-relaxed">
                {post.sections.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b1926] tracking-tight">
                      {section.heading}
                    </h2>
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-base sm:text-lg leading-relaxed text-slate-700">
                        {p}
                      </p>
                    ))}
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="space-y-2.5 pt-2">
                        {section.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                            <CheckCircle2 className="w-5 h-5 text-[#2a8655] shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Recommended Action Banner */}
              <div className="mt-10 p-6 sm:p-8 bg-[#07111a] text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/10">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#4fd18b] font-semibold block mb-1">
                    Recommended Service Protocol
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Ready to schedule professional {post.category.toLowerCase()}?
                  </h3>
                </div>
                <Link
                  to="/our-services"
                  className="bg-[#2a8655] hover:bg-[#1f6840] text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors shrink-0 whitespace-nowrap inline-flex items-center gap-1.5"
                >
                  Explore Services
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>

            {/* Sidebar Quote Form */}
            <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
              <QuoteForm source={`Blog: ${post.title}`} />
            </aside>
          </div>
        </div>
      </section>

      {/* More Publications */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="editorial-kicker mb-2">
                Continue Reading
              </div>
              <h2 className="text-2xl font-extrabold text-[#0b1926] tracking-tight">
                Related Cleaning Guides
              </h2>
            </div>
            <Link
              to="/our-publications"
              className="text-sm font-bold text-[#2a8655] hover:text-[#1f6840] whitespace-nowrap inline-flex items-center gap-1.5"
            >
              View All Publications
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.slug}
                to={`/blog/${rel.slug}`}
                className="group bg-[#f8fafc] rounded-2xl p-6 border border-slate-200/90 hover:border-[#2a8655]/40 hover:bg-white hover:shadow-md transition-all"
              >
                <div className="text-xs font-mono text-slate-500 mb-2 flex items-center gap-1.5">
                  <span className="font-semibold text-[#2a8655] uppercase">{rel.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{rel.readTime}</span>
                </div>
                <h3 className="text-base font-extrabold text-[#0b1926] group-hover:text-[#2a8655] transition-colors mb-2 line-clamp-2">
                  {rel.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{rel.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
