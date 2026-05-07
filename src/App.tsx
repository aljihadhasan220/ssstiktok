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
const APP_NAME = "SSSTikTok";
const STORAGE_KEY = 'ssstiktok_state_v1';

// --- Components ---

const Toast = ({ message, type = 'success', onClose }: { message: string, type?: 'success' | 'error', onClose: () => void, key?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5 }}
    className={`fixed bottom-28 left-4 right-4 z-[100] p-4 rounded-2xl shadow-2xl flex items-center gap-3 glass border-white/10 ${
      type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'
    }`}
  >
    {type === 'success' ? (
      <CheckCircle2 className="w-5 h-5 text-green-400" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-400" />
    )}
    <p className="text-sm font-medium text-white/90">{message}</p>
    <button onClick={onClose} className="ml-auto text-white/40"><Trash2 className="w-4 h-4" /></button>
  </motion.div>
);

const NeoButton = ({ children, onClick, className = "", variant = "primary", disabled = false }: any) => {
  const variants: any = {
    primary: "neo-gradient text-white shadow-[0_0_15px_-3px_#9d00ff]",
    outline: "glass border-white/20 text-white hover:bg-white/5",
    ghost: "text-white/60 hover:text-white",
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

const Navbar = ({ active, setActive }: { active: Screen, setActive: (s: Screen) => void }) => {
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'downloads', icon: Download, label: 'History' },
    { id: 'favorites', icon: Heart, label: 'Saved' },
    { id: 'settings', icon: SettingsIcon, label: 'Setup' }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md">
      <div className="glass rounded-[32px] p-2 flex items-center justify-around shadow-2xl border-white/5 backdrop-blur-3xl">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id as Screen)}
              className="relative flex flex-col items-center justify-center px-4 py-2 group whitespace-nowrap"
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-[3px] neo-gradient rounded-2xl opacity-10 blur-md"
                  />
                )}
              </AnimatePresence>
              <item.icon 
                className={`w-6 h-6 z-10 transition-all duration-300 ${isActive ? 'text-neon-blue scale-110' : 'text-white/30'}`} 
              />
              <span className={`text-[10px] font-bold z-10 mt-1 uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/30'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- Screens ---

const SplashScreen = ({ onFinish }: { onFinish: () => void, key?: string }) => (
  <motion.div 
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ delay: 2.2, duration: 0.8 }}
    onAnimationComplete={onFinish}
    className="fixed inset-0 z-[100] bg-[#05010d] flex flex-col items-center justify-center p-8 text-center"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      <div className="w-32 h-32 rounded-[36px] neo-gradient flex items-center justify-center shadow-[0_0_60px_-10px_#9d00ff]">
        <Download className="text-white w-16 h-16" />
      </div>
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="absolute -inset-6 neo-gradient rounded-[48px] blur-3xl -z-10"
      />
    </motion.div>
    <motion.h1 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-10 text-4xl font-bold neo-text-gradient tracking-tight"
    >
      {APP_NAME}
    </motion.h1>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ delay: 0.8 }}
      className="mt-4 flex items-center gap-2"
    >
      <div className="h-[1px] w-8 bg-white/40" />
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Premium Engine</span>
      <div className="h-[1px] w-8 bg-white/40" />
    </motion.div>
  </motion.div>
);

const HomeScreen = ({ addDownload, addToast }: { addDownload: (video: TikTokVideo, type: any) => void, addToast: (m: string, t?: any) => void }) => {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TikTokVideo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      let text = '';
      if (Capacitor.isNativePlatform()) {
        const { value } = await Clipboard.read();
        text = value;
      } else {
        text = await navigator.clipboard.readText();
      }
      
      if (text) {
        setUrl(text);
        addToast("URL Pasted from clipboard");
      } else {
        addToast("Clipboard is empty", "error");
      }
    } catch (e) {
      addToast("Clipboard access denied", 'error');
    }
  };

  const handleAnalyze = async (manualUrl?: string) => {
    const targetUrl = manualUrl || url;
    if (!targetUrl.trim()) {
      addToast("Please enter a URL first", 'error');
      return;
    }
    
    setIsProcessing(true);
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
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      {/* Hero */}
      <div className="relative pt-12 text-center space-y-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border-white/10 mb-4 animate-pulse">
            <ShieldCheck className="w-4 h-4 text-neon-blue" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Secure & Watermark Free</span>
          </div>
          <h2 className="text-[38px] sm:text-[42px] font-bold px-4 leading-[1.1] tracking-tight">
            TikTok Video <br />
            <span className="neo-text-gradient italic">Downloader</span>
          </h2>
          <p className="text-white/40 text-sm max-w-[280px] mx-auto leading-relaxed">
            Preserve your favorite moments in HD quality, instantly.
          </p>
        </motion.div>
      </div>

      {/* Input */}
      <GlassCard className="mx-4 border-white/5 shadow-2xl">
        <div className="space-y-4">
          <div className="relative group">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Insert a TikTok link here..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-14 pr-24 text-sm focus:outline-none focus:border-neon-purple/50 focus:ring-4 focus:ring-neon-purple/10 transition-all placeholder:text-white/20"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <button 
              onClick={handlePaste}
              className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2.5 glass rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-colors border-white/10"
            >
              Paste
            </button>
          </div>

          <NeoButton 
            className="w-full py-5 rounded-[22px] text-lg"
            onClick={() => handleAnalyze()}
            disabled={isProcessing}
          >
            {isProcessing ? (
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
        {isProcessing && (
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
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-blue rounded-full flex items-center justify-center p-0.5 border-2 border-[#05010d]">
                        <CheckCircle2 className="w-full h-full text-black" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate tracking-tight">{result.author.id}</p>
                      <p className="text-[10px] text-white/30 truncate font-bold uppercase tracking-wider">Verified Identity</p>
                    </div>
                  </div>
                  
                  <p className="text-[11px] text-white/70 line-clamp-4 leading-relaxed font-medium">
                    {result.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <div className="px-2 py-1 glass rounded-lg text-[9px] font-bold text-white/40 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-neon-pink" /> {result.stats.likes}
                    </div>
                    <div className="px-2 py-1 glass rounded-lg text-[9px] font-bold text-white/40 flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-neon-blue" /> {result.stats.shares}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3">
                <div className="group relative">
                  <div className="absolute -inset-0.5 neo-gradient rounded-[20px] blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
                  <NeoButton 
                    className="w-full bg-[#05010d] !shadow-none py-4 border-none text-sm tracking-widest font-black"
                    onClick={() => addDownload(result, 'hd')}
                  >
                    DOWNLOAD HD VIDEO
                  </NeoButton>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NeoButton 
                    variant="outline" 
                    className="py-4 text-[10px] sm:text-xs tracking-widest border-white/5 font-black uppercase text-white/80"
                    onClick={() => addDownload(result, 'nowm')}
                  >
                    NO WATERMARK
                  </NeoButton>
                  <NeoButton 
                    variant="ghost" 
                    className="py-4 text-[10px] sm:text-xs tracking-widest glass font-black uppercase text-white/80"
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

const DownloadsScreen = ({ tasks, removeTask }: { tasks: DownloadTask[], removeTask: (id: string) => void }) => (
  <div className="p-4 space-y-6 pb-32">
    <div className="flex items-center justify-between pt-8 px-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Downloads</h2>
        <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-medium mt-1">Processed Files</p>
      </div>
      <NeoButton variant="ghost" className="p-2 px-3 text-[10px] font-black tracking-widest uppercase opacity-40 hover:opacity-100" onClick={() => tasks.forEach(t => removeTask(t.id))}>
        Clear List
      </NeoButton>
    </div>
    
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="py-20 flex flex-col items-center opacity-20">
          <Download className="w-16 h-16 stroke-[1]" />
          <p className="mt-4 text-sm font-medium">No active or past downloads</p>
        </div>
      ) : (
        tasks.sort((a,b) => b.timestamp - a.timestamp).map((task) => (
          <GlassCard key={task.id} className="!p-4 border-white/5 group">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] flex-shrink-0 flex items-center justify-center border border-white/5 overflow-hidden">
                <img src={task.video.thumbnail} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold truncate uppercase tracking-wider">{task.video.id}_{task.type}.{task.type === 'mp3' ? 'mp3' : 'mp4'}</h3>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${task.status === 'completed' ? 'text-green-400' : 'text-neon-blue'}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-[10px] text-white/30 mt-1 uppercase font-bold tracking-tighter">
                  {task.video.fileSize || '12.4 MB'} • {new Date(task.timestamp).toLocaleDateString()}
                </p>
                <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    className="h-full neo-gradient" 
                  />
                </div>
              </div>
              <button 
                onClick={() => removeTask(task.id)}
                className="self-center p-2 text-white/20 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        ))
      )}
    </div>
  </div>
);

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [autoPaste, setAutoPaste] = useState(true);
  
  return (
    <div className="p-4 space-y-8 pb-32">
      <div className="pt-8 px-2">
        <h2 className="text-2xl font-bold tracking-tight">App Settings</h2>
        <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-medium mt-1">Configure {APP_NAME}</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black px-2">Visual Engine</h3>
          <GlassCard className="!p-0 overflow-hidden divide-y divide-white/5 border-white/5">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-neon-purple/20 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-neon-purple" />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight">Dark Mode</p>
                  <p className="text-[10px] text-white/30 uppercase font-medium">True OLED Black</p>
                </div>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-500 ${darkMode ? 'neo-gradient' : 'bg-white/10'}`}
              >
                <motion.div 
                  animate={{ x: darkMode ? 24 : 0 }}
                  className="w-4 h-4 rounded-full bg-white shadow-lg" 
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-neon-blue/20 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-neon-blue" />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight">Ui Palette</p>
                  <p className="text-[10px] text-white/30 uppercase font-medium">Futuristic Neon</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-neon-purple border-2 border-white/10" />
                <div className="w-6 h-6 rounded-full bg-neon-blue border-4 border-[#05010d] shadow-lg scale-110" />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black px-2">Automation</h3>
          <GlassCard className="!p-0 overflow-hidden border-white/5">
             <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center">
                  <ClipboardIcon className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight">Auto Paste</p>
                  <p className="text-[10px] text-white/30 uppercase font-medium">Link detection</p>
                </div>
              </div>
               <button 
                onClick={() => setAutoPaste(!autoPaste)}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-500 ${autoPaste ? 'neo-gradient' : 'bg-white/10'}`}
              >
                <motion.div 
                  animate={{ x: autoPaste ? 24 : 0 }}
                  className="w-4 h-4 rounded-full bg-white shadow-lg" 
                />
              </button>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black px-2">Info & Legal</h3>
          <GlassCard className="!p-0 overflow-hidden divide-y divide-white/5 border-white/5">
            <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-all">
                  <Share2 className="w-5 h-5 text-white/60" />
                </div>
                <p className="text-sm font-bold tracking-tight">Spread the word</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20" />
            </div>
            <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-all">
                  <Star className="w-5 h-5 text-white/60" />
                </div>
                <p className="text-sm font-bold tracking-tight">Give feedback</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20" />
            </div>
          </GlassCard>
        </div>

        <div className="text-center py-6 opacity-30">
          <div className="inline-flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <p className="text-[10px] font-black tracking-[0.3em] uppercase">SSSTikTok Core v4.1.0</p>
          </div>
          <p className="text-[8px] uppercase tracking-widest italic">Designed in Neo-Tokyo for the Global Future</p>
        </div>
      </div>
    </div>
  );
};

// --- App Root ---

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [tasks, setTasks] = useState<DownloadTask[]>([]);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // We only restore completed tasks to keep UI clean
        setTasks(parsed.downloads.filter((t: any) => t.status === 'completed'));
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    const state = { downloads: tasks };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [tasks]);

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
    setActiveScreen('downloads');

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
    <div className="min-h-screen relative overflow-hidden bg-[#05010d] font-sans selection:bg-neon-purple/30 text-white">
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
          className="absolute -top-[20%] -left-[10%] w-[100vw] h-[100vw] rounded-full bg-neon-purple/10 blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
            x: [100, -100, 100],
            y: [200, -100, 200]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] -right-[20%] w-[120vw] h-[120vw] rounded-full bg-neon-blue/10 blur-[160px]" 
        />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <SplashScreen key="splash" onFinish={() => setIsLoading(false)} />
        ) : (
          <div className="relative z-10 w-full max-w-lg mx-auto min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 p-4 pt-8 glass border-b-0 backdrop-blur-3xl bg-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl neo-gradient flex items-center justify-center p-0.5 shadow-2xl shadow-neon-purple/20">
                    <div className="w-full h-full bg-[#05010d] rounded-2xl flex items-center justify-center">
                      <Download className="w-6 h-6 text-neon-blue" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight italic">{APP_NAME}</h1>
                    <p className="text-[8px] font-black tracking-[0.4em] uppercase text-white/30">Next-Gen Downloader</p>
                  </div>
                </div>
                <NeoButton variant="ghost" className="p-3 aspect-square !rounded-2xl glass">
                  <Search className="w-5 h-5 text-white/60" />
                </NeoButton>
              </div>
            </header>

            {/* Content Container */}
            <main className="flex-1 overflow-x-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScreen}
                  initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {activeScreen === 'home' && <HomeScreen addDownload={addDownloadTask} addToast={addToast} />}
                  {activeScreen === 'downloads' && <DownloadsScreen tasks={tasks} removeTask={removeTask} />}
                  {activeScreen === 'favorites' && <div className="p-20 text-center opacity-30 italic">Collection module loading...</div>}
                  {activeScreen === 'settings' && <SettingsScreen />}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Navigation */}
            <Navbar active={activeScreen} setActive={setActiveScreen} />

            {/* Toast System */}
            <AnimatePresence>
              {toast && <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
