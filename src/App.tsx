import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Download, 
  Heart, 
  Settings as SettingsIcon,
  Search,
  Clipboard as ClipboardIcon,
  Zap,
  CheckCircle2,
  MoreVertical,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Share2,
  Trash2,
  Moon,
  Sun,
  Palette,
  Info,
  Star,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Globe
} from 'lucide-react';
import { Screen, TikTokVideo, DownloadTask, DownloadStatus } from './types.ts';
import { TikTokApiService } from './services/apiService.ts';
import { TikTokDownloaderService } from './services/downloaderService.ts';
import { Clipboard } from '@capacitor/clipboard';
import { Capacitor } from '@capacitor/core';
import { BrowserRouter, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SUPPORTED_LANGS, SEO_DATA, LangCode, SeoMetadata } from './lib/seo.ts';

// --- Constants ---
const APP_NAME = "SSSTikPro";
const STORAGE_KEY = 'ssstiktok_state_v1';

// --- Components ---

const Toast = ({ message, type = 'success', onClose }: { message: string, type?: 'success' | 'error', onClose: () => void, key?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5 }}
    className={`fixed bottom-28 left-4 right-4 z-[100] p-4 rounded-2xl shadow-2xl flex items-center gap-3 glass border-[var(--glass-border)] ${
      type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'
    }`}
  >
    {type === 'success' ? (
      <CheckCircle2 className="w-5 h-5 text-green-400" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-400" />
    )}
    <p className="text-sm font-medium text-[var(--text-main)]/90">{message}</p>
    <button onClick={onClose} className="ml-auto text-[var(--text-dim)]"><Trash2 className="w-4 h-4" /></button>
  </motion.div>
);

