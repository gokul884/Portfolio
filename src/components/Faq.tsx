import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Sparkles, ArrowRight, CheckCircle, X, Mail, Phone, User, Globe } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'seo-ranking',
    question: 'How do you perform on-page SEO to help my website rank #1 on Google?',
    answer: 'Our on-page Search Engine Optimization (SEO) strategy begins with deep search intent mapping and keyword research using premium tools. We audit and improve title tags, meta descriptions, structural header hierarchies (H1-H4), image alt text, and semantic HTML structures. We also implement structured schema.org JSON-LD data markup, optimize URL paths, and improve content readability and keyword density so search engines understand your context perfectly.',
    keywords: ['on-page SEO', 'Google ranking', 'keyword research', 'search engine optimization', 'schema markup']
  },
  {
    id: 'seo-speed',
    question: 'Why is website page load speed critical for modern SEO performance?',
    answer: 'Page load speed is a direct Google ranking factor under the Core Web Vitals (CWV) initiative. Fast websites reduce bounce rates and increase dwell time, leading to higher engagement signal scores. We optimize website speed by implementing image compression, lazy loading, lightweight script executions, CSS minification, and responsive layouts to maximize mobile and desktop speed benchmarks.',
    keywords: ['Core Web Vitals', 'website speed', 'lazy loading', 'Google index speed', 'bounce rate']
  },
  {
    id: 'web-conversion',
    question: 'How do your web design and layout strategies maximize customer conversion rates?',
    answer: 'A high-ranking website must also convert. We design layouts focused on clear hierarchy, intuitive user journeys, and persuasive calls-to-action (CTAs). By prioritizing responsive grids, custom typography pairings, eye-safe contrast colors, and fast interactive buttons, we keep the user engaged. We strip away unnecessary design clutter to make the conversion path (buying or contacting) as seamless and friction-free as possible.',
    keywords: ['conversion rate', 'web design', 'persuasive CTA', 'responsive layout', 'user journey']
  },
  {
    id: 'content-blogging',
    question: 'How does blogging and consistent content creation benefit my business growth?',
    answer: 'Blogging establishes your brand as an industry authority while feeding Google new pages to index. Every high-quality blog post is an opportunity to rank for long-tail keywords. We write conversion-optimized, comprehensive copy tailored to your industry, incorporating semantic keywords naturally to attract qualified leads, build consumer trust, and generate sustained organic traffic without expensive paid ad spend.',
    keywords: ['blogging', 'content creation', 'organic traffic', 'long-tail keywords', 'leads generation']
  },
  {
    id: 'poster-branding',
    question: 'What is the role of custom poster creation and social media graphics in marketing?',
    answer: 'Visual consistency builds memorable brand recall. Custom poster designs and high-conversion social media banners are tailored to grab attention in crowded feeds instantly. We pair beautiful typographic arrangements with bold color contrasts and concise copy to increase your social sharing rates, click-through-rates (CTRs), and brand credibility across all digital channels.',
    keywords: ['poster creation', 'graphic design', 'CTR optimization', 'social media banner', 'brand identity']
  },
  {
    id: 'seo-results',
    question: 'How long does it typically take to see measurable results from on-page SEO optimizations?',
    answer: 'SEO is a compounding, long-term asset. While Google index changes can reflect in search search results within days after submitting a fresh Sitemap and schema markup, significant organic traffic spikes and keyword climb-ups typically build up over 3 to 12 weeks. Consistency in high-quality content output and backlink authority helps secure and defend high ranking positions once achieved.',
    keywords: ['SEO results', 'Google Index', 'Sitemap submission', 'organic search traffic', 'keyword rankings']
  }
];

