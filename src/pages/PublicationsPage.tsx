import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/siteData';
import { InteriorHero, INTERIOR_HERO_IMAGES } from '../components/ui/InteriorHero';
import { ArrowRight, Search, X } from 'lucide-react';

export const PublicationsPage: React.FC = () => {
  const uniqueCategories = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));
  const categories: string[] = ['All Guides', ...uniqueCategories];
  const [selectedCategory, setSelectedCategory] = useState<string>('All Guides');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === 'All Guides' || post.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.summary.toLowerCase().includes(normalizedQuery) ||
      post.category.toLowerCase().includes(normalizedQuery)
    );
  });

  const handleResetFilters = () => {
    setSelectedCategory('All Guides');
    setSearchQuery('');
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <InteriorHero
        ariaLabel="Our Publications Header"
        kicker="Fresh Tips & Home Care Guides"
        title="Our Publications & Cleaning Guides"
        description={`Browse ${BLOG_POSTS.length} easy-to-follow cleaning guides, time-saving tips, and home care checklists written by our local South Florida team.`}
        imageSrc={INTERIOR_HERO_IMAGES.sparklingKitchen}
        imageAlt="Sparkling sunlit South Florida modern kitchen interior"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Our Publications' }
        ]}
      />

      {/* Filter Bar & Blog Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs & Live Keyword Search */}
          <div className="flex flex-col gap-5 pb-8 mb-10 border-b border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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

              <div className="relative w-full lg:w-80 shrink-0">
                <label htmlFor="publications-search-input" className="sr-only">
                  Search cleaning guides
                </label>
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="publications-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guides (kitchen, office)..."
                  className="w-full pl-10 pr-10 py-2.5 min-h-[44px] rounded-xl bg-white border border-slate-200 text-sm text-[#0b1926] placeholder:text-slate-400 focus:outline-none focus:border-[#2a8655] focus:ring-2 focus:ring-[#2a8655]/20 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear guide search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-[#0b1926] hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-mono uppercase tracking-[0.12em] text-slate-500 tabular-nums">
                Showing {filteredPosts.length} of {BLOG_POSTS.length} Guides
              </p>
              {(selectedCategory !== 'All Guides' || searchQuery.trim() !== '') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-[#2a8655] hover:text-[#1f6840] underline underline-offset-4 cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-10 sm:p-14 text-center max-w-xl mx-auto shadow-xs space-y-4">
              <p className="text-lg font-extrabold text-[#0b1926]">
                No cleaning guides matched &ldquo;{searchQuery.trim()}&rdquo;
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Try searching a broader room or topic—like kitchen, move-out, rental, or office—or view our full library of guides.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center px-5 py-3 min-h-[44px] rounded-xl bg-[#2a8655] hover:bg-[#1f6840] text-white text-sm font-bold transition-colors cursor-pointer"
              >
                Reset Filters &amp; Show All {BLOG_POSTS.length} Guides
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </section>
    </div>
  );
};