const NeoButton = ({ children, onClick, className = "", variant = "primary", disabled = false }: any) => {
  const variants: any = {
    primary: "neo-gradient text-white shadow-[0_0_15px_-3px_var(--neon-purple)]",
    outline: "glass border-[var(--glass-border)] text-[var(--text-main)] hover:bg-[var(--glass-bg)]",
    ghost: "text-[var(--text-dim)] hover:text-[var(--text-main)]",
    danger: "bg-red-500/20 text-red-500 border border-red-500/30"
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={disabled ? undefined : onClick}
      className={`relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden ${
        variants[variant]
      } ${disabled ? 'opacity-50 cursor-not-allowed shadow-none' : ''} ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </motion.button>
  );
};

const GlassCard = ({ children, className = "" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass rounded-3xl p-6 relative overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

// --- Screens ---

const FeatureCard = React.memo(({ icon: Icon, title, description }: any) => (
  <div className="glass p-8 rounded-3xl border border-white/5 hover:border-neon-purple/30 group transition-all duration-500 hover:-translate-y-2 will-change-transform">
    <div className="w-12 h-12 rounded-2xl neo-gradient flex items-center justify-center p-0.5 mb-6 shadow-lg shadow-neon-purple/10">
      <div className="w-full h-full bg-[var(--bg-color)] rounded-2xl flex items-center justify-center text-neon-blue">
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
    <p className="text-sm text-[var(--text-dim)] leading-relaxed">{description}</p>
  </div>
));

const FeaturesSection = React.memo(({ features }: { features: SeoMetadata['features'] }) => (
  <section id="features" className="py-20 px-6 max-w-5xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12 neo-text-gradient">Premium Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <FeatureCard icon={ShieldCheck} title={features[0].title} description={features[0].description} />
      <FeatureCard icon={Zap} title={features[1].title} description={features[1].description} />
      <FeatureCard icon={RefreshCw} title={features[2].title} description={features[2].description} />
      <FeatureCard icon={Star} title={features[3].title} description={features[3].description} />
      <FeatureCard icon={Home} title={features[4].title} description={features[4].description} />
      <FeatureCard icon={CheckCircle2} title={features[5].title} description={features[5].description} />
    </div>
  </section>
));

const HowItWorks = React.memo(({ content }: { content: SeoMetadata['howItWorks'] }) => (
  <section id="how-it-works" className="py-20 px-6 bg-white/[0.02]">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-16 neo-text-gradient">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-full glass border border-neon-purple/30 flex items-center justify-center mx-auto text-neon-purple text-2xl font-bold">1</div>
          <h3 className="text-xl font-bold">Copy TikTok Link</h3>
          <p className="text-sm text-[var(--text-dim)]">{content.step1}</p>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-full glass border border-neon-blue/30 flex items-center justify-center mx-auto text-neon-blue text-2xl font-bold">2</div>
          <h3 className="text-xl font-bold">Paste URL</h3>
          <p className="text-sm text-[var(--text-dim)]">{content.step2}</p>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-full glass border border-neon-pink/30 flex items-center justify-center mx-auto text-neon-pink text-2xl font-bold">3</div>
          <h3 className="text-xl font-bold">Download Instantly</h3>
          <p className="text-sm text-[var(--text-dim)]">{content.step3}</p>
        </div>
      </div>
    </div>
  </section>
));

const WhyChoose = React.memo(({ content }: { content: SeoMetadata['whyChoose'] }) => (
  <section id="why-choose" className="py-20 px-6 max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12 neo-text-gradient">{content.title}</h2>
    <div className="glass rounded-[40px] p-10 border-white/5 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 neo-gradient opacity-5 blur-[80px] -mr-10 -mt-10" />
      <div className="flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-neon-blue" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-1">{content.f1.t}</h4>
            <p className="text-sm text-[var(--text-dim)]">{content.f1.d}</p>
          </div>
      </div>
      <div className="flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 flex items-center justify-center shrink-0">
            <Palette className="w-6 h-6 text-neon-purple" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-1">{content.f2.t}</h4>
            <p className="text-sm text-[var(--text-dim)]">{content.f2.d}</p>
          </div>
      </div>
      <div className="flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-neon-pink/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-neon-pink" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-1">{content.f3.t}</h4>
            <p className="text-sm text-[var(--text-dim)]">{content.f3.d}</p>
          </div>
      </div>
      <div className="flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 text-neon-blue" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-1">{content.f4.t}</h4>
            <p className="text-sm text-[var(--text-dim)]">{content.f4.d}</p>
          </div>
      </div>
    </div>
  </section>
));


const FAQ = React.memo(({ faqs }: { faqs: SeoMetadata['faq'] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 neo-text-gradient">FAQ</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="glass rounded-2xl border border-white/5 overflow-hidden">
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <span className="font-bold text-base tracking-tight">{faq.q}</span>
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 text-neon-blue ${openIndex === i ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-sm text-[var(--text-dim)] leading-relaxed">{faq.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
});

const SEOContent = React.memo(({ content }: { content: SeoMetadata['seoContent'] }) => (
  <section id="about-downloader" className="py-20 px-6 max-w-4xl mx-auto opacity-70">
    <div className="space-y-12">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-main)]">{content.h2}</h2>
        <p className="text-sm leading-relaxed">{content.p1}</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[var(--text-main)]">{content.h3_1}</h3>
        <p className="text-sm leading-relaxed">{content.p2}</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[var(--text-main)]">{content.h3_2}</h3>
        <p className="text-sm leading-relaxed">{content.p3}</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[var(--text-main)]">{content.h3_3}</h3>
        <p className="text-sm leading-relaxed">{content.p4}</p>
      </div>
    </div>
  </section>
));


const PageWrapper = ({ title, children, onBack }: { title: string, children: React.ReactNode, onBack: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="py-12 px-6 max-w-4xl mx-auto w-full"
  >
    <div className="flex items-center gap-4 mb-10">
      <NeoButton variant="ghost" className="!p-3 !rounded-2xl glass border-white/5" onClick={onBack}>
        <ArrowRight className="w-5 h-5 rotate-180" />
      </NeoButton>
      <h2 className="text-3xl font-bold neo-text-gradient">{title}</h2>
    </div>

    <GlassCard className="border-white/5 bg-white/[0.03] !p-8 md:!p-12 prose prose-invert max-w-none prose-sm sm:prose-base leading-relaxed text-[var(--text-dim)]">
      {children}
    </GlassCard>

    <div className="mt-12 text-center">
      <NeoButton className="mx-auto" onClick={onBack}>
        <Home className="w-5 h-5" />
        <span>Back to Home</span>
      </NeoButton>
    </div>
  </motion.div>
);

const AboutPage = ({ onBack }: { onBack: () => void }) => (
  <PageWrapper title="About SSSTikPro" onBack={onBack}>
    <div className="space-y-6">
      <p className="text-lg text-[var(--text-main)] font-semibold">SSSTikPro is a next-generation TikTok downloader designed for the futuristic web.</p>
      <p>We provide a premium, fast, and secure way to preserve your favorite moments from TikTok without any distracting watermarks or advertisements.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <h4 className="text-neon-blue font-bold mb-2">HD Quality</h4>
          <p className="text-xs">Download in original high definition resolution directly from TikTok servers.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <h4 className="text-neon-purple font-bold mb-2">No Watermark</h4>
          <p className="text-xs">Our advanced engine strips all platform watermarks for a clean viewing experience.</p>
        </div>
      </div>

      <p>Our goal is to offer a seamless experience across all platforms, whether you're on a mobile device, tablet, or desktop. No login, no hidden fees, just pure functionality wrapped in a beautiful futuristic design.</p>
    </div>
  </PageWrapper>
);

const PrivacyPage = ({ onBack }: { onBack: () => void }) => (
  <PageWrapper title="Privacy Policy" onBack={onBack}>
    <div className="space-y-6">
      <p>At SSSTikPro, we take your privacy very seriously. This policy outlines our commitment to protecting your data while you use our services.</p>
      
      <h4 className="text-[var(--text-main)] font-bold text-lg">No Video Storage</h4>
      <p>We do not store any videos you download on our servers. All video processing happens in real-time and the files are served directly from sources to your device.</p>

      <h4 className="text-[var(--text-main)] font-bold text-lg">No Login Required</h4>
      <p>You can use all features of SSSTikPro without needing to create an account or provide any personal information like email, phone number, or social media handles.</p>

      <h4 className="text-[var(--text-main)] font-bold text-lg">Cookies Usage</h4>
      <p>We use minimal cookies solely to remember your UI preferences (like Dark/Light mode and accent colors) locally on your device using browser local storage. We do not track your browsing habits or sell your data to third parties.</p>

      <h4 className="text-[var(--text-main)] font-bold text-lg">Data Encryption</h4>
      <p>All connections to SSSTikPro are secured using industry-standard SSL encryption, ensuring your interactions with our downloader are private and safe.</p>
    </div>
  </PageWrapper>
);

const TermsPage = ({ onBack }: { onBack: () => void }) => (
  <PageWrapper title="Terms & Conditions" onBack={onBack}>
    <div className="space-y-6">
      <p>By using SSSTikPro, you agree to comply with the following terms and conditions. Please read them carefully.</p>

      <h4 className="text-[var(--text-main)] font-bold text-lg">Fair Usage Policy</h4>
      <p>SSSTikPro is intended for personal, non-commercial use. Users are prohibited from using the service for automated scraping, bulk downloading, or any activity that places unreasonable load on our infrastructure.</p>

      <h4 className="text-[var(--text-main)] font-bold text-lg">Copyright Notice</h4>
      <p>Users are responsible for ensuring they have the right to download and use the content they obtain through SSSTikPro. We do not host any content and are merely a technical intermediary. Respect the original creators' rights and follow regional copyright laws.</p>

      <h4 className="text-[var(--text-main)] font-bold text-lg">User Responsibility</h4>
      <p>The service is provided "as is" without any warranties. Users assume all responsibility for the way they use the downloaded content. SSSTikPro is not affiliated with ByteDance or TikTok.</p>

      <h4 className="text-[var(--text-main)] font-bold text-lg">Service Updates</h4>
      <p>We reserve the right to modify or discontinue service features at any time without prior notice as we continue to evolve our futuristic engine.</p>
    </div>
  </PageWrapper>
);

const ContactPage = ({ onBack }: { onBack: () => void }) => (
  <PageWrapper title="Contact Support" onBack={onBack}>
    <div className="flex flex-col items-center text-center space-y-8">
      <div className="w-20 h-20 rounded-[28px] neo-gradient flex items-center justify-center p-0.5 shadow-2xl shadow-neon-blue/20">
        <div className="w-full h-full bg-[#0a0a0b] rounded-[26px] flex items-center justify-center">
          <Zap className="w-10 h-10 text-neon-blue" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Have Questions or Feedback?</h3>
        <p>Our futuristic support team is ready to assist you with any engine-sync issues or feature requests.</p>
      </div>

      <div className="w-full p-8 rounded-3xl bg-white/5 border border-neon-blue/20 group hover:border-neon-blue transition-all">
        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-2">Primary Communication Channel</p>
        <a 
          href="mailto:ssstiktokpro@gmail.com" 
          className="text-2xl font-bold text-neon-blue hover:text-white transition-colors underline decoration-neon-blue/30 underline-offset-8"
        >
          ssstiktokpro@gmail.com
        </a>
      </div>

      <p className="text-xs italic text-white/20">We typically respond within 24 standard earth cycles.</p>
    </div>
  </PageWrapper>
);

const SettingsScreen = ({ settings, setSettings, addToast, onBack }: { 
  settings: AppSettings, 
  setSettings: (s: any) => void, 
  addToast: (m: string, t?: 'success' | 'error') => void,
  onBack: () => void
}) => {
  const handleShare = async () => {
    const shareData = {
      title: 'SSSTikPro - TikTok Video Downloader',
      text: 'Download TikTok videos without watermark in HD quality using SSSTikPro.',
      url: 'https://ssstikpro.site'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error('Share not supported');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        try {
          if (Capacitor.isNativePlatform()) {
            await Clipboard.write({ string: shareData.url });
          } else {
            await navigator.clipboard.writeText(shareData.url);
          }
          addToast("Link copied successfully");
        } catch (copyErr) {
          addToast("Failed to copy link", 'error');
        }
      }
    }
  };

  return (
    <PageWrapper title="App Settings" onBack={onBack}>
      <div className="space-y-12">
          <div className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-dim)] font-black px-2">Visual Engine</h3>
            <GlassCard className="!p-0 overflow-hidden divide-y divide-white/5 border-white/5 bg-transparent">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-neon-purple/20 flex items-center justify-center">
                    {settings.darkMode ? <Moon className="w-6 h-6 text-neon-purple" /> : <Sun className="w-6 h-6 text-neon-purple" />}
                  </div>
                  <div>
                    <p className="text-base font-bold text-[var(--text-main)]">Theme Mode</p>
                    <p className="text-[10px] text-[var(--text-dim)] uppercase font-bold tracking-wider">{settings.darkMode ? 'True OLED Dark' : 'Crystal Light'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSettings((prev: any) => ({ ...prev, darkMode: !prev.darkMode }));
                    addToast(`Theme: ${!settings.darkMode ? 'Dark' : 'Light'}`);
                  }}
                  className={`w-14 h-7 rounded-full p-1 transition-all duration-500 relative ${settings.darkMode ? 'neo-gradient' : 'bg-black/10'}`}
                >
                  <motion.div 
                    animate={{ x: settings.darkMode ? 28 : 0 }}
                    className="w-5 h-5 rounded-full bg-white shadow-lg" 
                  />
                </button>
              </div>
              
              <div className="flex flex-col p-6 gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neon-blue/20 flex items-center justify-center">
                      <Palette className="w-6 h-6 text-neon-blue" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-[var(--text-main)]">Ui Palette</p>
                      <p className="text-[10px] text-[var(--text-dim)] uppercase font-bold tracking-wider">Futuristic Neon</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 px-2">
                  {PALETTES.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => {
                        setSettings((prev: any) => ({ ...prev, palette: p }));
                        addToast(`${p.name} palette applied`);
                      }}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all p-1 ${
                        settings.palette.name === p.name ? 'border-neon-blue scale-110 shadow-lg shadow-neon-blue/20' : 'border-white/10'
                      }`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden flex rotate-45">
                        <div className="w-1/2 h-full" style={{ background: p.primary }} />
                        <div className="w-1/2 h-full" style={{ background: p.secondary }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-dim)] font-black px-2">Automation</h3>
            <GlassCard className="!p-0 overflow-hidden border-white/5 bg-transparent">
               <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <ClipboardIcon className="w-6 h-6 text-white/50" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[var(--text-main)]">Auto Paste</p>
                    <p className="text-[10px] text-[var(--text-dim)] uppercase font-bold tracking-wider">Link detection</p>
                  </div>
                </div>
                 <button 
                  onClick={() => {
                    setSettings((prev: any) => ({ ...prev, autoPaste: !prev.autoPaste }));
                    addToast(`Auto paste ${!settings.autoPaste ? 'enabled' : 'disabled'}`);
                  }}
                  className={`w-14 h-7 rounded-full p-1 transition-all duration-500 relative ${settings.autoPaste ? 'neo-gradient' : 'bg-white/10'}`}
                >
                  <motion.div 
                    animate={{ x: settings.autoPaste ? 28 : 0 }}
                    className="w-5 h-5 rounded-full bg-white shadow-lg" 
                  />
                </button>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-dim)] font-black px-2">Sharing</h3>
            <GlassCard className="!p-0 overflow-hidden border-white/5 bg-transparent">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-neon-blue/20 flex items-center justify-center">
                    <Share2 className="w-6 h-6 text-neon-blue" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[var(--text-main)]">Share App</p>
                    <p className="text-[10px] text-[var(--text-dim)] uppercase font-bold tracking-wider">SHARE SSSTIKPRO WITH FRIENDS</p>
                  </div>
                </div>
                <NeoButton 
                  className="!py-2 !px-4 !rounded-xl text-[10px] font-black tracking-widest uppercase"
                  onClick={handleShare}
                >
                  Share Now
                </NeoButton>
              </div>
            </GlassCard>
          </div>

        <div className="text-center py-6 opacity-30 mt-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <p className="text-[10px] font-black tracking-[0.3em] uppercase">{APP_NAME} Core v4.2.0</p>
          </div>
          <p className="text-[8px] uppercase tracking-widest italic">Designed in Neo-Tokyo for the Global Future</p>
        </div>
      </div>
    </PageWrapper>
  );
};

