import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Calendar, Clock, X, ArrowRight, User } from 'lucide-react';
import { BLOGS_DATA } from '../data';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { BlogPostItem } from '../types';

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPostItem | null>(null);
  const { data: blogs } = useFirestoreCollection<BlogPostItem>('blogs', BLOGS_DATA);

  return (
    <section id="blog" className="py-24 bg-[#FAF9F5] border-b border-stone-200/50 relative overflow-hidden">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="max-w-2xl text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/60 border border-orange-200/50 text-[#FF5B22] text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B22] animate-pulse" />
            <span>Articles</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-stone-900 tracking-tight leading-tight">
            Latest Stories & <br />
            <span className="italic text-[#FF5B22] font-extrabold">Insights</span>
          </h2>
          
          <p className="text-stone-600 text-sm md:text-base leading-relaxed font-normal">
            Sharing thoughts, lessons, and deep-dives on modern web design, typography, and frontend engineering craft.
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
                      <Calendar className="w-3.5 h-3.5 text-[#FF5B22]" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#FF5B22]" /> {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold font-display text-stone-900 group-hover:text-[#FF5B22] transition-colors leading-snug">
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
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-800 leading-none">{post.author.name}</p>
                      <p className="text-[10px] text-stone-400 font-medium mt-0.5">{post.author.role}</p>
                    </div>
                  </div>

                  <button
                    id={`read-post-${post.id}`}
                    onClick={() => setSelectedPost(post)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#FF5B22] hover:text-[#E04B15] transition-colors uppercase tracking-wider group/btn cursor-pointer"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Immersive Reading Overlay Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md">
            {/* Modal Backdrop click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 cursor-zoom-out"
            />

            {/* Modal Content Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-3xl max-h-[85vh] bg-[#FAF9F5] rounded-2xl border border-stone-200 overflow-hidden shadow-2xl flex flex-col z-10"
            >
              {/* Close Button */}
              <button
                id="close-reading-modal"
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer shadow-lg"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Container */}
              <div className="overflow-y-auto flex-grow scrollbar-thin">
                {/* Hero Header Image */}
                <div className="relative aspect-[16/9] w-full bg-stone-100">
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                  
                  {/* Category Pill and Title inside Hero Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded bg-[#FF5B22] text-white">
                      {selectedPost.category}
                    </span>
                    <h2 className="text-xl md:text-3xl font-extrabold font-display leading-tight drop-shadow-sm">
                      {selectedPost.title}
                    </h2>
                  </div>
                </div>

                {/* Article Info and Body */}
                <div className="p-6 md:p-10 space-y-8">
                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-stone-200/60">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedPost.author.avatarUrl}
                        alt={selectedPost.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-stone-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-sm font-bold text-stone-900">{selectedPost.author.name}</p>
                        <p className="text-xs text-stone-500 font-medium">{selectedPost.author.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-[#FF5B22]" /> {selectedPost.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-[#FF5B22]" /> {selectedPost.readTime}
                      </span>
                    </div>
                  </div>

                  {/* HTML Content Body */}
                  <div 
                    className="prose prose-stone max-w-none text-stone-700 leading-relaxed text-sm md:text-base font-normal space-y-4"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-stone-100/50 border-t border-stone-200 flex items-center justify-end">
                <button
                  id="modal-close-btn"
                  onClick={() => setSelectedPost(null)}
                  className="bg-stone-900 hover:bg-stone-850 text-white text-xs font-semibold py-2 px-5 rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
