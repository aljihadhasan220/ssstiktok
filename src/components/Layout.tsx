import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Download } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { SUPPORTED_LANGS, LangCode } from '../lib/seo.ts';
import { Screen } from '../types.ts';
import { NeoButton } from './UI.tsx';

export const LanguageSelector = memo(() => {
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
});

export const Footer = memo(({ onNavigate }: { onNavigate: (s: Screen) => void }) => (
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
