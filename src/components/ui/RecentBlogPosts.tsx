import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../../data/siteData';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

export interface RecentBlogPostsProps {
  limit?: number;
}

export const RecentBlogPosts: React.FC<RecentBlogPostsProps> = ({ limit = 3 }) => {
  const posts = BLOG_POSTS.slice(0, limit);

  return (
    <section
      className="section py-20 lg:py-24 bg-white border-t border-slate-200/80"
      aria-labelledby="recent-blog-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="editorial-kicker mb-3">
              <span>From Our Cleaning Journal</span>
            </div>
            <h2
              id="recent-blog-heading"
              className="text-3xl sm:text-4xl font-extrabold text-[#071536] tracking-tight mb-3"
            >
              Expert Cleaning Insights &amp; Guides
            </h2>
            <p className="text-slate-600 text-base m-0 leading-relaxed">
              Practical sanitation protocols, commercial facility maintenance strategies, and residential cleaning advice from South Florida's leading specialists.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              to="/our-publications"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-[#12582e] hover:text-white text-[#071536] font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-sm group"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#12582e]/30 transition-all duration-300 overflow-hidden"
            >
              <Link
                to={`/blog/${post.slug}`}
                className="relative aspect-[16/10] overflow-hidden bg-slate-100 block"
                aria-label={`Read article: ${post.title}`}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  width="600"
                  height="375"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/95 text-[#12582e] rounded-full shadow-sm backdrop-blur-xs">
                    {post.category}
                  </span>
                </div>
              </Link>
              <div className="p-6 sm:p-7 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-3">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{post.date}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="tabular-nums">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-[#071536] group-hover:text-[#12582e] transition-colors mb-3 leading-snug">
                  <Link to={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {post.summary}
                </p>
                <div className="pt-4 border-t border-slate-100 mt-auto">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#12582e] hover:text-[#0d4222] transition-colors group/link"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
