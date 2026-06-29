import { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';

// Code splitting: Lazy load below-the-fold components
const Services = lazy(() => import('./components/Services'));
const Works = lazy(() => import('./components/Works'));
const Experiences = lazy(() => import('./components/Experiences'));
const Blog = lazy(() => import('./components/Blog'));
const Faq = lazy(() => import('./components/Faq'));
const Footer = lazy(() => import('./components/Footer'));
const ContactModal = lazy(() => import('./components/ContactModal'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

import { ArrowUp, Sparkles, MessageSquare } from 'lucide-react';
import { useFirestoreCollection } from './hooks/useFirestoreCollection';
import { SERVICES_DATA, WORKS_DATA, TESTIMONIALS_DATA, BLOGS_DATA } from './data';
import { ServiceItem, WorkItem, TestimonialItem, BlogPostItem } from './types';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [heroPhotoUrl, setHeroPhotoUrl] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('heroPhotoUrl');
      if (stored && !stored.includes('photo-1506794778202-cad84cf45f1d')) {
        return stored;
      }
    } catch (e) {
      console.warn("localStorage is not available", e);
    }
    return "";
  });

  // Fetch Firestore Collections for AdminPanel Sync
  const { data: services } = useFirestoreCollection<ServiceItem>('services', SERVICES_DATA);
  const { data: works } = useFirestoreCollection<WorkItem>('works', WORKS_DATA);
  const { data: testimonials } = useFirestoreCollection<TestimonialItem>('testimonials', TESTIMONIALS_DATA);
  const { data: blogs } = useFirestoreCollection<BlogPostItem>('blogs', BLOGS_DATA);

  // Handle URL routing for /admin, #admin, and #/admin
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const isRouteAdmin = path === '/admin' || hash === '#admin' || hash === '#/admin';
      setIsAdminRoute(isRouteAdmin);
      if (isRouteAdmin) {
        setIsAdminOpen(true);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (isAdminRoute) {
      window.history.pushState({}, '', '/');
      setIsAdminRoute(false);
    }
  };

  // Subscribe to Dynamic Hero Portrait Photo URL after a short delay to keep startup path lightweight
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const timer = setTimeout(async () => {
      try {
        const { doc, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('./firebase');
        
        const docRef = doc(db, 'settings', 'hero');
        unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists() && docSnap.data().photoUrl) {
            const url = docSnap.data().photoUrl;
            setHeroPhotoUrl(url);
            try {
              localStorage.setItem('heroPhotoUrl', url);
            } catch (e) {
              console.warn("Could not save heroPhotoUrl to localStorage", e);
            }
          }
        }, (err) => {
          console.warn("Could not load dynamic hero image, using fallback.", err);
        });
      } catch (err) {
        console.warn("Failed to dynamically load firebase in App.tsx:", err);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Monitor scroll height to show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-stone-900 font-sans selection:bg-[#FF5B22]/10 selection:text-[#FF5B22] antialiased">
        <Suspense fallback={<div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-[#FF5B22] animate-spin"></div></div>}>
          <AdminPanel 
            isOpen={true} 
            onClose={handleCloseAdmin} 
            currentHeroPhoto={heroPhotoUrl}
            onUpdateHeroPhoto={(url) => setHeroPhotoUrl(url)}
            services={services}
            works={works}
            testimonials={testimonials}
            blogs={blogs}
            isFullPage={true}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 font-sans selection:bg-[#FF5B22]/10 selection:text-[#FF5B22] scroll-smooth antialiased">
      {/* Dynamic Floating Navbar */}
      <Header onOpenContact={() => setIsContactOpen(true)} />

      {/* Main Sections */}
      <main className="grid-lines">
        {/* Hero Area */}
        <Hero onOpenContact={() => setIsContactOpen(true)} heroPhotoUrl={heroPhotoUrl} />

        {/* Services Bento Grid */}
        <Suspense fallback={<div className="min-h-[400px] bg-[#FAF9F5]" />}>
          <Services />
        </Suspense>

        {/* Dark Theme Works Gallery */}
        <Suspense fallback={<div className="min-h-[500px] bg-stone-900" />}>
          <Works />
        </Suspense>

        {/* Skills Track & Experience Panel */}
        <Suspense fallback={<div className="min-h-[400px] bg-[#FAF9F5]" />}>
          <Experiences />
        </Suspense>

        {/* Latest Stories & Insights (Blog) */}
        <Suspense fallback={<div className="min-h-[500px] bg-[#FAF9F5]" />}>
          <Blog />
        </Suspense>

        {/* Search Engine Optimized FAQ Section */}
        <Suspense fallback={<div className="min-h-[400px] bg-[#FAF9F5]" />}>
          <Faq />
        </Suspense>
      </main>

      {/* Footer Area */}
      <Suspense fallback={<div className="min-h-[100px] bg-[#FAF9F5]" />}>
        <Footer onOpenContact={() => setIsContactOpen(true)} />
      </Suspense>

      {/* Contact Form Popup Modal */}
      <Suspense fallback={null}>
        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      </Suspense>

      {/* Admin Panel Modal Overlay */}
      {isAdminOpen && (
        <Suspense fallback={null}>
          <AdminPanel 
            isOpen={isAdminOpen} 
            onClose={() => setIsAdminOpen(false)} 
            currentHeroPhoto={heroPhotoUrl}
            onUpdateHeroPhoto={(url) => setHeroPhotoUrl(url)}
            services={services}
            works={works}
            testimonials={testimonials}
            blogs={blogs}
          />
        </Suspense>
      )}

      {/* Quick Action Floating Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Back To Top */}
        {showScrollTop && (
          <button
            id="back-to-top-btn"
            onClick={scrollToTop}
            className="p-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-[#FF5B22] rounded-full shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:scale-95 animate-in fade-in zoom-in-75 duration-200"
            title="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Quick Message Floating Button */}
        <button
          id="quick-chat-bubble"
          onClick={() => setIsContactOpen(true)}
          className="p-4 bg-[#FF5B22] hover:bg-[#E04B15] hover:scale-105 active:scale-95 text-white rounded-full shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center relative group"
          title="Direct Inquiry"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute right-full mr-3 px-3 py-1 bg-stone-900 text-white text-xs font-semibold rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
            Hire Me Now
          </span>
          {/* Notification bubble */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#FAF9F5]" />
        </button>
      </div>
    </div>
  );
}
