import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Lock, Key, Image, Plus, Trash2, Edit, Check, Star, 
  RefreshCw, Layers, Monitor, Smartphone, Layout, LogOut, Sparkles, MessageSquare, BookOpen, AlertCircle, Briefcase, Upload
} from 'lucide-react';
import { 
  collection, doc, setDoc, addDoc, updateDoc, deleteDoc, getDocs 
} from 'firebase/firestore';
import { db } from '../firebase';
import ImageCropperModal from './ImageCropperModal';
import { 
  SERVICES_DATA, WORKS_DATA, TESTIMONIALS_DATA, BLOGS_DATA, SKILLS_DATA 
} from '../data';
import { ServiceItem, WorkItem, TestimonialItem, BlogPostItem } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentHeroPhoto: string;
  onUpdateHeroPhoto: (url: string) => void;
  services: ServiceItem[];
  works: WorkItem[];
  testimonials: TestimonialItem[];
  blogs: BlogPostItem[];
  isFullPage?: boolean;
}

type AdminTab = 'hero' | 'services' | 'works' | 'testimonials' | 'blogs';

export default function AdminPanel({
  isOpen,
  onClose,
  currentHeroPhoto,
  onUpdateHeroPhoto,
  services,
  works,
  testimonials,
  blogs,
  isFullPage = false,
}: AdminPanelProps) {
  // Passcode verification state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // General States
  const [activeTab, setActiveTab] = useState<AdminTab>('hero');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingSuccess, setSeedingSuccess] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);

  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null); // holds item being edited, or null for adding

  // Image Cropper States
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState('');
  const [cropperAspect, setCropperAspect] = useState(1);
  const [cropperLabel, setCropperLabel] = useState('1:1 Square');
  const [cropperCallback, setCropperCallback] = useState<((croppedUrl: string) => void) | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerDeviceUpload = (aspect: number, label: string, onCropped: (url: string) => void) => {
    setCropperAspect(aspect);
    setCropperLabel(label);
    setCropperCallback(() => onCropped);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeviceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropperImage(reader.result as string);
      setIsCropperOpen(true);
      e.target.value = ''; // Reset
    };
    reader.readAsDataURL(file);
  };

  // Hero Section State
  const [heroPhotoInput, setHeroPhotoInput] = useState(currentHeroPhoto);
  const [isSavingHero, setIsSavingHero] = useState(false);

  // Collection Item Form States
  // 1. Service fields
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceIcon, setServiceIcon] = useState<'monitor' | 'smartphone' | 'layers' | 'layout'>('monitor');

  // 2. Work fields
  const [workTitle, setWorkTitle] = useState('');
  const [workCategory, setWorkCategory] = useState('');
  const [workDesc, setWorkDesc] = useState('');
  const [workImage, setWorkImage] = useState('');
  const [workTag, setWorkTag] = useState('');
  const [workLink, setWorkLink] = useState('');

  // 3. Testimonial fields
  const [testName, setTestName] = useState('');
  const [testRole, setTestRole] = useState('');
  const [testCompany, setTestCompany] = useState('');
  const [testAvatar, setTestAvatar] = useState('');
  const [testRating, setTestRating] = useState(5);
  const [testText, setTestText] = useState('');
  const [testTime, setTestTime] = useState('Just now');
  const [testPlatform, setTestPlatform] = useState<'twitter' | 'linkedin' | 'dribbble' | 'facebook' | 'instagram'>('linkedin');

  // 4. Blog fields
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('5 min read');
  const [blogDate, setBlogDate] = useState('');
  const [blogImage, setBlogImage] = useState('');
  const [blogAuthorName, setBlogAuthorName] = useState('Gokul Krisnan');
  const [blogAuthorRole, setBlogAuthorRole] = useState('Digital Marketer');
  const [blogAuthorAvatar, setBlogAuthorAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80');

  // Check Local Storage on load for previous login
  useEffect(() => {
    try {
      const isSaved = localStorage.getItem('antor_admin_logged');
      if (isSaved === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn("localStorage is not available", e);
    }
  }, []);

  // Update hero photo input when prop updates
  useEffect(() => {
    setHeroPhotoInput(currentHeroPhoto);
  }, [currentHeroPhoto]);

  // Handle Passcode verification
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123') {
      setIsAuthenticated(true);
      setPasscodeError(false);
      if (rememberMe) {
        try {
          localStorage.setItem('antor_admin_logged', 'true');
        } catch (e) {
          console.warn("Could not save admin session to localStorage", e);
        }
      }
    } else {
      setPasscodeError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    try {
      localStorage.removeItem('antor_admin_logged');
    } catch (e) {
      console.warn("Could not remove admin session from localStorage", e);
    }
  };

  // Open form for Add
  const handleOpenAddForm = () => {
    setEditingItem(null);
    setOperationError(null);
    
    // Reset service fields
    setServiceTitle('');
    setServiceDesc('');
    setServiceIcon('monitor');

    // Reset work fields
    setWorkTitle('');
    setWorkCategory('');
    setWorkDesc('');
    setWorkImage('');
    setWorkTag('');
    setWorkLink('');

    // Reset testimonial fields
    setTestName('');
    setTestRole('');
    setTestCompany('');
    setTestAvatar('');
    setTestRating(5);
    setTestText('');
    setTestTime('Just now');
    setTestPlatform('linkedin');

    // Reset blog fields
    setBlogTitle('');
    setBlogSummary('');
    setBlogContent('');
    setBlogCategory('');
    setBlogReadTime('5 min read');
    setBlogDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    setBlogImage('');
    setBlogAuthorName('Gokul Krisnan');
    setBlogAuthorRole('Digital Marketer');
    setBlogAuthorAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80');

    setIsFormOpen(true);
  };

  // Open form for Edit
  const handleOpenEditForm = (item: any) => {
    setEditingItem(item);
    setOperationError(null);

    if (activeTab === 'services') {
      setServiceTitle(item.title || '');
      setServiceDesc(item.description || '');
      setServiceIcon(item.iconName || 'monitor');
    } else if (activeTab === 'works') {
      setWorkTitle(item.title || '');
      setWorkCategory(item.category || '');
      setWorkDesc(item.description || '');
      setWorkImage(item.imageUrl || '');
      setWorkTag(item.tag || '');
      setWorkLink(item.link || '');
    } else if (activeTab === 'testimonials') {
      setTestName(item.name || '');
      setTestRole(item.role || '');
      setTestCompany(item.company || '');
      setTestAvatar(item.avatarUrl || '');
      setTestRating(item.rating || 5);
      setTestText(item.text || '');
      setTestTime(item.timeAgo || 'Just now');
      setTestPlatform(item.platform || 'linkedin');
    } else if (activeTab === 'blogs') {
      setBlogTitle(item.title || '');
      setBlogSummary(item.summary || '');
      setBlogContent(item.content || '');
      setBlogCategory(item.category || '');
      setBlogReadTime(item.readTime || '5 min read');
      setBlogDate(item.date || '');
      setBlogImage(item.imageUrl || '');
      setBlogAuthorName(item.author?.name || 'Gokul Krisnan');
      setBlogAuthorRole(item.author?.role || 'Digital Marketer');
      setBlogAuthorAvatar(item.author?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80');
    }

    setIsFormOpen(true);
  };

  // Save Hero Photo URL
  const handleSaveHeroPhoto = async () => {
    setIsSavingHero(true);
    setOperationError(null);
    try {
      await setDoc(doc(db, 'settings', 'hero'), {
        photoUrl: heroPhotoInput
      }, { merge: true });
      onUpdateHeroPhoto(heroPhotoInput);
      setSeedingSuccess("Hero photo updated successfully!");
      setTimeout(() => setSeedingSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setOperationError("Failed to update Hero photo in Firestore. Please check your rules.");
    } finally {
      setIsSavingHero(false);
    }
  };

  // Delete Item
  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item? This action is irreversible.")) {
      return;
    }
    setOperationError(null);
    try {
      await deleteDoc(doc(db, activeTab, id));
      setSeedingSuccess("Item deleted successfully!");
      setTimeout(() => setSeedingSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setOperationError(`Failed to delete item from '${activeTab}' collection.`);
    }
  };

  // Submit Add or Edit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setOperationError(null);
    try {
      if (activeTab === 'services') {
        const payload: Omit<ServiceItem, 'id'> = {
          title: serviceTitle,
          description: serviceDesc,
          iconName: serviceIcon
        };
        if (editingItem) {
          await updateDoc(doc(db, 'services', editingItem.id), payload);
        } else {
          await addDoc(collection(db, 'services'), payload);
        }
      } else if (activeTab === 'works') {
        const payload: Omit<WorkItem, 'id'> = {
          title: workTitle,
          category: workCategory,
          description: workDesc,
          imageUrl: workImage || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
          tag: workTag || 'Portfolio',
          link: workLink || '#'
        };
        if (editingItem) {
          await updateDoc(doc(db, 'works', editingItem.id), payload);
        } else {
          await addDoc(collection(db, 'works'), payload);
        }
      } else if (activeTab === 'testimonials') {
        const payload: Omit<TestimonialItem, 'id'> = {
          name: testName,
          role: testRole,
          company: testCompany,
          avatarUrl: testAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
          rating: Number(testRating),
          text: testText,
          timeAgo: testTime,
          platform: testPlatform
        };
        if (editingItem) {
          await updateDoc(doc(db, 'testimonials', editingItem.id), payload);
        } else {
          await addDoc(collection(db, 'testimonials'), payload);
        }
      } else if (activeTab === 'blogs') {
        const payload: Omit<BlogPostItem, 'id'> = {
          title: blogTitle,
          summary: blogSummary,
          content: blogContent,
          category: blogCategory || 'Design',
          readTime: blogReadTime || '5 min read',
          date: blogDate || new Date().toLocaleDateString(),
          imageUrl: blogImage || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
          author: {
            name: blogAuthorName,
            role: blogAuthorRole,
            avatarUrl: blogAuthorAvatar
          }
        };
        if (editingItem) {
          await updateDoc(doc(db, 'blogs', editingItem.id), payload);
        } else {
          await addDoc(collection(db, 'blogs'), payload);
        }
      }

      setIsFormOpen(false);
      setEditingItem(null);
      setSeedingSuccess(editingItem ? "Item updated successfully!" : "Item added successfully!");
      setTimeout(() => setSeedingSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setOperationError("Failed to write to Firestore database. Please verify your Firestore credentials or rules.");
    }
  };

  // Seed default data function
  const handleSeedCollection = async () => {
    setIsSeeding(true);
    setOperationError(null);
    try {
      if (activeTab === 'services') {
        for (const item of SERVICES_DATA) {
          await addDoc(collection(db, 'services'), {
            title: item.title,
            description: item.description,
            iconName: item.iconName
          });
        }
      } else if (activeTab === 'works') {
        for (const item of WORKS_DATA) {
          await addDoc(collection(db, 'works'), {
            title: item.title,
            category: item.category,
            description: item.description,
            imageUrl: item.imageUrl,
            tag: item.tag,
            link: item.link
          });
        }
      } else if (activeTab === 'testimonials') {
        for (const item of TESTIMONIALS_DATA) {
          await addDoc(collection(db, 'testimonials'), {
            name: item.name,
            role: item.role,
            company: item.company,
            avatarUrl: item.avatarUrl,
            rating: item.rating,
            text: item.text,
            timeAgo: item.timeAgo,
            platform: item.platform
          });
        }
      } else if (activeTab === 'blogs') {
        for (const item of BLOGS_DATA) {
          await addDoc(collection(db, 'blogs'), {
            title: item.title,
            summary: item.summary,
            content: item.content,
            category: item.category,
            readTime: item.readTime,
            date: item.date,
            imageUrl: item.imageUrl,
            author: item.author
          });
        }
      }
      setSeedingSuccess(`Successfully seeded default ${activeTab} data into Firestore!`);
      setTimeout(() => setSeedingSuccess(null), 4000);
    } catch (err) {
      console.error(err);
      setOperationError(`Failed to seed data. Make sure Firestore is connected.`);
    } finally {
      setIsSeeding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={isFullPage 
      ? "fixed inset-0 z-50 bg-[#FAF9F5] overflow-y-auto flex flex-col" 
      : "fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto"
    }>
      <motion.div 
        initial={isFullPage ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
        animate={isFullPage ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={isFullPage ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
        className={isFullPage 
          ? "relative bg-[#FAF9F5] w-full min-h-screen flex flex-col"
          : "relative bg-white border border-stone-200 shadow-2xl rounded-2xl w-full max-w-5xl overflow-hidden max-h-[90vh] flex flex-col"
        }
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between bg-stone-950 text-white px-6 py-4.5">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#FF5B22]">
              <Key className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase font-display">Gokul Krisnan - Admin Panel</h2>
              <p className="text-[10px] text-stone-400">Live Database Dashboard Engine</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 px-3 py-1 bg-stone-900"
            title="Close Panel"
          >
            <span className="text-[10px] uppercase tracking-wider font-semibold mr-1">Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lock screen view */}
        {!isAuthenticated ? (
          <div className={`flex-1 flex flex-col items-center justify-center py-16 px-6 max-w-md mx-auto text-center space-y-6 ${isFullPage ? 'w-full' : ''}`}>
            <div className="p-4 bg-orange-100 rounded-full text-[#FF5B22] animate-bounce">
              <Lock className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-900">Protected Portfolio Settings</h3>
              <p className="text-stone-500 text-sm">Please authenticate with the security credentials to carry out database operations.</p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Default Passcode</label>
                <div className="relative flex items-center">
                  <input
                    type="password"
                    placeholder="Enter admin passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className={`w-full bg-stone-50 border ${passcodeError ? 'border-red-500' : 'border-stone-200'} focus:border-stone-950 focus:bg-white rounded-xl py-3 px-4 text-stone-800 outline-none transition-all text-sm`}
                    required
                  />
                  <div className="absolute right-3.5 text-stone-400 text-xs font-semibold bg-stone-200/60 px-2 py-1 rounded">
                    admin123
                  </div>
                </div>
                {passcodeError && (
                  <p className="text-red-500 text-xs font-semibold flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Incorrect passcode. Hint: Use admin123
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs py-1">
                <label className="flex items-center gap-2 cursor-pointer text-stone-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#FF5B22] rounded w-4 h-4"
                  />
                  Keep me logged in
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-stone-950 hover:bg-[#FF5B22] text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Authorize & Unlock</span>
                <span>→</span>
              </button>
            </form>
          </div>
        ) : (
          <div className={`flex-1 flex flex-col md:flex-row min-h-0 ${isFullPage ? 'bg-[#FAF9F5]' : 'bg-stone-50'}`}>
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-white border-r border-stone-200 flex flex-col py-4 px-3 space-y-1">
              <div className="px-3 mb-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-400 tracking-widest uppercase">Collections</span>
                <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected
                </span>
              </div>

              <button
                onClick={() => { setActiveTab('hero'); setIsFormOpen(false); }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left ${
                  activeTab === 'hero' 
                    ? 'bg-stone-900 text-white shadow-sm' 
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Image className="w-4 h-4" />
                  <span>Hero Photo</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('services'); setIsFormOpen(false); }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left ${
                  activeTab === 'services' 
                    ? 'bg-stone-900 text-white shadow-sm' 
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4" />
                  <span>Services</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'services' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}>{services.length}</span>
              </button>

              <button
                onClick={() => { setActiveTab('works'); setIsFormOpen(false); }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left ${
                  activeTab === 'works' 
                    ? 'bg-stone-900 text-white shadow-sm' 
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Works</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'works' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}>{works.length}</span>
              </button>

              <button
                onClick={() => { setActiveTab('testimonials'); setIsFormOpen(false); }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left ${
                  activeTab === 'testimonials' 
                    ? 'bg-stone-900 text-white shadow-sm' 
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>Testimonials</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'testimonials' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}>{testimonials.length}</span>
              </button>

              <button
                onClick={() => { setActiveTab('blogs'); setIsFormOpen(false); }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left ${
                  activeTab === 'blogs' 
                    ? 'bg-stone-900 text-white shadow-sm' 
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Blogs</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'blogs' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}>{blogs.length}</span>
              </button>

              <div className="flex-1" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2.5 text-stone-500 hover:text-red-500 rounded-xl text-xs font-semibold hover:bg-red-50/50 transition-all text-left mt-auto cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Admin</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col min-h-0">
              
              {/* Alert Status Banner */}
              {seedingSuccess && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4.5 h-4.5 text-emerald-600 bg-emerald-100 rounded-full p-0.5" />
                    <span>{seedingSuccess}</span>
                  </div>
                </div>
              )}

              {operationError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-xl p-3.5 flex items-center gap-2">
                  <AlertCircle className="w-4.5 h-4.5 text-red-600" />
                  <span>{operationError}</span>
                </div>
              )}

              {/* Dynamic Views */}
              {!isFormOpen ? (
                <div className="flex-1 flex flex-col">
                  
                  {/* HERO PHOTO EDIT SECTION */}
                  {activeTab === 'hero' && (
                    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
                      <div className="border-b border-stone-100 pb-4">
                        <h3 className="text-base font-bold text-stone-900">Configure Hero Image Portrait</h3>
                        <p className="text-xs text-stone-500">Provide an image URL to replace the default portrait illustration on the landing page.</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8 space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-stone-500">Portrait Image (URL or Upload)</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Paste high-res Unsplash or web photo link"
                                value={heroPhotoInput}
                                onChange={(e) => setHeroPhotoInput(e.target.value)}
                                className="flex-1 bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => triggerDeviceUpload(3/4, "3:4 Portrait", (url) => setHeroPhotoInput(url))}
                                className="bg-stone-900 hover:bg-[#FF5B22] text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload & Crop</span>
                              </button>
                            </div>
                            <p className="text-[10px] text-stone-400">Recommended Aspect Ratio: 3:4 Portrait. Supports camera capture or device files.</p>
                          </div>

                          <div className="flex items-center gap-3 pt-2">
                            <button
                              onClick={handleSaveHeroPhoto}
                              disabled={isSavingHero}
                              className="bg-[#FF5B22] hover:bg-[#E04B15] text-white font-semibold py-2 px-5 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                            >
                              {isSavingHero ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                              <span>{isSavingHero ? "Saving changes..." : "Save Photo"}</span>
                            </button>
                            <button
                              onClick={() => setHeroPhotoInput('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&h=900&q=80')}
                              className="text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 font-semibold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer"
                            >
                              Reset to Default
                            </button>
                          </div>
                        </div>

                        <div className="lg:col-span-4 flex flex-col items-center">
                          <label className="text-xs font-bold text-stone-500 mb-2 self-start">Active Live Preview</label>
                          <div className="w-full max-w-[180px] aspect-[3/4] rounded-xl overflow-hidden border border-stone-200 shadow-inner bg-stone-50 relative flex items-center justify-center">
                            {heroPhotoInput ? (
                              <img
                                src={heroPhotoInput}
                                alt="Hero portrait preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&h=900&q=80';
                                }}
                              />
                            ) : (
                              <Image className="w-8 h-8 text-stone-300" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CRUD TABLES */}
                  {activeTab !== 'hero' && (
                    <div className="flex-1 flex flex-col min-h-0">
                      
                      {/* Control Panel (Seed or Add Buttons) */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
                        <div>
                          <h3 className="text-base font-bold text-stone-900 capitalize">{activeTab} Manager</h3>
                          <p className="text-xs text-stone-500">Synchronized list fetched from your connected Firestore DB.</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* If the Firestore collection has no data, show seeding */}
                          <button
                            onClick={handleSeedCollection}
                            disabled={isSeeding}
                            className="bg-white border border-stone-200 hover:border-stone-400 text-stone-700 hover:text-stone-900 font-semibold py-2 px-4 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                            title="Import original hardcoded mock data to Firestore"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                            <span>{isSeeding ? "Syncing..." : "Seed Original Data"}</span>
                          </button>

                          <button
                            onClick={handleOpenAddForm}
                            className="bg-stone-950 hover:bg-[#FF5B22] text-white font-semibold py-2 px-4 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add New Entry</span>
                          </button>
                        </div>
                      </div>

                      {/* Collection Table */}
                      <div className="flex-1 bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[300px]">
                        <div className="overflow-x-auto">
                          
                          {/* SERVICES TABLE */}
                          {activeTab === 'services' && (
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-stone-950 text-white font-semibold border-b border-stone-200">
                                  <th className="px-5 py-3">Icon Type</th>
                                  <th className="px-5 py-3">Service Title</th>
                                  <th className="px-5 py-3">Description</th>
                                  <th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-100">
                                {services.length === 0 ? (
                                  <tr>
                                    <td colSpan={4} className="px-5 py-8 text-center text-stone-400 font-medium">
                                      No services stored. Click "Seed Original Data" to initialize.
                                    </td>
                                  </tr>
                                ) : (
                                  services.map((item) => (
                                    <tr key={item.id} className="hover:bg-stone-50/50">
                                      <td className="px-5 py-3.5 font-medium text-stone-700 capitalize">
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-stone-100 font-mono text-[10px]">
                                          {item.iconName}
                                        </span>
                                      </td>
                                      <td className="px-5 py-3.5 font-bold text-stone-900">{item.title}</td>
                                      <td className="px-5 py-3.5 text-stone-600 max-w-[300px] truncate">{item.description}</td>
                                      <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                                        <button 
                                          onClick={() => handleOpenEditForm(item)}
                                          className="p-1.5 text-stone-600 hover:text-[#FF5B22] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteItem(item.id)}
                                          className="p-1.5 text-stone-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          )}

                          {/* WORKS TABLE */}
                          {activeTab === 'works' && (
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-stone-950 text-white font-semibold border-b border-stone-200">
                                  <th className="px-5 py-3">Project Preview</th>
                                  <th className="px-5 py-3">Category / Tag</th>
                                  <th className="px-5 py-3">Title</th>
                                  <th className="px-5 py-3">Description</th>
                                  <th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-100">
                                {works.length === 0 ? (
                                  <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-stone-400 font-medium">
                                      No works in database. Click "Seed Original Data" to initialize.
                                    </td>
                                  </tr>
                                ) : (
                                  works.map((item) => (
                                    <tr key={item.id} className="hover:bg-stone-50/50">
                                      <td className="px-5 py-3">
                                        <div className="w-12 h-9 rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                                          <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                      </td>
                                      <td className="px-5 py-3 font-semibold text-stone-500">
                                        <div className="space-y-0.5">
                                          <p className="text-stone-900">{item.category}</p>
                                          <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-md font-mono">{item.tag}</span>
                                        </div>
                                      </td>
                                      <td className="px-5 py-3 font-bold text-stone-900">{item.title}</td>
                                      <td className="px-5 py-3 text-stone-600 max-w-[200px] truncate">{item.description}</td>
                                      <td className="px-5 py-3 text-right space-x-1.5 whitespace-nowrap">
                                        <button 
                                          onClick={() => handleOpenEditForm(item)}
                                          className="p-1.5 text-stone-600 hover:text-[#FF5B22] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteItem(item.id)}
                                          className="p-1.5 text-stone-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          )}

                          {/* TESTIMONIALS TABLE */}
                          {activeTab === 'testimonials' && (
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-stone-950 text-white font-semibold border-b border-stone-200">
                                  <th className="px-5 py-3">Client</th>
                                  <th className="px-5 py-3">Platform</th>
                                  <th className="px-5 py-3">Rating</th>
                                  <th className="px-5 py-3">Comment Text</th>
                                  <th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-100">
                                {testimonials.length === 0 ? (
                                  <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-stone-400 font-medium">
                                      No customer feedback. Click "Seed Original Data" to initialize.
                                    </td>
                                  </tr>
                                ) : (
                                  testimonials.map((item) => (
                                    <tr key={item.id} className="hover:bg-stone-50/50">
                                      <td className="px-5 py-3">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-100">
                                            <img src={item.avatarUrl} alt="" className="w-full h-full object-cover" />
                                          </div>
                                          <div>
                                            <h4 className="font-bold text-stone-900">{item.name}</h4>
                                            <p className="text-[10px] text-stone-500">{item.role} @ {item.company}</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-5 py-3 text-stone-600">
                                        <span className="capitalize px-2 py-0.5 rounded-full text-[10px] bg-stone-100 text-stone-700 font-semibold font-mono">
                                          {item.platform}
                                        </span>
                                      </td>
                                      <td className="px-5 py-3 font-bold text-amber-500">
                                        <div className="flex items-center gap-0.5">
                                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                          <span>{item.rating}</span>
                                        </div>
                                      </td>
                                      <td className="px-5 py-3 text-stone-600 max-w-[200px] truncate">{item.text}</td>
                                      <td className="px-5 py-3 text-right space-x-1.5 whitespace-nowrap">
                                        <button 
                                          onClick={() => handleOpenEditForm(item)}
                                          className="p-1.5 text-stone-600 hover:text-[#FF5B22] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteItem(item.id)}
                                          className="p-1.5 text-stone-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          )}

                          {/* BLOGS TABLE */}
                          {activeTab === 'blogs' && (
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-stone-950 text-white font-semibold border-b border-stone-200">
                                  <th className="px-5 py-3">Cover</th>
                                  <th className="px-5 py-3">Category</th>
                                  <th className="px-5 py-3">Title</th>
                                  <th className="px-5 py-3">Author</th>
                                  <th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-100">
                                {blogs.length === 0 ? (
                                  <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-stone-400 font-medium">
                                      No blog entries found. Click "Seed Original Data" to initialize.
                                    </td>
                                  </tr>
                                ) : (
                                  blogs.map((item) => (
                                    <tr key={item.id} className="hover:bg-stone-50/50">
                                      <td className="px-5 py-3">
                                        <div className="w-12 h-9 rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                                          <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                      </td>
                                      <td className="px-5 py-3 text-stone-600">
                                        <div className="space-y-0.5">
                                          <span className="text-stone-900 font-bold">{item.category}</span>
                                          <p className="text-[10px] text-stone-400">{item.readTime}</p>
                                        </div>
                                      </td>
                                      <td className="px-5 py-3 font-bold text-stone-900 max-w-[200px] truncate">{item.title}</td>
                                      <td className="px-5 py-3 text-stone-600">{item.author?.name || 'Gokul Krisnan'}</td>
                                      <td className="px-5 py-3 text-right space-x-1.5 whitespace-nowrap">
                                        <button 
                                          onClick={() => handleOpenEditForm(item)}
                                          className="p-1.5 text-stone-600 hover:text-[#FF5B22] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteItem(item.id)}
                                          className="p-1.5 text-stone-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          )}

                        </div>
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                
                /* SUB-FORM DIALOG (ADD/EDIT INLINE) */
                <form onSubmit={handleSubmitForm} className="flex-1 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col min-h-0 overflow-y-auto">
                  <div className="border-b border-stone-100 pb-4 mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                        {editingItem ? `Edit ${activeTab.slice(0, -1)} Detail` : `Add New ${activeTab.slice(0, -1)}`}
                      </h3>
                      <p className="text-xs text-stone-400">Specify precise properties for this document entry.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* SERVICES FIELDS */}
                  {activeTab === 'services' && (
                    <div className="space-y-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500">Service Title</label>
                        <input
                          type="text"
                          required
                          value={serviceTitle}
                          onChange={(e) => setServiceTitle(e.target.value)}
                          placeholder="e.g., UI Design, Brand Strategy"
                          className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500">Icon Presentation Style</label>
                        <select
                          value={serviceIcon}
                          onChange={(e) => setServiceIcon(e.target.value as any)}
                          className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                        >
                          <option value="monitor">🖥️ Desktop Display (Monitor)</option>
                          <option value="smartphone">📱 Mobile Focus (Smartphone)</option>
                          <option value="layers">🥞 Stack / Scalable (Layers)</option>
                          <option value="layout">🗺️ Core Wireframe (Layout)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500">Service Description</label>
                        <textarea
                          required
                          rows={4}
                          value={serviceDesc}
                          onChange={(e) => setServiceDesc(e.target.value)}
                          placeholder="Provide descriptive bullet or sentence summarizing what you offer clients..."
                          className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* WORKS FIELDS */}
                  {activeTab === 'works' && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500">Project Title</label>
                          <input
                            type="text"
                            required
                            value={workTitle}
                            onChange={(e) => setWorkTitle(e.target.value)}
                            placeholder="e.g., Fintech Landing Page"
                            className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500">Business Category</label>
                          <input
                            type="text"
                            required
                            value={workCategory}
                            onChange={(e) => setWorkCategory(e.target.value)}
                            placeholder="e.g., Banking Solution, Creative Agency"
                            className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500">General Tag</label>
                          <input
                            type="text"
                            required
                            value={workTag}
                            onChange={(e) => setWorkTag(e.target.value)}
                            placeholder="e.g., Web Design, UI/UX"
                            className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500">Redirect Link (Action)</label>
                          <input
                            type="text"
                            required
                            value={workLink}
                            onChange={(e) => setWorkLink(e.target.value)}
                            placeholder="Paste external portfolio page, Behance, or #"
                            className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500">Feature Image (URL or Upload)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={workImage}
                            onChange={(e) => setWorkImage(e.target.value)}
                            placeholder="Unsplash high-res image address or upload below"
                            className="flex-1 bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => triggerDeviceUpload(3/2, "3:2 Landscape", (url) => setWorkImage(url))}
                            className="bg-stone-900 hover:bg-[#FF5B22] text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload & Crop</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500">Project Description</label>
                        <textarea
                          required
                          rows={3}
                          value={workDesc}
                          onChange={(e) => setWorkDesc(e.target.value)}
                          placeholder="A quick description describing the work and results..."
                          className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* TESTIMONIALS FIELDS */}
                  {activeTab === 'testimonials' && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500">Client Name</label>
                          <input
                            type="text"
                            required
                            value={testName}
                            onChange={(e) => setTestName(e.target.value)}
                            placeholder="Sarah M."
                            className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500">Client Role</label>
                          <input
                            type="text"
                            required
                            value={testRole}
                            onChange={(e) => setTestRole(e.target.value)}
                            placeholder="Marketing Director"
                            className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500">Company Name</label>
                          <input
                            type="text"
                            required
                            value={testCompany}
                            onChange={(e) => setTestCompany(e.target.value)}
                            placeholder="Nexus Media"
                            className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500">Rating Stars</label>
                          <select
                            value={testRating}
                            onChange={(e) => setTestRating(Number(e.target.value))}
                            className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                            <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                            <option value={3}>⭐⭐⭐ 3 Stars</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500">Source Platform</label>
                          <select
                            value={testPlatform}
                            onChange={(e) => setTestPlatform(e.target.value as any)}
                            className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          >
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter (X)</option>
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="dribbble">Dribbble</option>
                          </select>
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-bold text-stone-500">Submission Date / Time-ago</label>
                          <input
                            type="text"
                            required
                            value={testTime}
                            onChange={(e) => setTestTime(e.target.value)}
                            placeholder="e.g., 2 mins ago, 3 days ago"
                            className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500">Avatar Image (URL or Upload)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={testAvatar}
                            onChange={(e) => setTestAvatar(e.target.value)}
                            placeholder="Paste client photo URL or upload below"
                            className="flex-1 bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => triggerDeviceUpload(1/1, "1:1 Square", (url) => setTestAvatar(url))}
                            className="bg-stone-900 hover:bg-[#FF5B22] text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload & Crop</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500">Testimonial Feedback Text</label>
                        <textarea
                          required
                          rows={3}
                          value={testText}
                          onChange={(e) => setTestText(e.target.value)}
                          placeholder="Write the exact quote..."
                          className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* BLOGS FIELDS */}
                  {activeTab === 'blogs' && (
                    <div className="space-y-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500">Article Title</label>
                        <input
                          type="text"
                          required
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          placeholder="e.g., The Anatomy of a Modern Minimalist Design System"
                          className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500">Category Tag</label>
                          <input
                            type="text"
                            required
                            value={blogCategory}
                            onChange={(e) => setBlogCategory(e.target.value)}
                            placeholder="e.g., Design Systems, Typography"
                            className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500">Read Duration</label>
                          <input
                            type="text"
                            required
                            value={blogReadTime}
                            onChange={(e) => setBlogReadTime(e.target.value)}
                            placeholder="e.g., 5 min read"
                            className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-500">Publish Date</label>
                          <input
                            type="text"
                            required
                            value={blogDate}
                            onChange={(e) => setBlogDate(e.target.value)}
                            placeholder="e.g., June 24, 2026"
                            className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500">Cover Banner Image (URL or Upload)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={blogImage}
                            onChange={(e) => setBlogImage(e.target.value)}
                            placeholder="Cover landscape image address or upload below"
                            className="flex-1 bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => triggerDeviceUpload(16/9, "16:9 Landscape", (url) => setBlogImage(url))}
                            className="bg-stone-900 hover:bg-[#FF5B22] text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload & Crop</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500">Blog Post Summary</label>
                        <input
                          type="text"
                          required
                          value={blogSummary}
                          onChange={(e) => setBlogSummary(e.target.value)}
                          placeholder="A single short paragraph summarizing the contents..."
                          className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500">Main Content Markdown / Text</label>
                        <textarea
                          required
                          rows={6}
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          placeholder="Full article content goes here..."
                          className="w-full bg-stone-50 border border-stone-200 focus:border-stone-900 focus:bg-white rounded-xl py-2.5 px-4 text-stone-800 outline-none transition-all font-mono"
                        />
                      </div>

                      {/* Nested Author fields */}
                      <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 space-y-3.5">
                        <h4 className="text-[10px] font-bold text-stone-400 tracking-wider uppercase">Author Attributes</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-stone-500">Author Name</label>
                            <input
                              type="text"
                              required
                              value={blogAuthorName}
                              onChange={(e) => setBlogAuthorName(e.target.value)}
                              className="w-full bg-white border border-stone-200 focus:border-stone-900 rounded-lg py-2 px-3 text-stone-800 outline-none text-xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-stone-500">Author Professional Role</label>
                            <input
                              type="text"
                              required
                              value={blogAuthorRole}
                              onChange={(e) => setBlogAuthorRole(e.target.value)}
                              className="w-full bg-white border border-stone-200 focus:border-stone-900 rounded-lg py-2 px-3 text-stone-800 outline-none text-xs"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-stone-500">Author Avatar (URL or Upload)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              required
                              value={blogAuthorAvatar}
                              onChange={(e) => setBlogAuthorAvatar(e.target.value)}
                              className="flex-1 bg-white border border-stone-200 focus:border-stone-900 rounded-lg py-2 px-3 text-stone-800 outline-none text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => triggerDeviceUpload(1/1, "1:1 Square", (url) => setBlogAuthorAvatar(url))}
                              className="bg-stone-900 hover:bg-[#FF5B22] text-white font-semibold px-3 py-2 rounded-lg text-[10px] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload & Crop</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submission and Cancel Buttons */}
                  <div className="flex items-center gap-3 pt-6 mt-6 border-t border-stone-100">
                    <button
                      type="submit"
                      className="bg-stone-950 hover:bg-[#FF5B22] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                    >
                      {editingItem ? "Update Changes" : "Save Document"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsFormOpen(false); setEditingItem(null); }}
                      className="text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 font-semibold py-2.5 px-5 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}
      </motion.div>

      {/* Hidden File Input for Device Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleDeviceFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Dynamic Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={cropperImage}
        aspectRatio={cropperAspect}
        aspectRatioLabel={cropperLabel}
        onCropComplete={(croppedUrl) => {
          if (cropperCallback) {
            cropperCallback(croppedUrl);
          }
        }}
      />
    </div>
  );
}