const Footer = React.memo(({ onNavigate }: { onNavigate: (s: Screen) => void }) => (
  <footer className="py-16 px-6 border-t border-white/5 bg-black/20">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
        <div className="w-10 h-10 rounded-2xl neo-gradient flex items-center justify-center p-0.5">
          <div className="w-full h-full bg-[#0a0a0b] rounded-2xl flex items-center justify-center">
            <Download className="w-5 h-5 text-neon-blue" />
          </div>
        </div>
        <span className="text-xl font-bold italic tracking-tighter">SSSTikPro</span>
      </div>
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[11px] font-black tracking-[0.2em] uppercase text-[var(--text-dim)]">
        <button onClick={() => onNavigate('about')} className="hover:text-neon-blue transition-colors">About</button>
        <button onClick={() => onNavigate('blog')} className="hover:text-neon-blue transition-colors">Blog</button>
        <button onClick={() => onNavigate('privacy')} className="hover:text-neon-blue transition-colors">Privacy Policy</button>
        <button onClick={() => onNavigate('terms')} className="hover:text-neon-blue transition-colors">Terms</button>
        <button onClick={() => onNavigate('contact')} className="hover:text-neon-blue transition-colors">Contact</button>
      </div>
      <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-[0.3em] font-black">
        &copy; 2026 SSSTikPro. <span className="hidden sm:inline">All rights reserved.</span>
      </p>
    </div>
  </footer>
));


