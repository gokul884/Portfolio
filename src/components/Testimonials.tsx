import { useState } from 'react';
import { TESTIMONIALS_DATA } from '../data';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { TestimonialItem } from '../types';
import { Star, MessageSquare, Twitter, Linkedin, Facebook, Instagram, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Testimonials() {
  const [filter, setFilter] = useState<'all' | '5' | '4'>('all');
  const { data: testimonials } = useFirestoreCollection<TestimonialItem>('testimonials', TESTIMONIALS_DATA);

  const filteredData = testimonials.filter((testimonial) => {
    if (filter === 'all') return true;
    return testimonial.rating.toString() === filter;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300 fill-stone-100'
            }`}
          />
        ))}
      </div>
    );
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-4 h-4 text-[#1DA1F2]" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-[#0A66C2]" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-[#1877F2]" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-[#E1306C]" />;
      default:
        return <MessageSquare className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-[#FAF9F5] border-b border-stone-200/50 relative overflow-hidden">
      
      {/* Decorative pattern */}
      <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/60 border border-orange-200/50 text-[#FF5B22] text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B22]" />
            <span>Testimonials</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-stone-900 tracking-tight leading-tight">
            What Our <span className="italic text-[#FF5B22] font-extrabold pl-1">Customers</span> Saying
          </h2>
          
          <p className="text-stone-600 text-sm md:text-base leading-relaxed font-normal">
            Hear directly from our clients about their experiences working with us. Their feedback reflects our commitment to quality, creativity, and results that make a real impact.
          </p>

          {/* Dynamic Filter Controls to elevate interactivity */}
          <div className="flex justify-center items-center gap-3 pt-6">
            <button
              id="filter-all"
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
              }`}
            >
              All Reviews ({testimonials.length})
            </button>
            <button
              id="filter-5"
              onClick={() => setFilter('5')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1 cursor-pointer ${
                filter === '5'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
              }`}
            >
              <span>5 Stars</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </button>
            <button
              id="filter-4"
              onClick={() => setFilter('4')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1 cursor-pointer ${
                filter === '4'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
              }`}
            >
              <span>4 Stars</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Testimonials Masonry / Grid with AnimatePresence */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredData.map((testimonial) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={testimonial.id}
                className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between space-y-6 group"
              >
                {/* Top Row: platform icon and time */}
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                    {getPlatformIcon(testimonial.platform)}
                  </div>
                  <span className="font-medium">{testimonial.timeAgo}</span>
                </div>

                {/* Review Text */}
                <p className="text-stone-700 text-sm leading-relaxed font-light italic flex-grow">
                  "{testimonial.text}"
                </p>

                {/* Bottom Row: Stars and User profile */}
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  {renderStars(testimonial.rating)}

                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatarUrl}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200 select-none"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-sm font-bold text-stone-900 flex items-center gap-1">
                        {testimonial.name}
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />
                      </p>
                      <p className="text-[11px] text-stone-500 font-medium">
                        {testimonial.role} at <span className="text-[#FF5B22]">{testimonial.company}</span>
                      </p>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Trust badge */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-3 text-stone-500 text-xs font-semibold">
          <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5B22]" /> 100% Client Satisfaction Guaranteed
          </span>
          <span className="hidden sm:inline text-stone-300">•</span>
          <span className="bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm">
            Top Rated on Upwork & Dribbble
          </span>
        </div>

      </div>
    </section>
  );
}
