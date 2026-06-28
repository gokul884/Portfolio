import { SKILLS_DATA } from '../data';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { SkillItem } from '../types';
import { Monitor, Smartphone, Layout, Star, Award, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

export default function Experiences() {
  const { data: skills } = useFirestoreCollection<SkillItem>('skills', SKILLS_DATA);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'monitor':
        return <Monitor className="w-6 h-6 text-[#FF5B22]" />;
      case 'smartphone':
        return <Smartphone className="w-6 h-6 text-[#FF5B22]" />;
      case 'layout':
        return <Layout className="w-6 h-6 text-[#FF5B22]" />;
      default:
        return <Monitor className="w-6 h-6 text-[#FF5B22]" />;
    }
  };

  return (
    <section id="experiences" className="py-20 bg-[#FAF9F5] border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/60 border border-orange-200/50 text-[#FF5B22] text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B22]" />
            <span>Experiences</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-stone-900 tracking-tight leading-tight">
            My Skills that Shine <br />
            <span className="italic text-[#FF5B22] font-extrabold pl-1">Expertise You Can Trust</span>
          </h2>
          
          <p className="text-stone-600 text-sm md:text-base leading-relaxed font-normal">
            I've developed strong skills in a range of tools, allowing me to create effective, innovative, and user-focused digital solutions.
          </p>
        </div>

        {/* 3-Column Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-stone-200/80 rounded-2xl p-8 hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div className="space-y-6">
                
                {/* Icon Container - Left Aligned Solid Orange Circle with White Glyph */}
                <div className="w-14 h-14 rounded-full bg-[#FF5B22] flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-md shadow-orange-500/10">
                  {skill.iconName === 'monitor' && <Monitor className="w-6 h-6 text-white" />}
                  {skill.iconName === 'smartphone' && <Smartphone className="w-6 h-6 text-white" />}
                  {skill.iconName === 'layout' && <Layout className="w-6 h-6 text-white" />}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-display text-stone-950">
                    {skill.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed font-normal">
                    {skill.description}
                  </p>
                </div>

              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