const HomeScreen = ({ addDownload, addToast, settings, isAnalyzing, setIsAnalyzing }: { 
  addDownload: (video: TikTokVideo, type: any) => void, 
  addToast: (m: string, t?: any) => void, 
  settings: AppSettings,
  isAnalyzing: boolean,
  setIsAnalyzing: (v: boolean) => void
}) => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<TikTokVideo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleDownloadSlide = useCallback(async (imageUrl: string) => {
    const filename = `ssstikpro-slide-${currentSlide + 1}.jpg`;
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`;
    
    try {
      addToast("Downloading slide...");
      
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      if (blob.size === 0) throw new Error('Empty file received');
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      }, 200);
    } catch (e) {
      console.error('Download error:', e);
      addToast("Failed to download image. Please try again.", 'error');
    }
  }, [currentSlide, addToast]);

  // Auto Paste Logic
  useEffect(() => {
    if (settings.autoPaste) {
      const checkClipboard = async () => {
        try {
          let text = '';
          if (Capacitor.isNativePlatform()) {
            const { value } = await Clipboard.read();
            text = value;
          } else {
            // Check if we have permission first to avoid annoying prompts
            const result = await navigator.permissions.query({ name: 'clipboard-read' as any });
            if (result.state === 'granted') {
              text = await navigator.clipboard.readText();
            }
          }
          
          if (text && TikTokApiService.validateUrl(text) && text !== url) {
            setUrl(text);
            addToast("Link detected from clipboard");
          }
        } catch (e) {
          // Fail silently for auto-paste permission/errors
        }
      };

      // Check on mount and when window gains focus
      checkClipboard();
      window.addEventListener('focus', checkClipboard);
      return () => window.removeEventListener('focus', checkClipboard);
    }
  }, [settings.autoPaste]);

  const handlePaste = useCallback(async () => {
    try {
      let text = '';
      if (Capacitor.isNativePlatform()) {
        const { value } = await Clipboard.read();
        text = value;
      } else {
        // Direct attempt for manual click - browser usually allows this on click
        text = await navigator.clipboard.readText();
      }
      
      if (text) {
        setUrl(text);
        addToast("URL Pasted");
      }
    } catch (e) {
      // Fail silently if access is blocked, user can still type
      console.warn("Clipboard access blocked");
    }
  }, [addToast]);

  const handleAnalyze = useCallback(async (manualUrl?: string) => {
    const targetUrl = manualUrl || url;
    if (!targetUrl.trim()) {
      addToast("Please enter a URL first", 'error');
      return;
    }
    
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const data = await TikTokApiService.analyzeUrl(targetUrl);
      setResult(data);
      setCurrentSlide(0);
      addToast("Video analyzed successfully");
    } catch (err: any) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  }, [url, addToast, setIsAnalyzing]);

  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4 text-center mt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border-[var(--glass-border)] mb-4 animate-pulse mx-auto">
            <ShieldCheck className="w-4 h-4 text-neon-blue" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-dim)]">Secure & Watermark Free</span>
          </div>
          <h2 className="text-[38px] sm:text-[42px] font-bold px-4 leading-[1.1] tracking-tight text-[var(--text-main)] text-center">
            TikTok Video <br />
            <span className="neo-text-gradient italic">Downloader</span>
          </h2>
          <p className="text-[var(--text-dim)] text-sm max-w-[280px] mx-auto leading-relaxed text-center">
            Preserve your favorite moments in HD quality, instantly.
          </p>
        </motion.div>

      {/* Input */}
      <GlassCard className="mx-4 border-white/5 shadow-2xl">
        <div className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                id="tiktok-url-input"
                name="tiktok-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Insert a TikTok link here..."
                aria-label="Paste TikTok video URL here"
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-6 pl-14 pr-24 text-sm focus:outline-none focus:border-neon-purple/50 focus:ring-4 focus:ring-neon-purple/10 transition-all placeholder:text-[var(--text-dim)]"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-dim)]" />
              <button 
                title="Paste URL from clipboard"
                aria-label="Paste from clipboard"
                onClick={handlePaste}
                className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2.5 glass rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-[var(--glass-bg)] transition-colors border-[var(--glass-border)]"
              >
                Paste
              </button>
            </div>

            <NeoButton 
              title="Download TikTok Video"
              aria-label="Start analysis and download"
              className="w-full py-5 rounded-[22px] text-lg"
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing}
            >
            {isAnalyzing ? (
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="tracking-widest uppercase text-sm font-bold">Processing Engine...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-bold">DOWNLOAD NOW</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </NeoButton>
        </div>
      </GlassCard>

      {/* States: Error or Result */}
      <AnimatePresence mode="wait">
        {isAnalyzing && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="mx-4"
          >
            <div className="glass rounded-3xl p-5 animate-pulse flex gap-5 border-white/5">
              <div className="w-32 aspect-[9/16] bg-white/5 rounded-2xl" />
              <div className="flex-1 space-y-4 py-2">
                <div className="h-10 w-10 rounded-full bg-white/5" />
                <div className="h-4 w-3/4 bg-white/5 rounded-lg" />
                <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-4"
          >
            <div className="glass rounded-3xl p-6 border-red-500/20 bg-red-500/5 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <p className="text-sm font-medium text-red-200">{error}</p>
              <NeoButton 
                variant="outline" 
                className="mx-auto !py-2 !px-4 text-xs tracking-widest border-red-500/10"
                onClick={() => handleAnalyze()}
              >
                RETRY ANALYSIS
              </NeoButton>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mx-auto w-[92%] sm:w-full max-w-[350px] sm:max-w-none sm:mx-4"
          >
            <GlassCard className="!p-3.5 sm:!p-5 border-white/10 bg-white/[0.03]">
              <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-5">
                {result.isSlideshow && result.images ? (
                   <div className="relative w-full sm:w-48 aspect-[1/1] sm:aspect-[9/16] rounded-2xl overflow-hidden bg-black/40 group select-none">
                      <AnimatePresence mode="wait">
                        <motion.img 
                          key={currentSlide}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          onDragEnd={(_, info) => {
                            if (info.offset.x < -50) {
                              setCurrentSlide(prev => (prev < result.images!.length - 1 ? prev + 1 : 0));
                            } else if (info.offset.x > 50) {
                              setCurrentSlide(prev => (prev > 0 ? prev - 1 : result.images!.length - 1));
                            }
                          }}
                          src={result.images[currentSlide]} 
                          alt={`Slide ${currentSlide + 1}`} 
                          className="w-full h-full object-cover cursor-grab active:cursor-grabbing will-change-transform" 
                          draggable={false}
                          loading="eager"
                          decoding="async"
                        />
                      </AnimatePresence>
                      
                      {/* Navigation Controls */}
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 pointer-events-none">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlide(prev => (prev > 0 ? prev - 1 : result.images!.length - 1));
                          }}
                          className="w-9 h-9 rounded-full glass border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlide(prev => (prev < result.images!.length - 1 ? prev + 1 : 0));
                          }}
                          className="w-9 h-9 rounded-full glass border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Pagination Dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 glass rounded-full border-white/5 backdrop-blur-md">
                        {result.images.slice(0, 10).map((_, i) => (
                          <button 
                            key={i} 
                            onClick={() => setCurrentSlide(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              currentSlide === i ? 'bg-neon-blue w-4' : 'bg-white/20 hover:bg-white/40'
                            }`} 
                          />
                        ))}
                      </div>

                      <div className="absolute top-3 left-3 px-2 py-1 glass rounded-lg text-[8px] sm:text-[9px] font-black tracking-tighter bg-neon-purple text-white border-none uppercase shadow-lg">
                        PHOTO {currentSlide + 1} / {result.images.length}
                      </div>
                   </div>
                ) : (
                  <div className="relative w-full sm:w-32 aspect-[1/1] sm:aspect-[9/16] rounded-2xl overflow-hidden bg-black/40 group">
                    <img src={result.thumbnail} alt={`TikTok video preview by ${result.author.id}`} title="TikTok Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="eager" decoding="async" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1">
                      <div className="px-1.5 py-0.5 glass rounded-[4px] text-[8px] font-black tracking-tighter bg-neon-blue text-black border-none">ULTRA HD</div>
                    </div>
                  </div>
                )}
                
                <div className="flex-1 space-y-3 sm:space-y-4 py-1">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative">
                      <img src={result.author.avatar} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/10" alt={`Author ${result.author.id}`} title={result.author.id} />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-neon-blue rounded-full flex items-center justify-center p-0.5 border-2 border-[var(--bg-color)]">
                        <CheckCircle2 className="w-full h-full text-black" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] sm:text-xs font-bold truncate tracking-tight text-[var(--text-main)]">{result.author.id}</p>
                      <p className="text-[9px] sm:text-[10px] text-[var(--text-dim)] truncate font-bold uppercase tracking-wider">Verified Identity</p>
                    </div>
                  </div>
                  
                  <p className="text-[10px] sm:text-[11px] text-[var(--text-main)]/70 line-clamp-3 sm:line-clamp-4 leading-relaxed font-medium">
                    {result.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <div className="px-2 py-1 glass rounded-lg text-[8px] sm:text-[9px] font-bold text-[var(--text-dim)] flex items-center gap-1">
                      <Heart className="w-2.5 h-2.5 sm:w-3 h-3 text-neon-pink" /> {result.stats.likes}
                    </div>
                    <div className="px-2 py-1 glass rounded-lg text-[8px] sm:text-[9px] font-bold text-[var(--text-dim)] flex items-center gap-1">
                      <Share2 className="w-2.5 h-2.5 sm:w-3 h-3 text-neon-blue" /> {result.stats.shares}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-8 grid grid-cols-1 gap-2 sm:gap-3">
                {result.isSlideshow ? (
                  <>
                    <div className="group relative">
                      <div className="absolute -inset-0.5 neo-gradient rounded-[20px] blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
                      <NeoButton 
                        title="Download current slide image"
                        aria-label="Download slide"
                        className="w-full bg-[var(--bg-color)] !shadow-none py-3 sm:py-4 border-none text-[11px] sm:text-sm tracking-widest font-black"
                        onClick={() => handleDownloadSlide(result.images![currentSlide])}
                      >
                        DOWNLOAD THIS SLIDE
                      </NeoButton>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <NeoButton 
                        title="Download full slideshow as MP4 video"
                        aria-label="Download as video"
                        variant="outline" 
                        className="py-3 sm:py-4 text-[9px] sm:text-xs tracking-widest border-[var(--glass-border)] font-black uppercase text-[var(--text-main)]/80"
                        onClick={() => addDownload(result, 'hd')}
                      >
                        DOWNLOAD AS VIDEO
                      </NeoButton>
                      <NeoButton 
                        title="Download TikTok video audio as MP3"
                        aria-label="Download MP3"
                        variant="ghost" 
                        className="py-3 sm:py-4 text-[9px] sm:text-xs tracking-widest glass font-black uppercase text-[var(--text-main)]/80"
                        onClick={() => addDownload(result, 'mp3')}
                      >
                        DOWNLOAD MP3
                      </NeoButton>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="group relative">
                      <div className="absolute -inset-0.5 neo-gradient rounded-[20px] blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
                      <NeoButton 
                        title="Download TikTok video in high definition"
                        aria-label="Download HD video"
                        className="w-full bg-[var(--bg-color)] !shadow-none py-3 sm:py-4 border-none text-[11px] sm:text-sm tracking-widest font-black"
                        onClick={() => addDownload(result, 'hd')}
                      >
                        DOWNLOAD HD VIDEO
                      </NeoButton>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <NeoButton 
                        title="Download TikTok video without watermark"
                        aria-label="Download without watermark"
                        variant="outline" 
                        className="py-3 sm:py-4 text-[9px] sm:text-xs tracking-widest border-[var(--glass-border)] font-black uppercase text-[var(--text-main)]/80"
                        onClick={() => addDownload(result, 'nowm')}
                      >
                        NO WATERMARK
                      </NeoButton>
                      <NeoButton 
                        title="Download TikTok video audio"
                        aria-label="Download MP3"
                        variant="ghost" 
                        className="py-3 sm:py-4 text-[9px] sm:text-xs tracking-widest glass font-black uppercase text-[var(--text-main)]/80"
                        onClick={() => addDownload(result, 'mp3')}
                      >
                        DOWNLOAD MP3
                      </NeoButton>
                    </div>
                  </>
                )}
              </div>
            </GlassCard>
            
            <div className="mt-4 flex items-center justify-center gap-2 opacity-20">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase">Premium Protocol V4</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProcessingModal = ({ isOpen }: { isOpen: boolean }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xs glass border-white/10 rounded-[40px] p-10 shadow-2xl text-center space-y-8 overflow-hidden will-change-[transform,opacity]"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-[32px] neo-gradient mx-auto flex items-center justify-center shadow-[0_0_50px_-10px_var(--neon-purple)] animate-pulse">
              <RefreshCw className="w-12 h-12 text-white animate-spin" />
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border-2 border-dashed border-neon-blue/20 rounded-full"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-white">Analyzing Engine</h3>
            <p className="text-[10px] text-neon-blue font-black tracking-[0.4em] uppercase opacity-70">Fetching Deep Data</p>
          </div>
          <div className="flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-white"
              />
            ))}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- App Root ---

type AppSettings = {
  darkMode: boolean;
  autoPaste: boolean;
  palette: { name: string, primary: string, secondary: string };
};

const PALETTES = [
  { name: 'Default', primary: '#9d00ff', secondary: '#00d4ff' },
  { name: 'Cyber', primary: '#ff00ea', secondary: '#ffea00' },
  { name: 'Forest', primary: '#00ff88', secondary: '#00bcff' },
  { name: 'Energy', primary: '#ff4d00', secondary: '#ffc400' }
];

const LanguageSelector = () => {
  const { lang } = useParams<{ lang?: string }>();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = (lang && SUPPORTED_LANGS.includes(lang as any) ? lang : 'en') as LangCode;

  return (
    <div className="relative">
      <NeoButton 
        variant="ghost" 
        className="!p-2.5 !rounded-xl glass border-white/5 flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="w-4 h-4 text-neon-blue" />
        <span className="text-[10px] font-black uppercase tracking-widest">{currentLang}</span>
      </NeoButton>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 glass border-white/10 rounded-2xl p-2 z-50 grid grid-cols-3 gap-1 shadow-2xl h-48 overflow-y-auto"
            >
              {SUPPORTED_LANGS.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    navigate(l === 'en' ? '/' : `/${l}`);
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-lg text-[10px] font-black uppercase transition-colors ${
                    currentLang === l ? 'neo-gradient text-white' : 'hover:bg-white/5 text-[var(--text-dim)]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const BlogSection = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
  const articles = [
    {
      id: 1,
      title: "Best TikTok Video Downloader in 2026",
      desc: "Discover why SSSTikPro remains the top choice for millions of users worldwide in 2026.",
      content: "As we move into 2026, TikTok continues to dominate the social media landscape. With its ever-evolving algorithm and content styles, users are constantly looking for reliable ways to save their favorite moments. SSSTikPro has stayed ahead of the curve by implementing next-gen processing engines that handle 4K content with ease. Our platform doesn't just download; it optimizes the file for your specific device, ensuring the highest fidelity possible without any intrusive watermarks."
    },
    {
      id: 2,
      title: "How to Download TikTok Videos Without Watermark",
      desc: "A step-by-step guide to getting clean, professional-looking videos using our premium tool.",
      content: "Removing watermarks from TikTok videos is essential for content creators who wish to repurpose their work on other platforms like Instagram Reels or YouTube Shorts. To do this with SSSTikPro, simply copy the video link from TikTok, paste it into our futuristic input field, and let our engine strip away the branding. In seconds, you'll have a clean MP4 file ready for your next project."
    },
    {
      id: 3,
      title: "Fastest TikTok MP4 Downloader Online",
      desc: "Speed is our priority. Learn how our cloud infrastructure delivers instant results.",
      content: "Our servers are distributed globally, ensuring that no matter where you are, your download starts instantly. We use advanced caching and edge computing to minimize latency. When compared to traditional tools, SSSTikPro consistently provides results 3x faster, making it the preferred choice for power users who save dozens of videos daily."
    },
    {
      id: 4,
      title: "Save TikTok Videos in HD Quality",
      desc: "Don't settle for blurry rips. Get the original high-definition source every time.",
      content: "Many downloaders compress video files to save bandwidth, resulting in pixelated content. SSSTikPro accesses the highest quality streams directly from TikTok's CDN. Whether it's 1080p or the latest HD formats, we ensure your offline collection looks just as good as the original feed."
    },
    {
      id: 5,
      title: "TikTok Downloader for Android & iPhone",
      desc: "Cross-platform compatibility at its best. No apps required, just your browser.",
      content: "SSSTikPro is a Progressive Web App (PWA) compatible site. On Android, it works seamlessly with Chrome, while on iOS, Safari provides a smooth experience. You don't need to install bulky apps that track your data; just bookmark our site and use it as a native tool whenever inspiration strikes."
    },
    {
      id: 6,
      title: "Why SSSTikPro Is Safe & Secure",
      desc: "Privacy matters. We explain our zero-data retention policy and security measures.",
      content: "Security is built into our DNA. We use SSL encryption for all connections and we never store your downloaded files or personal information. Unlike other platforms that require social logins, SSSTikPro is completely anonymous. Your digital footprint remains private while you enjoy premium features."
    },
    {
      id: 7,
      title: "Unlimited TikTok Downloads Without Login",
      desc: "No accounts, no subscriptions, no limits. Pure freedom for every user.",
      content: "We believe that the internet should be free and accessible. That's why SSSTikPro will never place a 'paywall' or 'login wall' between you and your downloads. From viral dances to educational clips, you can save as many videos as you want without ever creating an account."
    },
    {
      id: 8,
      title: "How Creators Save Viral TikTok Videos",
      desc: "Professional tips on archiving content for research, reaction videos, and inspiration.",
      content: "Top-tier content creators use SSSTikPro to build 'swipe files' of trending content. By saving videos without watermarks, they can analyze editing techniques, transitions, and audio trends in high detail. Archiving viral moments allows for better trend prediction and high-quality reaction content that resonates with audiences."
    }
  ];

  return (
    <div className="py-20 px-6 max-w-6xl mx-auto space-y-24">
      {/* Hero */}
      <section className="text-center space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black neo-text-gradient leading-tight"
        >
          Insights & Guides
        </motion.h1>
        <p className="text-[var(--text-dim)] max-w-2xl mx-auto uppercase tracking-[0.3em] font-black text-xs">
          The SSSTikPro Blog – Master the Art of TikTok Archiving
        </p>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article, idx) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-[32px] p-8 border-white/5 flex flex-col h-full hover:border-neon-blue/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 neo-gradient opacity-0 group-hover:opacity-10 blur-3xl transition-opacity" />
            <h3 className="text-lg font-bold mb-4 line-clamp-2 leading-tight">{article.title}</h3>
            <p className="text-sm text-[var(--text-dim)] mb-8 flex-grow leading-relaxed italic">{article.desc}</p>
            <a 
              href={`#article-${article.id}`} 
              className="text-[10px] font-black uppercase tracking-widest text-neon-blue flex items-center gap-2 group-hover:translate-x-2 transition-transform"
            >
              Read More <ChevronRight className="w-3 h-3" />
            </a>
          </motion.div>
        ))}
      </div>

      {/* Detailed Articles */}
      <div className="space-y-32 py-20 border-t border-white/5">
        {articles.map((article) => (
          <section id={`article-${article.id}`} key={article.id} className="max-w-3xl mx-auto space-y-8 scroll-mt-32">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neon-purple">Article 0{article.id}</span>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">{article.title}</h2>
            </div>
            <div className="glass rounded-[40px] p-10 border-white/5 text-lg leading-relaxed text-[var(--text-dim)] whitespace-pre-wrap">
              {article.content}
            </div>
            <NeoButton 
              variant="ghost" 
              className="!rounded-2xl"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              UPWARD TRANSMISSION
            </NeoButton>
          </section>
        ))}
      </div>

      <div className="text-center py-10">
        <NeoButton 
          variant="primary" 
          className="px-10 py-5 text-sm font-bold tracking-widest rounded-3xl"
          onClick={() => onNavigate('home')}
        >
          RETURN TO INTERFACE
        </NeoButton>
      </div>
    </div>
  );
};

const MainApp = () => {
  const { lang } = useParams<{ lang?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const currentLang = (lang && SUPPORTED_LANGS.includes(lang as any) ? lang : 'en') as LangCode;
  const seo = SEO_DATA[currentLang];

  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync route with activeScreen
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/blog')) {
      setActiveScreen('blog');
    } else if (path === '/about') {
      setActiveScreen('about');
    } else if (path === '/privacy') {
      setActiveScreen('privacy');
    } else if (path === '/terms') {
      setActiveScreen('terms');
    } else if (path === '/contact') {
      setActiveScreen('contact');
    } else if (path === '/' || SUPPORTED_LANGS.includes(path.slice(1) as any)) {
      setActiveScreen('home');
    }
  }, [location.pathname]);

  const handleNavigate = useCallback((s: Screen) => {
    if (s === 'home') {
      navigate(currentLang === 'en' ? '/' : `/${currentLang}`);
      setActiveScreen('home');
    } else {
      navigate(`/${s}`);
      setActiveScreen(s);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate, currentLang]);

  const [tasks, setTasks] = useState<DownloadTask[]>([]);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: true,
    autoPaste: true,
    palette: PALETTES[0]
  });
  const [showFeedback, setShowFeedback] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Initialize from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTasks(parsed.downloads?.filter((t: any) => t.status === 'completed') || []);
        if (parsed.settings) {
          setSettings(prev => ({ ...prev, ...parsed.settings }));
        }
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    const state = { downloads: tasks, settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [tasks, settings]);

  // Handle Theme
  useEffect(() => {
    if (!settings.darkMode) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [settings.darkMode]);

  // Handle Palette
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--neon-purple', settings.palette.primary);
    root.style.setProperty('--neon-blue', settings.palette.secondary);
  }, [settings.palette]);

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
        (progress) => {
          setTasks(current => 
            current.map(t => t.id === taskId ? { ...t, progress } : t)
          );
        },
        (status) => {
          setTasks(current => 
            current.map(t => t.id === taskId ? { ...t, status } : t)
          );
          if (status === 'completed') {
            addToast(`${type.toUpperCase()} Finished!`);
          }
        }
      );
    } catch (e) {
      addToast(`Failed to download ${type.toUpperCase()}`, 'error');
    }
  }, [addToast]);

  const canonicalUrl = currentLang === 'en' ? 'https://ssstikpro.site' : `https://ssstikpro.site/${currentLang}`;
  const currentUrl = activeScreen === 'home' ? canonicalUrl : `https://ssstikpro.site/${activeScreen}`;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--bg-color)] font-sans selection:bg-neon-purple/30 text-[var(--text-main)] transition-colors duration-500">
      <Helmet>
        <html lang={currentLang} />
        <title>{
          activeScreen === 'blog' ? `Blog – ${APP_NAME} Insights` :
          activeScreen === 'about' ? `About – ${APP_NAME}` :
          activeScreen === 'privacy' ? `Privacy Policy – ${APP_NAME}` :
          activeScreen === 'terms' ? `Terms of Service – ${APP_NAME}` :
          activeScreen === 'contact' ? `Contact Us – ${APP_NAME}` :
          seo.title
        }</title>
        <meta name="description" content={
          activeScreen === 'blog' ? "Deep dives, guides, and professional tips on downloading TikTok videos without watermark using SSSTikPro." :
          activeScreen === 'about' ? `Learn about ${APP_NAME}, the world's most advanced TikTok downloader.` :
          seo.description
        } />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href={currentUrl} />
        <meta name="robots" content="index, follow" />
        
        {/* Global Favicons & Icons */}
        <link rel="icon" type="image/x-icon" href="https://ssstikpro.site/favicon.ico" />
        <link rel="shortcut icon" href="https://ssstikpro.site/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://ssstikpro.site/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://ssstikpro.site/favicon-16x16.png" />
        <link rel="icon" type="image/svg+xml" href="https://ssstikpro.site/icon.svg" />
        <link rel="icon" type="image/png" sizes="192x192" href="https://ssstikpro.site/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="https://ssstikpro.site/android-chrome-512x512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://ssstikpro.site/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0b061f" />
        <meta name="apple-mobile-web-app-title" content="SSSTikPro" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Hreflang Tags */}
        <link rel="alternate" hrefLang="x-default" href="https://ssstikpro.site" />
        {SUPPORTED_LANGS.map(l => (
          <link key={l} rel="alternate" hrefLang={l} href={`https://ssstikpro.site${l === 'en' ? '' : `/${l}`}`} />
        ))}

        {/* Open Graph Tags */}
        <meta property="og:title" content={activeScreen === 'home' ? seo.title : `${activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1)} – ${APP_NAME}`} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content={APP_NAME} />
        <meta property="og:locale" content={currentLang === 'en' ? 'en_US' : currentLang} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ssstikpro.site/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="SSSTikPro TikTok Video Downloader" />
        
        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ssstikpro" />
        <meta name="twitter:creator" content="@ssstikpro" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content="https://ssstikpro.site/og-image.png" />

        {/* Structured Data: WebSite & Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SSSTikPro",
            "url": "https://ssstikpro.site",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://ssstikpro.site/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "SSSTikPro",
            "url": "https://ssstikpro.site",
            "logo": "https://ssstikpro.site/android-chrome-512x512.png",
            "sameAs": [
              "https://twitter.com/ssstikpro",
              "https://facebook.com/ssstikpro"
            ]
          })}
        </script>

        {/* Structured Data: SoftwareApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "SSSTikPro TikTok Downloader",
            "operatingSystem": "Any",
            "applicationCategory": "UtilitiesApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "85420"
            }
          })}
        </script>

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://ssstikpro.site"
              },
              activeScreen !== 'home' ? {
                "@type": "ListItem",
                "position": 2,
                "name": activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1),
                "item": `https://ssstikpro.site/${activeScreen}`
              } : null
            ].filter(Boolean)
          })}
        </script>

        {/* Structured Data FAQ */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": seo.faq.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.a
              }
            }))
          })}
        </script>
        
        {activeScreen === 'blog' && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "SSSTikPro Insights",
              "url": "https://ssstikpro.site/blog",
              "description": "Guides and technical insights on TikTok video downloading.",
              "publisher": {
                "@type": "Organization",
                "name": APP_NAME,
                "logo": "https://ssstikpro.site/android-chrome-512x512.png"
              },
              "blogPost": [
                {
                  "@type": "BlogPosting",
                  "headline": "Best TikTok Video Downloader in 2026",
                  "url": "https://ssstikpro.site/blog#article-1"
                },
                {
                  "@type": "BlogPosting",
                  "headline": "How to Download TikTok Videos Without Watermark",
                  "url": "https://ssstikpro.site/blog#article-2"
                }
              ]
            })}
          </script>
        )}
      </Helmet>

      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [-100, 50, -100],
            y: [-100, 100, -100]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ background: 'var(--bg-glow-purple)' }}
          className="absolute -top-[20%] -left-[10%] w-[100vw] h-[100vw] rounded-full blur-[140px] will-change-[transform,filter]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
            x: [100, -100, 100],
            y: [200, -100, 200]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ background: 'var(--bg-glow-blue)' }}
          className="absolute top-[30%] -right-[20%] w-[120vw] h-[120vw] rounded-full blur-[160px] will-change-[transform,filter]" 
        />
      </div>

      <AnimatePresence mode="wait">
          <div className="relative z-10 w-full min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 p-4 pt-8 glass border-b-0 backdrop-blur-3xl bg-transparent">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div 
                  className="flex items-center gap-2 sm:gap-4 min-w-0 cursor-pointer"
                  onClick={() => handleNavigate('home')}
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl neo-gradient flex items-center justify-center p-0.5 shadow-2xl shadow-neon-purple/20 flex-shrink-0">
                    <div className="w-full h-full bg-[var(--bg-color)] rounded-2xl flex items-center justify-center">
                      <Download className="w-5 h-5 sm:w-6 sm:h-6 text-neon-blue" />
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h1 className="text-lg sm:text-2xl font-bold tracking-tight italic leading-tight truncate">{APP_NAME}</h1>
                    <p className="text-[6px] sm:text-[8px] font-black tracking-[0.2em] sm:tracking-[0.4em] uppercase text-[var(--text-dim)] truncate">Next-Gen Downloader</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                  <LanguageSelector />
                  <NeoButton 
                    variant="ghost" 
                    className="p-3 aspect-square !rounded-2xl glass"
                    onClick={() => setActiveScreen('settings')}
                  >
                    <SettingsIcon className={`w-5 h-5 ${activeScreen === 'settings' ? 'text-neon-purple' : 'text-neon-blue'}`} />
                  </NeoButton>
                </div>
              </div>
            </header>

            {/* Content Container */}
            <main className="flex-1">
              <AnimatePresence mode="wait">
                {activeScreen === 'home' ? (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HomeScreen 
                      addDownload={addDownloadTask} 
                      addToast={addToast} 
                      settings={settings} 
                      isAnalyzing={isAnalyzing}
                      setIsAnalyzing={setIsAnalyzing}
                    />
                    <ProcessingModal isOpen={isAnalyzing} />
                    
                    <div className="mt-20">
                      <FeaturesSection features={seo.features} />
                      <HowItWorks content={seo.howItWorks} />
                      <WhyChoose content={seo.whyChoose} />
                      <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border-neon-blue/20">
                          <ShieldCheck className="w-4 h-4 text-neon-blue" />
                          <span className="text-[10px] font-black tracking-[0.2em] uppercase">Trusted by millions</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                           <div className="flex flex-col items-center gap-2">
                             <div className="text-2xl font-black italic">TRUSTPILOT</div>
                             <div className="flex gap-1"><Star className="w-3 h-3 fill-neon-blue text-neon-blue" /><Star className="w-3 h-3 fill-neon-blue text-neon-blue" /><Star className="w-3 h-3 fill-neon-blue text-neon-blue" /><Star className="w-3 h-3 fill-neon-blue text-neon-blue" /><Star className="w-3 h-3 fill-neon-blue text-neon-blue" /></div>
                           </div>
                           <div className="flex flex-col items-center gap-2">
                             <div className="text-2xl font-black italic">G2 CROWD</div>
                             <div className="text-[10px] font-bold tracking-widest uppercase">High Performer</div>
                           </div>
                           <div className="flex flex-col items-center gap-2">
                             <div className="text-2xl font-black italic">CAPTERRA</div>
                             <div className="text-[10px] font-bold tracking-widest uppercase">Verified Service</div>
                           </div>
                           <div className="flex flex-col items-center gap-2">
                             <div className="text-2xl font-black italic">APP SUMO</div>
                             <div className="text-[10px] font-bold tracking-widest uppercase">5 Taco Rated</div>
                           </div>
                        </div>
                      </section>
                      <FAQ faqs={seo.faq} />
                      <SEOContent content={seo.seoContent} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="internal-page"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeScreen === 'about' && <AboutPage onBack={() => handleNavigate('home')} />}
                    {activeScreen === 'privacy' && <PrivacyPage onBack={() => handleNavigate('home')} />}
                    {activeScreen === 'terms' && <TermsPage onBack={() => handleNavigate('home')} />}
                    {activeScreen === 'contact' && <ContactPage onBack={() => handleNavigate('home')} />}
                    {activeScreen === 'blog' && <BlogSection onNavigate={handleNavigate} />}
                    {activeScreen === 'settings' && <SettingsScreen settings={settings} setSettings={setSettings} addToast={addToast} onBack={() => handleNavigate('home')} />}
                  </motion.div>
                )}
              </AnimatePresence>
              <Footer onNavigate={handleNavigate} />
            </main>

            {/* Feedback Modal */}
            <AnimatePresence>
              {showFeedback && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFeedback(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-sm glass border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4">
                      <button onClick={() => setShowFeedback(false)} className="w-10 h-10 rounded-full flex items-center justify-center glass border-white/5 text-white/20 hover:text-white transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 rounded-3xl neo-gradient mx-auto flex items-center justify-center shadow-lg">
                        <Heart className="w-10 h-10 text-white fill-white/20" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold tracking-tight h-10 flex items-center justify-center">Love {APP_NAME}?</h3>
                        <p className="text-white/40 text-sm leading-relaxed">Your feedback drives the evolution of our next-gen engine.</p>
                      </div>
                      <div className="space-y-3 pt-4">
                        <textarea 
                          placeholder="What can we improve?..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-neon-purple/50 min-h-[120px] resize-none"
                        />
                        <NeoButton 
                          className="w-full py-4 text-sm font-bold tracking-widest"
                          onClick={() => {
                            setShowFeedback(false);
                            addToast("Feedback sent! Thank you.");
                          }}
                        >
                          TRANSMIT FEEDBACK
                        </NeoButton>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Toast System */}
            <AnimatePresence>
              {toast && <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
          </div>
      </AnimatePresence>
    </div>
  );
};

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
          <Route path="/:lang" element={<MainApp />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