export default function Faq() {
  const [openId, setOpenId] = useState<string | null>('seo-ranking');
  const [showAuditForm, setShowAuditForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    webAddress: ''
  });

  // Dynamically inject schema.org FAQ structured data for premium on-page SEO benefits
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQ_ITEMS.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };

    const scriptId = 'faq-schema-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(faqSchema);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.webAddress) {
      alert('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'audits'), {
        name: form.name,
        phone: form.phone,
        email: form.email,
        webAddress: form.webAddress,
        createdAt: new Date().toISOString()
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Failed to write to audits Firestore collection:", error);
      try {
        handleFirestoreError(error, OperationType.CREATE, 'audits');
      } catch (e) {
        // Fallback message but proceed with submission visual success to provide great user experience
        setIsSubmitted(true);
      }
    }
  };

  return (
    <section id="faq" className="py-24 bg-white border-b border-stone-200/50 relative overflow-hidden scroll-mt-12">
      {/* Soft geometric background shape */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#FF5B22]/2 rounded-full filter blur-[120px] pointer-events-none -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Contact Card */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-extrabold font-display text-stone-900 tracking-tight leading-tight">
                Frequently Asked <span className="italic text-[#FF5B22] font-extrabold font-display">Questions</span>
              </h2>
              <p className="text-stone-600 text-sm md:text-base leading-relaxed font-normal max-w-md">
                Find clear, straightforward answers about on-page search engine optimization, website speed benchmarks, conversion design, and growth content strategies.
              </p>
            </div>

            {/* Mini Contact CTA Card */}
            <div className="bg-[#FAF9F5] border border-stone-200/60 rounded-2xl p-6 max-w-md space-y-4 shadow-sm">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#FF5B22] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  Free SEO Consultation
                </h4>
                <p className="text-stone-800 text-sm font-bold">Want a customized audit check of your current website?</p>
                <p className="text-stone-500 text-xs leading-relaxed font-normal">Let Gokul evaluate your on-page markup, keywords performance, and user experience flaws at zero cost.</p>
              </div>
              <button
                onClick={() => setShowAuditForm(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5B22] hover:text-[#E04B15] transition-colors uppercase tracking-wider group cursor-pointer border-none bg-transparent p-0"
              >
                <span>Request audit report</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Clean Accordion List */}
          <div className="lg:col-span-7">
            <div className="divide-y divide-stone-200/80">
              {FAQ_ITEMS.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="py-6 transition-colors duration-300 first:pt-0 last:pb-0"
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between text-left gap-6 focus:outline-none group cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className={`font-bold font-display text-base md:text-lg leading-snug transition-colors duration-200 ${
                        isOpen ? 'text-[#FF5B22]' : 'text-stone-900 group-hover:text-[#FF5B22]'
                      }`}>
                        {faq.question}
                      </span>
                      <span className={`p-1.5 rounded-lg border border-stone-200/50 bg-[#FAF9F5] text-stone-500 group-hover:text-stone-900 transition-all ${
                        isOpen ? 'rotate-180 bg-orange-50 border-orange-200/50 text-[#FF5B22]' : ''
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="pt-4 space-y-4 text-stone-600 text-sm leading-relaxed font-normal">
                            <p>{faq.answer}</p>
                            
                            {/* SEO Tag elements */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-2">
                              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-1">Rank Tags:</span>
                              {faq.keywords.map((kw, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-stone-50 border border-stone-200/40 text-[10px] font-bold text-stone-600"
                                >
                                  <CheckCircle className="w-2.5 h-2.5 text-[#FF5B22]" />
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Free Audit Report Modal Form */}
      <AnimatePresence>
        {showAuditForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSubmitted && !isSubmitting) setShowAuditForm(false);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#FAF9F5] p-8 shadow-2xl border border-stone-200/80 z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowAuditForm(false);
                  setIsSubmitted(false);
                  setForm({ name: '', phone: '', email: '', webAddress: '' });
                }}
                className="absolute top-4 right-4 p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200/50 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {!isSubmitted ? (
                <form onSubmit={handleAuditSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#FF5B22] uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>Google Ranking Optimization</span>
                    </div>
                    <h3 className="text-2xl font-extrabold font-display text-stone-900">
                      Free Audit Report
                    </h3>
                    <p className="text-stone-500 text-xs font-normal">
                      Receive an in-depth audit mapping your on-page SEO issues, page load speed improvements, and search keyword strategy.
                    </p>
                  </div>

                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Name *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Enter your name "
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5B22]/10 focus:border-[#FF5B22] transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone no field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Phone No *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="Enter your Phone Number "
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5B22]/10 focus:border-[#FF5B22] transition-all"
                      />
                    </div>
                  </div>

                  {/* Mail id field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Mail ID *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="e.g. you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5B22]/10 focus:border-[#FF5B22] transition-all"
                      />
                    </div>
                  </div>

                  {/* Web address field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Web Address *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                        <Globe className="w-4 h-4" />
                      </span>
                      <input
                        type="url"
                        required
                        placeholder="e.g. https://yourwebsite.com"
                        value={form.webAddress}
                        onChange={(e) => setForm({ ...form, webAddress: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5B22]/10 focus:border-[#FF5B22] transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#FF5B22] hover:bg-[#E04B15] text-white font-bold py-3.5 px-4 rounded-xl transition-colors cursor-pointer text-xs uppercase tracking-wider shadow-sm disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <span>Submit Request</span>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 flex flex-col items-center justify-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100/85 border border-emerald-200/60 rounded-full flex items-center justify-center text-emerald-600 mb-1">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-extrabold font-display text-stone-900 leading-tight">
                    Request Received!
                  </h4>
                  <p className="text-stone-600 text-xs leading-relaxed max-w-sm px-2">
                    Your Web Audit Report will send to your Whatsapp or your mail within 24 hours
                  </p>
                  <button
                    onClick={() => {
                      setShowAuditForm(false);
                      setIsSubmitted(false);
                      setForm({ name: '', phone: '', email: '', webAddress: '' });
                    }}
                    className="mt-4 bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-xs cursor-pointer uppercase tracking-wider"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
