import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { BLOGS_DATA } from '../data';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { BlogPostItem } from '../types';

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPostItem | null>(null);
  const { data: blogs } = useFirestoreCollection<BlogPostItem>('blogs', BLOGS_DATA);

  const handleBackToList = () => {
    setSelectedPost(null);
    const el = document.getElementById('blog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectPost = (post: BlogPostItem) => {
    setSelectedPost(post);
    const el = document.getElementById('blog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="blog" className="py-24 bg-[#FAF9F5] border-b border-stone-200/50 relative overflow-hidden">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <AnimatePresence mode="wait">
          {!selectedPost ? (
            <motion.div
              key="blog-list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-16"
            >
              {/* Section Header */}
              <div className="max-w-2xl text-center mx-auto space-y-4 flex flex-col items-center">
                
                <h2 className="text-3xl md:text-5xl font-extrabold font-display text-stone-900 tracking-tight leading-tight">
                  Expert <span className="italic text-[#D03F09] font-extrabold">SEO & Marketing Insights</span>
                </h2>
                
                <p className="text-stone-600 text-sm md:text-base leading-relaxed font-normal">
                  In-depth articles, tutorials, and success playbooks on <strong>Google search rankings</strong>, conversion rate increase, and <strong>growth marketing strategies</strong>.
                </p>
              </div>

              {/* Blog Post Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col group h-full"
                  >
                    {/* Card Thumbnail Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <span className="absolute top-4 left-4 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-[#FF5B22] text-white shadow-sm">
                        {post.category}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col justify-between flex-grow space-y-6">
                      <div className="space-y-3">
                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#D03F09]" /> {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#D03F09]" /> {post.readTime}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg md:text-xl font-bold font-display text-stone-900 group-hover:text-[#D03F09] transition-colors leading-snug">
                          {post.title}
                        </h3>

                        {/* Summary */}
                        <p className="text-stone-600 text-sm leading-relaxed font-normal line-clamp-3">
                          {post.summary}
                        </p>
                      </div>

                      {/* Footer with Author and CTA Button */}
                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.author.avatarUrl}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full object-cover border border-stone-200"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <div>
                            <p className="text-xs font-bold text-stone-800 leading-none">{post.author.name}</p>
                            <p className="text-[10px] text-stone-400 font-medium mt-0.5">{post.author.role}</p>
                          </div>
                        </div>

                        <button
                          id={`read-post-${post.id}`}
                          onClick={() => handleSelectPost(post)}
                          className="flex items-center gap-1.5 text-xs font-bold text-[#D03F09] hover:text-[#B03306] transition-colors uppercase tracking-wider group/btn cursor-pointer"
                        >
                          <span>Read</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="blog-detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {/* Back Navigation Bar */}
              <div className="flex items-center justify-between">
                <button
                  id="back-to-blogs-btn"
                  onClick={handleBackToList}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-[#D03F09] transition-colors group cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-all" />
                  <span>Back to all articles</span>
                </button>

                <div className="text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded bg-[#D03F09]/10 text-[#D03F09]">
                  {selectedPost.category}
                </div>
              </div>

              {/* Title & Metadata Header */}
              <div className="space-y-6">
                <h1 className="text-3xl md:text-5xl font-extrabold font-display text-stone-900 tracking-tight leading-tight">
                  {selectedPost.title}
                </h1>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-stone-200/60">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedPost.author.avatarUrl}
                      alt={selectedPost.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-sm font-bold text-stone-900 leading-none">{selectedPost.author.name}</p>
                      <p className="text-xs text-stone-500 mt-1 font-medium">{selectedPost.author.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#D03F09]" /> {selectedPost.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#D03F09]" /> {selectedPost.readTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Banner Image */}
              <div className="relative aspect-[16/9] w-full bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* HTML Content Body */}
              <div 
                className="prose prose-stone max-w-none text-stone-700 leading-relaxed text-sm md:text-base font-normal space-y-6 py-6"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />

              {/* bottom bar */}
              <div className="pt-8 border-t border-stone-200/60 flex items-center justify-between">
                <button
                  id="bottom-back-to-blogs-btn"
                  onClick={handleBackToList}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-[#D03F09] transition-colors group cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-all" />
                  <span>Back to all articles</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
