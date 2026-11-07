import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { BLOG_POSTS } from '../data/siteData';

export const PublicationsPage: React.FC = () => {
  return (
    <article className="publications-page">
      {/* Subpage Hero Header */}
      <section className="page-hero relative bg-[#071536] text-white py-20 overflow-hidden" aria-label="Publications Header">
        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Our Publications &amp; Cleaning Guides
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Read professional cleaning guides, OSHA sanitation insights, and property maintenance advice from South Florida Cleaning Concepts.
          </p>
          <nav className="breadcrumbs flex items-center justify-center gap-2 text-xs font-semibold text-slate-300" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span aria-current="page" className="text-[#a3e6be]">Publications</span>
          </nav>
        </div>
      </section>

      {/* Publications Listing Grid */}
      <section className="section py-20 bg-white" aria-labelledby="articles-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5ee] text-[#12582e] text-xs font-bold uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Expert Knowledge Base</span>
            </div>
            <h2 id="articles-heading" className="text-3xl sm:text-4xl font-extrabold text-[#071536] mb-4">
              11 Educational Cleaning Articles &amp; Advice
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Written by experienced commercial janitorial supervisors and residential estate specialists to help you preserve your property’s beauty and hygiene.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="blog-card group rounded-2xl overflow-hidden border border-slate-200/80 bg-white hover:shadow-xl hover:border-[#12582e]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      width="600"
                      height="380"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-[#071536]/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{post.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#071536] mb-3 group-hover:text-[#12582e] transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#12582e] group-hover:text-[#0d4222] transition-colors"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
};
