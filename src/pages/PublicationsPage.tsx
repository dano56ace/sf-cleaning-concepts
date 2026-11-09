import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/siteData';
import { ArrowRight } from 'lucide-react';

export const PublicationsPage: React.FC = () => {
  const uniqueCategories = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));
  const categories: string[] = ['All Guides', ...uniqueCategories];
  const [selectedCategory, setSelectedCategory] = useState<string>('All Guides');

  const filteredPosts =
    selectedCategory === 'All Guides'
      ? BLOG_POSTS
      : BLOG_POSTS.filter((post) => post.category === selectedCategory);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Subpage Hero */}
      <section className="relative bg-[#07111a] text-white py-20 lg:py-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/blog/blog-img-1.jpg"
            alt="Our Publications - South Florida Cleaning Concepts"
            className="w-full h-full object-cover opacity-20"
            width="1920"
            height="600"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111a] via-[#07111a]/85 to-transparent"></div>
          <div className="absolute inset-0 bg-architectural-grid opacity-15"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="editorial-kicker-light mb-4">
              Fresh Tips &amp; Home Care Guides
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 text-white">
              Our Publications &amp; Cleaning Guides
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Browse {BLOG_POSTS.length} easy-to-follow cleaning guides, time-saving tips, and home care checklists written by our local South Florida team.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar & Blog Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Segmented Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-10 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter publications by category">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
                      isActive
                        ? 'bg-[#0b1926] text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-[#0b1926]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-mono uppercase tracking-[0.12em] text-slate-500 tabular-nums">
              Showing {filteredPosts.length} of {BLOG_POSTS.length} Guides
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#2a8655]/40 transition-all duration-300 flex flex-col group"
              >
                <Link to={`/blog/${post.slug}`} className="relative h-56 overflow-hidden block bg-slate-900">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07111a]/70 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-4 font-mono text-xs font-bold text-white/90 tracking-widest tabular-nums">
                    ARTICLE {String(idx + 1).padStart(2, '0')}
                  </span>
                </Link>

                <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Unboxed inline metadata separated by middot */}
                    <div className="text-xs font-mono text-slate-500 mb-3 flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold text-[#2a8655] uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{post.date}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{post.readTime}</span>
                    </div>

                    <h2 className="text-xl font-extrabold text-[#0b1926] mb-3 group-hover:text-[#2a8655] transition-colors leading-snug">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0b1926] group-hover:text-[#2a8655] transition-colors"
                    >
                      Read Full Guide
                      <ArrowRight className="w-4 h-4 text-[#2a8655] group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
