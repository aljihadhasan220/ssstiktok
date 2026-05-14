import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Heart, 
  Settings as SettingsIcon,
  Trash2,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Screen, TikTokVideo, DownloadTask } from './types.ts';
import { TikTokApiService } from './services/apiService.ts';
import { TikTokDownloaderService } from './services/downloaderService.ts';
import { BrowserRouter, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SUPPORTED_LANGS, SEO_DATA, LangCode } from './lib/seo.ts';
import { usePWA } from './hooks/usePWA.ts';
import { LoadingScreen, Toast, NeoButton } from './components/UI.tsx';
import { LanguageSelector, Footer } from './components/Layout.tsx';
import { AppSettings } from './components/Screens.tsx';

// Lazy load screens for performance
const HomeScreen = lazy(() => import('./components/Screens.tsx').then(m => ({ default: m.HomeScreen })));
const SettingsScreen = lazy(() => import('./components/Screens.tsx').then(m => ({ default: m.SettingsScreen })));
const AboutPage = lazy(() => import('./components/Screens.tsx').then(m => ({ default: m.AboutPage })));
const PrivacyPage = lazy(() => import('./components/Screens.tsx').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./components/Screens.tsx').then(m => ({ default: m.TermsPage })));
const ContactPage = lazy(() => import('./components/Screens.tsx').then(m => ({ default: m.ContactPage })));
const BlogSection = lazy(() => import('./components/Screens.tsx').then(m => ({ default: m.BlogSection })));

// Shared Sections
const FeaturesSection = lazy(() => import('./components/Screens.tsx').then(m => ({ default: m.FeaturesSection })));
const HowItWorks = lazy(() => import('./components/Screens.tsx').then(m => ({ default: m.HowItWorks })));
const WhyChoose = lazy(() => import('./components/Screens.tsx').then(m => ({ default: m.WhyChoose })));
const FAQ = lazy(() => import('./components/Screens.tsx').then(m => ({ default: m.FAQ })));
const SEOContent = lazy(() => import('./components/Screens.tsx').then(m => ({ default: m.SEOContent })));
const ProcessingModal = lazy(() => import('./components/Screens.tsx').then(m => ({ default: m.ProcessingModal })));

// --- Constants ---
const APP_NAME = "SSSTikPro";
const STORAGE_KEY = 'ssstiktok_state_v1';

const PALETTES = [
  { name: 'Default', primary: '#9d00ff', secondary: '#00d4ff' },
  { name: 'Cyber', primary: '#ff00ea', secondary: '#ffea00' },
  { name: 'Forest', primary: '#00ff88', secondary: '#00bcff' },
  { name: 'Energy', primary: '#ff4d00', secondary: '#ffc400' }
];

const MainApp = () => {
  const { lang } = useParams<{ lang?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const currentLang = (lang && SUPPORTED_LANGS.includes(lang as any) ? lang : 'en') as LangCode;
  const seo = SEO_DATA[currentLang];

  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { deferredPrompt, handleInstallApp, isInstalled } = usePWA();

  // Sync route with activeScreen
  useEffect(() => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    const firstSegment = segments[0];

    if (firstSegment === 'blog') setActiveScreen('blog');
    else if (firstSegment === 'about') setActiveScreen('about');
    else if (firstSegment === 'privacy') setActiveScreen('privacy');
    else if (firstSegment === 'terms') setActiveScreen('terms');
    else if (firstSegment === 'contact') setActiveScreen('contact');
    else if (firstSegment === 'settings') setActiveScreen('settings');
    else if (!firstSegment || SUPPORTED_LANGS.includes(firstSegment as any)) setActiveScreen('home');
  }, [location.pathname]);

  const handleNavigate = useCallback((s: Screen) => {
    if (s === 'home') navigate(currentLang === 'en' ? '/' : `/${currentLang}`);
    else navigate(`/${s}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate, currentLang]);

  const [tasks, setTasks] = useState<DownloadTask[]>([]);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: true,
    autoPaste: true,
    palette: PALETTES[0]
  });

  // Initialize from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTasks(parsed.downloads?.filter((t: any) => t.status === 'completed') || []);
        if (parsed.settings) setSettings(prev => ({ ...prev, ...parsed.settings }));
      } catch (e) { console.error("Failed to load state", e); }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ downloads: tasks, settings }));
  }, [tasks, settings]);

  // Theme & Palette
  useEffect(() => {
    document.body.classList.toggle('light', !settings.darkMode);
    document.documentElement.style.setProperty('--neon-purple', settings.palette.primary);
    document.documentElement.style.setProperty('--neon-blue', settings.palette.secondary);
  }, [settings.darkMode, settings.palette]);

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const addDownloadTask = useCallback(async (video: TikTokVideo, type: 'hd' | 'nowm' | 'mp3') => {
    const taskId = `${video.id}-${type}-${Date.now()}`;
    const newTask: DownloadTask = {
      id: taskId,
      video,
      type,
      status: 'idle',
      progress: 0,
      fileName: `${video.id}_${type}.${type === 'mp3' ? 'mp3' : 'mp4'}`,
      timestamp: Date.now()
    };

    setTasks(prev => [...prev, newTask]);

    try {
      await TikTokDownloaderService.downloadFile(
        newTask,
        (progress) => setTasks(current => current.map(t => t.id === taskId ? { ...t, progress } : t)),
        (status) => {
          setTasks(current => current.map(t => t.id === taskId ? { ...t, status } : t));
          if (status === 'completed') addToast(`${type.toUpperCase()} Finished!`);
        }
      );
    } catch (e) { addToast(`Failed to download ${type.toUpperCase()}`, 'error'); }
  }, [addToast]);

  return (
    <div className="min-h-screen relative bg-[var(--bg-color)] font-sans text-[var(--text-main)] transition-colors duration-500 overflow-x-hidden">
      <Helmet>
        <html lang={currentLang} />
        <title>{activeScreen === 'home' ? seo.title : `${activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1)} - ${APP_NAME}`}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={`https://ssstikpro.site${location.pathname}`} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={settings.palette.primary} />
      </Helmet>

      {/* Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{ background: 'var(--bg-glow-purple)' }} className="absolute -top-[20%] -left-[10%] w-[100vw] h-[100vw] rounded-full blur-[140px] opacity-50" />
        <div style={{ background: 'var(--bg-glow-blue)' }} className="absolute top-[30%] -right-[20%] w-[120vw] h-[120vw] rounded-full blur-[160px] opacity-50" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 p-4 pt-8 glass backdrop-blur-3xl bg-transparent">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('home')}>
              <div className="w-10 h-10 rounded-2xl neo-gradient p-0.5"><div className="w-full h-full bg-[var(--bg-color)] rounded-2xl flex items-center justify-center"><Download className="w-5 h-5 text-neon-blue" /></div></div>
              <div className="flex flex-col"><h1 className="text-lg font-bold italic truncate leading-tight uppercase tracking-tighter">{APP_NAME}</h1><p className="text-[6px] font-black tracking-widest uppercase opacity-40">Next-Gen Engine</p></div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <NeoButton variant="ghost" className="p-3 !rounded-2xl glass" onClick={() => handleNavigate('settings')}><SettingsIcon className={`w-5 h-5 ${activeScreen === 'settings' ? 'text-neon-purple' : 'text-neon-blue'}`} /></NeoButton>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Suspense fallback={<LoadingScreen />}>
            <AnimatePresence mode="wait">
              {activeScreen === 'home' ? (
                <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <HomeScreen addDownload={addDownloadTask} addToast={addToast} settings={settings} isAnalyzing={isAnalyzing} setIsAnalyzing={setIsAnalyzing} />
                  <ProcessingModal isOpen={isAnalyzing} />
                  <div className="mt-20">
                    <FeaturesSection features={seo.features} />
                    <HowItWorks content={seo.howItWorks} />
                    <WhyChoose content={seo.whyChoose} />
                    <FAQ faqs={seo.faq} />
                    <SEOContent content={seo.seoContent} />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="internal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  {activeScreen === 'about' && <AboutPage onBack={() => handleNavigate('home')} />}
                  {activeScreen === 'privacy' && <PrivacyPage onBack={() => handleNavigate('home')} />}
                  {activeScreen === 'terms' && <TermsPage onBack={() => handleNavigate('home')} />}
                  {activeScreen === 'contact' && <ContactPage onBack={() => handleNavigate('home')} />}
                  {activeScreen === 'blog' && <BlogSection onNavigate={handleNavigate} />}
                  {activeScreen === 'settings' && (
                    <SettingsScreen 
                      settings={settings} setSettings={setSettings} addToast={addToast} onBack={() => handleNavigate('home')}
                      deferredPrompt={deferredPrompt} onInstall={handleInstallApp} isInstalled={isInstalled}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Suspense>
          <Footer onNavigate={handleNavigate} />
        </main>
      </div>

      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>
    </div>
  );
};

// --- App Root ---

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/blog" element={<MainApp />} />
          <Route path="/blog/:lang" element={<MainApp />} />
          <Route path="/about" element={<MainApp />} />
          <Route path="/privacy" element={<MainApp />} />
          <Route path="/terms" element={<MainApp />} />
          <Route path="/contact" element={<MainApp />} />
          <Route path="/settings" element={<MainApp />} />
          <Route path="/:lang" element={<MainApp />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
