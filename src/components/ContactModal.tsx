import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, Sparkles, Mail, User, MessageSquare } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Website Design',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);

    const submitToFirestore = async () => {
      try {
        await addDoc(collection(db, 'contacts'), {
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType,
          message: formData.message,
          createdAt: new Date().toISOString()
        });
        setIsSubmitting(false);
        setIsSubmitted(true);
      } catch (error) {
        setIsSubmitting(false);
        console.error("Failed to write to contacts Firestore collection: ", error);
        try {
          handleFirestoreError(error, OperationType.CREATE, 'contacts');
        } catch (e) {
          // Display a user-friendly alert
          alert("We couldn't submit your inquiry to Firestore. Please verify your Firebase Firestore rules or connection.");
        }
      }
    };

    submitToFirestore();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      projectType: 'Website Design',
      message: '',
    });
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="contact-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#FAF9F5] p-8 shadow-2xl border border-amber-900/10"
          >
            {/* Close Button */}
            <button
              id="close-modal-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#FF5B22] uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Let's collaborate</span>
                  </div>
                  <h3 className="text-2xl font-bold font-display text-stone-900">
                    Have a Dream Project?
                  </h3>
                  <p className="text-stone-600 text-sm mt-1">
                    Fill out the form below and let's bring your creative ideas to life.
                  </p>
                </div>

                {/* Input Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-stone-700">Your Name *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Gokul Krisnan"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5B22]/30 focus:border-[#FF5B22] transition-all"
                    />
                  </div>
                </div>

                {/* Input Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-stone-700">Email Address *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5B22]/30 focus:border-[#FF5B22] transition-all"
                    />
                  </div>
                </div>

                {/* Select Service */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-stone-700">Project Type</label>
                  <select
                    id="contact-project-type"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5B22]/30 focus:border-[#FF5B22] transition-all"
                  >
                    <option value="Website Design">Website Design</option>
                    <option value="Responsive Design">Responsive Design</option>
                    <option value="Mobile App Design">Mobile App Design</option>
                    <option value="Design System">Design System</option>
                  </select>
                </div>

                {/* Textarea Message */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-stone-700">Project Details *</label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-stone-400">
                      <MessageSquare className="w-4 h-4" />
                    </span>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me a bit about your goals, budget, or timeline..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5B22]/30 focus:border-[#FF5B22] transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  id="submit-contact-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF5B22] hover:bg-[#E04B15] text-white font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer text-sm shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Proposal</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold font-display text-stone-900">
                  Message Sent Successfully!
                </h4>
                <p className="text-stone-600 text-sm max-w-sm">
                  Thank you, <span className="font-semibold">{formData.name}</span>! Your request for{' '}
                  <span className="font-semibold">{formData.projectType}</span> has been received. I'll get back to you at{' '}
                  <span className="font-semibold">{formData.email}</span> within 24 hours.
                </p>
                <button
                  id="success-close-btn"
                  onClick={resetForm}
                  className="mt-6 bg-stone-900 hover:bg-stone-800 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm cursor-pointer"
                >
                  Close Window
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
