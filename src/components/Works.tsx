import { motion } from 'motion/react';
import { WORKS_DATA } from '../data';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { WorkItem } from '../types';
import { ArrowUpRight, FolderOpen, ArrowRight } from 'lucide-react';

export default function Works() {
  const { data: works } = useFirestoreCollection<WorkItem>('works', WORKS_DATA);

  return (
    <section id="works" className="py-24 bg-[#0D0E10] text-stone-100 relative overflow-hidden bg-dot-grid-dark border-y border-stone-800">
      
      {/* Decorative light leaks or gradient spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#FF5B22]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header container with flex layout for desktop */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
              My Latest <span className="italic text-[#FF5B22] font-extrabold pl-1">Works</span>
            </h2>
            <p className="text-stone-400 text-sm md:text-base leading-relaxed font-normal">
              Browse through my latest <strong>marketing case studies</strong>, successful <strong>SEO campaigns</strong>, beautiful <strong>website designs</strong>, and creative <strong>visual designs</strong> engineered for max performance.
            </p>
          </div>
          
          <div>
            <a
              id="view-all-projects-btn"
              href="#works"
              className="inline-flex items-center gap-2 bg-[#FF5B22] hover:bg-[#E04B15] text-white text-sm font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md"
            >
              <span>View All Projects</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Works Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {works.map((work) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="group flex flex-col space-y-6 bg-stone-900/60 border border-stone-800/80 rounded-3xl p-6 hover:border-stone-700 transition-all duration-300"
            >
              
              {/* Image Frame with hover interactions */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-950/80 border border-stone-800/60">
                <img
                  src={work.imageUrl}
                  alt={work.title}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-104 transition-all duration-700 select-none filter brightness-95 group-hover:brightness-100"
                  referrerPolicy="no-referrer"
                />

                {/* Specific sticker widget for 'Digital Agency' card */}
                {work.id === 'digital-agency' && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer pointer-events-none">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 bg-[#FF5B22] rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                      <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                        <defs>
                          <path
                            id="clickHerePath"
                            d="M 50, 50 m -30, 0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0"
                          />
                        </defs>
                        <text fill="#ffffff" className="text-[10px] font-bold tracking-[0.15em] font-display">
                          <textPath href="#clickHerePath">
                            • CLICK HERE • CLICK HERE 
                          </textPath>
                        </text>
                      </svg>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Badge tags overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-sm border border-stone-700/60 text-xs font-semibold text-[#FF5B22] uppercase tracking-wider">
                    {work.tag}
                  </span>
                </div>

                {/* Overlay link button */}
                <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-12 h-12 bg-white text-stone-900 rounded-full flex items-center justify-center shadow-xl">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Work Details */}
              <div className="space-y-3 px-2 flex-grow flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase text-stone-400 tracking-widest">
                    {work.category}
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white mt-1 group-hover:text-[#FF5B22] transition-colors">
                    {work.title}
                  </h3>
                  <p className="text-stone-400 text-sm leading-relaxed mt-2 font-light">
                    {work.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-2 text-sm text-[#FF5B22] font-semibold uppercase tracking-wider cursor-pointer group-hover:underline">
                  <span>Explore Showcase</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
