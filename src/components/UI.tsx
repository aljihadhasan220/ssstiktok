import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

export const NeoButton = React.memo(({ children, onClick, className = "", variant = "primary", disabled = false, title }: any) => {
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
      title={title}
      className={`relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden ${
        variants[variant]
      } ${disabled ? 'opacity-50 cursor-not-allowed shadow-none' : ''} ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </motion.button>
  );
});

export const GlassCard = React.memo(({ children, className = "" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass rounded-3xl p-6 relative overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
));

export const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center p-12 space-y-4">
    <RefreshCw className="w-8 h-8 text-neon-blue animate-spin" />
    <p className="text-[10px] font-black tracking-widest uppercase text-white/20">Syncing Engine...</p>
  </div>
);

export const Toast = React.memo(({ message, type = 'success', onClose }: { message: string, type?: 'success' | 'error', onClose: () => void }) => (
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
    <button onClick={onClose} className="ml-auto text-[var(--text-dim)] hover:text-white transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  </motion.div>
));
