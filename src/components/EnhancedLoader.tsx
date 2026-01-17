import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedLoaderProps {
  isVisible: boolean;
  type?: 'page' | 'transition';
  onComplete?: () => void;
}

const EnhancedLoader: React.FC<EnhancedLoaderProps> = ({
  isVisible,
  type = 'page',
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'loading' | 'completing' | 'complete'>('loading');

  useEffect(() => {
    if (!isVisible) return;

    setProgress(0);
    setStage('loading');

    // Precision timing
    const duration = type === 'page' ? 2200 : 1000;
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          setStage('completing');
          setTimeout(() => {
            setStage('complete');
            onComplete?.();
          }, 600);
          return 100;
        }
        return next;
      });
    }, interval);

    // Failsafe: Ensure loader always completes
    const failsafeTimer = setTimeout(() => {
      setProgress(100);
      setStage('completing');
      setTimeout(() => {
        setStage('complete');
        onComplete?.();
      }, 600);
    }, 3500);

    return () => {
      clearInterval(timer);
      clearTimeout(failsafeTimer);
    };
  }, [isVisible, type, onComplete]);

  if (!isVisible && stage === 'complete') return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-50 text-slate-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: "easeInOut" }
          }}
        >
          {/* Technical Grid Background */}
          <div className="absolute inset-0 z-0 opacity-[0.4]"
            style={{
              backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />

          {/* Geometric Accents */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-20 left-20 w-64 h-64 border border-slate-200 rounded-full opacity-20"
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.1, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-96 h-96 border border-slate-200 rounded-full opacity-20"
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            {/* Diagonal Tech Lines */}
            <div className="absolute top-0 right-0 w-[500px] h-full bg-gradient-to-l from-white via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-0 left-0 w-[500px] h-full bg-gradient-to-r from-white via-transparent to-transparent opacity-80" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl shadow-slate-200/50">
            {/* Central Hexagon/Ring Container */}
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              {/* Outer Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-slate-100"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-accent rounded-full shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
              </motion.div>

              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  fill="none"
                  stroke="#FF6B00" // Brand Accent
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ ease: "linear", duration: 0 }}
                />
              </svg>

              {/* Logo */}
              <motion.div
                className="relative z-20 p-4 bg-white rounded-full shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "backOut" }}
              >
                <Image
                  src="/My-uploads/logo.webp"
                  alt="Aster Logo"
                  width={100}
                  height={100}
                  className="w-12 h-12 object-contain"
                />
              </motion.div>
            </div>

            {/* Data Typography */}
            <div className="flex flex-col items-center gap-1 font-mono text-sm">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 uppercase tracking-widest text-[10px]">System Check</span>
                <motion.span
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>

              <div className="text-3xl font-bold text-slate-800 tracking-tighter">
                {Math.round(progress)}<span className="text-brand-accent text-lg align-top">%</span>
              </div>

              <motion.div
                className="text-brand-accent text-[10px] tracking-[0.2em] font-bold uppercase mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Aster Medicines
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedLoader;