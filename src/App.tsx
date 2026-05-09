import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { Screen, TikTokVideo, DownloadTask, DownloadStatus } from './types.ts';
import { TikTokApiService } from './services/apiService.ts';
import { TikTokDownloaderService } from './services/downloaderService.ts';
import { Clipboard } from '@capacitor/clipboard';
import { Capacitor } from '@capacitor/core';

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

const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <div className="glass p-8 rounded-3xl border border-white/5 hover:border-neon-purple/30 group transition-all duration-500 hover:-translate-y-2">
    <div className="w-12 h-12 rounded-2xl neo-gradient flex items-center justify-center p-0.5 mb-6 shadow-lg shadow-neon-purple/10">
      <div className="w-full h-full bg-[var(--bg-color)] rounded-2xl flex items-center justify-center text-neon-blue">
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
    <p className="text-sm text-[var(--text-dim)] leading-relaxed">{description}</p>
  </div>
);

const FeaturesSection = () => (
  <section className="py-20 px-6 max-w-5xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12 neo-text-gradient">Premium Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <FeatureCard icon={ShieldCheck} title="No Watermark Downloads" description="Get clean videos without any distracting TikTok watermarks or logos." />
      <FeatureCard icon={Zap} title="HD Video Quality" description="Download in original high definition resolution for the best viewing experience." />
      <FeatureCard icon={RefreshCw} title="Fast Processing" description="Our high-speed engine processes your links in seconds, not minutes." />
      <FeatureCard icon={Star} title="Unlimited Downloads" description="No daily limits. Save as many videos as your heart desires." />
      <FeatureCard icon={Home} title="Mobile Friendly" description="Works perfectly on all devices. Use it on iOS, Android, or Desktop." />
      <FeatureCard icon={CheckCircle2} title="Safe & Secure" description="No logins required. Your privacy and data are always protected." />
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="py-20 px-6 bg-white/[0.02]">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-16 neo-text-gradient">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-full glass border border-neon-purple/30 flex items-center justify-center mx-auto text-neon-purple text-2xl font-bold">1</div>
          <h3 className="text-xl font-bold">Copy TikTok Link</h3>
          <p className="text-sm text-[var(--text-dim)]">Find the video you love and click the share button to copy the link.</p>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-full glass border border-neon-blue/30 flex items-center justify-center mx-auto text-neon-blue text-2xl font-bold">2</div>
          <h3 className="text-xl font-bold">Paste URL</h3>
          <p className="text-sm text-[var(--text-dim)]">Open SSSTikPro and paste the link into the downloader above.</p>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-full glass border border-neon-pink/30 flex items-center justify-center mx-auto text-neon-pink text-2xl font-bold">3</div>
          <h3 className="text-xl font-bold">Download Instantly</h3>
          <p className="text-sm text-[var(--text-dim)]">Press download and save your HD video without watermark instantly.</p>
        </div>
      </div>
    </div>
  </section>
);

const WhyChoose = () => (
  <section className="py-20 px-6 max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12 neo-text-gradient">Why Choose SSSTikPro</h2>
    <div className="glass rounded-[40px] p-10 border-white/5 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 neo-gradient opacity-5 blur-[80px] -mr-10 -mt-10" />
      <div className="flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-neon-blue" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-1">Faster than competitors</h4>
            <p className="text-sm text-[var(--text-dim)]">Our optimized engine delivers results up to 3x faster than traditional tools.</p>
          </div>
      </div>
      <div className="flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 flex items-center justify-center shrink-0">
            <Palette className="w-6 h-6 text-neon-purple" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-1">Clean UI</h4>
            <p className="text-sm text-[var(--text-dim)]">No annoying popups or confusing ads. Just a pure, premium design.</p>
          </div>
      </div>
      <div className="flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-neon-pink/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-neon-pink" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-1">No login required</h4>
            <p className="text-sm text-[var(--text-dim)]">We value your time. Download videos instantly without creating an account.</p>
          </div>
      </div>
      <div className="flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 text-neon-blue" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-1">Free forever</h4>
            <p className="text-sm text-[var(--text-dim)]">Our premium service is available to everyone at zero cost, forever.</p>
          </div>
      </div>
    </div>
  </section>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = [
    { q: "How to download TikTok videos?", a: "Simply copy the TikTok video link, paste it into our input field at the top of the page, and click 'Download'." },
    { q: "Is SSSTikPro free?", a: "Yes, our service is 100% free to use. We don't charge any fees for downloading TikTok videos." },
    { q: "Is it safe?", a: "Absolutely. We don't require any login information and we don't store your personal data." },
    { q: "Does it work on mobile?", a: "Yes, our website is fully responsive and works perfectly on all mobile devices and tablets." },
    { q: "Can I download without watermark?", a: "Yes, SSSTikPro specializes in high-quality TikTok downloads without any watermarks." }
  ];

  return (
    <section className="py-20 px-6 max-w-3xl mx-auto">
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
};

const SEOContent = () => (
  <section className="py-20 px-6 max-w-4xl mx-auto opacity-70">
    <div className="space-y-12">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-main)]">TikTok Video Downloader</h2>
        <p className="text-sm leading-relaxed">SSSTikPro is your ultimate solution for downloading TikTok videos with ease. Our platform is designed to provide a seamless experience, allowing you to save your favorite TikTok content directly to your device without any hassle.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[var(--text-main)]">Download TikTok Videos Without Watermark</h3>
        <p className="text-sm leading-relaxed">One of the most sought-after features of our TikTok downloader is the ability to remove watermarks. Whether you're a content creator looking to repurpose your videos or just a fan who wants a clean version of a clip, SSSTikPro delivers pristine video quality every time.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[var(--text-main)]">HD TikTok Downloader</h3>
        <p className="text-sm leading-relaxed">We understand that quality matters. That's why our downloader supports High Definition (HD) video saving. When you use SSSTikPro, you aren't just getting another copy of a video; you're getting the best possible version available on TikTok's servers.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[var(--text-main)]">Fast TikTok MP4 Downloads</h3>
        <p className="text-sm leading-relaxed">Time is valuable. Our optimized server engine ensures that your MP4 files are ready in the blink of an eye. With state-of-the-art processing and a clean interface, SSSTikPro stands out as the fastest TikTok downloader in the futuristic web arena.</p>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-16 px-6 border-t border-white/5 bg-black/20">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl neo-gradient flex items-center justify-center p-0.5">
          <div className="w-full h-full bg-[#0a0a0b] rounded-2xl flex items-center justify-center">
            <Download className="w-5 h-5 text-neon-blue" />
          </div>
        </div>
        <span className="text-xl font-bold italic tracking-tighter">SSSTikPro</span>
      </div>
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[11px] font-black tracking-[0.2em] uppercase text-[var(--text-dim)]">
        <a href="#" className="hover:text-neon-blue transition-colors">About</a>
        <a href="#" className="hover:text-neon-blue transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-neon-blue transition-colors">Terms</a>
        <a href="#" className="hover:text-neon-blue transition-colors">Contact</a>
      </div>
      <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-[0.3em] font-black">
        &copy; 2026 SSSTikPro. <span className="hidden sm:inline">All rights reserved.</span>
      </p>
    </div>
  </footer>
);

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

  const handlePaste = async () => {
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
  };

  const handleAnalyze = async (manualUrl?: string) => {
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
      addToast("Video analyzed successfully");
    } catch (err: any) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

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
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Insert a TikTok link here..."
              className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl py-6 pl-14 pr-24 text-sm focus:outline-none focus:border-neon-purple/50 focus:ring-4 focus:ring-neon-purple/10 transition-all placeholder:text-[var(--text-dim)]"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-dim)]" />
            <button 
              onClick={handlePaste}
              className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2.5 glass rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-[var(--glass-bg)] transition-colors border-[var(--glass-border)]"
            >
              Paste
            </button>
          </div>

          <NeoButton 
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
            className="mx-4"
          >
            <GlassCard className="!p-5 border-white/10 bg-white/[0.03]">
              <div className="flex gap-5">
                <div className="relative w-32 aspect-[9/16] rounded-2xl overflow-hidden bg-black/40 group">
                  <img src={result.thumbnail} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
                    <div className="px-1.5 py-0.5 glass rounded-[4px] text-[8px] font-black tracking-tighter bg-neon-blue text-black border-none">ULTRA HD</div>
                  </div>
                </div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={result.author.avatar} className="w-10 h-10 rounded-full border-2 border-white/10" alt="avatar" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-blue rounded-full flex items-center justify-center p-0.5 border-2 border-[var(--bg-color)]">
                        <CheckCircle2 className="w-full h-full text-black" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate tracking-tight text-[var(--text-main)]">{result.author.id}</p>
                      <p className="text-[10px] text-[var(--text-dim)] truncate font-bold uppercase tracking-wider">Verified Identity</p>
                    </div>
                  </div>
                  
                  <p className="text-[11px] text-[var(--text-main)]/70 line-clamp-4 leading-relaxed font-medium">
                    {result.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <div className="px-2 py-1 glass rounded-lg text-[9px] font-bold text-[var(--text-dim)] flex items-center gap-1">
                      <Heart className="w-3 h-3 text-neon-pink" /> {result.stats.likes}
                    </div>
                    <div className="px-2 py-1 glass rounded-lg text-[9px] font-bold text-[var(--text-dim)] flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-neon-blue" /> {result.stats.shares}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3">
                <div className="group relative">
                  <div className="absolute -inset-0.5 neo-gradient rounded-[20px] blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
                  <NeoButton 
                    className="w-full bg-[var(--bg-color)] !shadow-none py-4 border-none text-sm tracking-widest font-black"
                    onClick={() => addDownload(result, 'hd')}
                  >
                    DOWNLOAD HD VIDEO
                  </NeoButton>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NeoButton 
                    variant="outline" 
                    className="py-4 text-[10px] sm:text-xs tracking-widest border-[var(--glass-border)] font-black uppercase text-[var(--text-main)]/80"
                    onClick={() => addDownload(result, 'nowm')}
                  >
                    NO WATERMARK
                  </NeoButton>
                  <NeoButton 
                    variant="ghost" 
                    className="py-4 text-[10px] sm:text-xs tracking-widest glass font-black uppercase text-[var(--text-main)]/80"
                    onClick={() => addDownload(result, 'mp3')}
                  >
                    DOWNLOAD MP3
                  </NeoButton>
                </div>
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
          className="relative w-full max-w-xs glass border-white/10 rounded-[40px] p-10 shadow-2xl text-center space-y-8 overflow-hidden"
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

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tasks, setTasks] = useState<DownloadTask[]>([]);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: true,
    autoPaste: true,
    palette: PALETTES[0]
  });
  const [showFeedback, setShowFeedback] = useState(false);

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

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const addDownloadTask = async (video: TikTokVideo, type: 'hd' | 'nowm' | 'mp3') => {
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
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--bg-color)] font-sans selection:bg-neon-purple/30 text-[var(--text-main)] transition-colors duration-500">
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
          className="absolute -top-[20%] -left-[10%] w-[100vw] h-[100vw] rounded-full blur-[140px]" 
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
          className="absolute top-[30%] -right-[20%] w-[120vw] h-[120vw] rounded-full blur-[160px]" 
        />
      </div>

      <AnimatePresence mode="wait">
          <div className="relative z-10 w-full min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 p-4 pt-8 glass border-b-0 backdrop-blur-3xl bg-transparent">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl neo-gradient flex items-center justify-center p-0.5 shadow-2xl shadow-neon-purple/20">
                    <div className="w-full h-full bg-[var(--bg-color)] rounded-2xl flex items-center justify-center">
                      <Download className="w-6 h-6 text-neon-blue" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight italic">{APP_NAME}</h1>
                    <p className="text-[8px] font-black tracking-[0.4em] uppercase text-[var(--text-dim)]">Next-Gen Downloader</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <NeoButton 
                    variant="ghost" 
                    className="p-3 aspect-square !rounded-2xl glass"
                    onClick={() => setShowFeedback(true)}
                  >
                    <Star className="w-5 h-5 text-neon-blue" />
                  </NeoButton>
                </div>
              </div>
            </header>

            {/* Content Container */}
            <main className="flex-1">
              <HomeScreen 
                addDownload={addDownloadTask} 
                addToast={addToast} 
                settings={settings} 
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
              />
              <ProcessingModal isOpen={isAnalyzing} />
              
              <div className="mt-20">
                <FeaturesSection />
                <HowItWorks />
                <WhyChoose />
                <FAQ />
                <SEOContent />
                <Footer />
              </div>
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
}
