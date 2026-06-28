import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Works from './components/Works';
import Experiences from './components/Experiences';
import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import AdminPanel from './components/AdminPanel';
import { ArrowUp, Sparkles, MessageSquare, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirestoreCollection } from './hooks/useFirestoreCollection';
import { SERVICES_DATA, WORKS_DATA, TESTIMONIALS_DATA, BLOGS_DATA } from './data';
import { ServiceItem, WorkItem, TestimonialItem, BlogPostItem } from './types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [heroPhotoUrl, setHeroPhotoUrl] = useState("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&h=900&q=80");

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

  // Subscribe to Dynamic Hero Portrait Photo URL
  useEffect(() => {
    const docRef = doc(db, 'settings', 'hero');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().photoUrl) {
        setHeroPhotoUrl(docSnap.data().photoUrl);
      }
    }, (err) => {
      console.warn("Could not load dynamic hero image, using fallback.", err);
    });
    return () => unsubscribe();
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
        <Services />

        {/* Dark Theme Works Gallery */}
        <Works />

        {/* Skills Track & Experience Panel */}
        <Experiences />

        {/* Customer Feedbacks */}
        <Testimonials />

        {/* Latest Stories & Insights (Blog) */}
        <Blog />
      </main>

      {/* Footer Area */}
      <Footer onOpenContact={() => setIsContactOpen(true)} />

      {/* Contact Form Popup Modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* Admin Panel Modal Overlay */}
      <AnimatePresence>
        {isAdminOpen && (
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
        )}
      </AnimatePresence>

      {/* Admin Panel Trigger Floating Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <motion.button
          id="admin-panel-trigger"
          onClick={() => setIsAdminOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3.5 bg-stone-900 hover:bg-[#FF5B22] text-white rounded-full shadow-xl transition-all cursor-pointer flex items-center justify-center group relative border border-stone-800"
          title="Admin Control Center"
        >
          <Settings className="w-5 h-5" />
          <span className="absolute left-full ml-3 px-3 py-1 bg-stone-900 text-white text-xs font-semibold rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
            Admin Database Panel
          </span>
        </motion.button>
      </div>

      {/* Quick Action Floating Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Back To Top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              id="back-to-top-btn"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              onClick={scrollToTop}
              className="p-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-[#FF5B22] rounded-full shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 active:scale-95"
              title="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Quick Message Floating Button */}
        <motion.button
          id="quick-chat-bubble"
          onClick={() => setIsContactOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-[#FF5B22] hover:bg-[#E04B15] text-white rounded-full shadow-xl transition-all cursor-pointer flex items-center justify-center relative group"
          title="Direct Inquiry"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute right-full mr-3 px-3 py-1 bg-stone-900 text-white text-xs font-semibold rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
            Hire Me Now
          </span>
          {/* Notification bubble */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#FAF9F5]" />
        </motion.button>
      </div>
    </div>
  );
}
