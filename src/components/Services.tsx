import { SERVICES_DATA } from '../data';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { ServiceItem } from '../types';
import { Monitor, Smartphone, Layers, Layout, ArrowRight } from 'lucide-react';

export default function Services() {
  const { data: services } = useFirestoreCollection<ServiceItem>('services', SERVICES_DATA);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'monitor':
        return <Monitor className="w-8 h-8 text-[#FF5B22]" />;
      case 'smartphone':
        return <Smartphone className="w-8 h-8 text-[#FF5B22]" />;
      case 'layers':
        return <Layers className="w-8 h-8 text-[#FF5B22]" />;
      case 'layout':
        return <Layout className="w-8 h-8 text-[#FF5B22]" />;
      default:
        return <Monitor className="w-8 h-8 text-[#FF5B22]" />;
    }
  };

  return (
    <section id="service" className="py-20 bg-[#FAF9F5] grid-lines">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-stone-900 tracking-tight leading-tight">
            High-Performance <span className="italic text-[#FF5B22] font-extrabold pl-1">SEO & Digital Services</span>
          </h2>
          
          <p className="text-stone-600 text-sm md:text-base leading-relaxed font-normal">
            Delivering data-driven <strong>SEO campaigns</strong>, beautiful <strong>website development</strong>, custom high-converting <strong>graphics & poster creation</strong>, and target-focused <strong>blog writing</strong>. Each service is custom tailored to maximize click-through rates, drive user retention, and skyrocket organic search engine rankings.
          </p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-stone-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`p-10 md:p-12 flex flex-col items-center text-center gap-6 hover:bg-stone-50/50 transition-colors relative group ${
                index % 2 === 0 ? 'md:border-r border-stone-200/80' : ''
              } ${index < 2 ? 'border-b border-stone-200/80' : ''}`}
            >
              {/* Icon Container - Solid orange circle with white glyph */}
              <div className="w-16 h-16 rounded-full bg-[#FF5B22] flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 shadow-md shadow-orange-500/10">
                {service.iconName === 'monitor' && <Monitor className="w-7 h-7 text-white" />}
                {service.iconName === 'smartphone' && <Smartphone className="w-7 h-7 text-white" />}
                {service.iconName === 'layers' && <Layers className="w-7 h-7 text-white" />}
                {service.iconName === 'layout' && <Layout className="w-7 h-7 text-white" />}
              </div>

              {/* Service Info */}
              <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-bold font-display text-stone-950">
                  {service.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed font-normal max-w-md">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
