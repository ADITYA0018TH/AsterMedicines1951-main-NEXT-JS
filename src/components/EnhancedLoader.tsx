import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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

    const duration = type === 'page' ? 2000 : 800;
    const interval = 50;
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
          }, 500);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible, type, onComplete]);

  const logoVariants: Variants = {
    initial: { scale: 0.8, opacity: 0, rotate: -180 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        scale: { type: "spring", stiffness: 200, damping: 15 }
      }
    },
    exit: {
      scale: 1.2,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" as const }
    }
  };

  const progressBarVariants: Variants = {
    initial: { scaleX: 0 },
    animate: {
      scaleX: progress / 100,
      transition: { duration: 0.3, ease: "easeOut" as const }
    }
  };

  const particleVariants: Variants = {
    animate: {
      y: [0, -20, 0],
      opacity: [0.4, 1, 0.4],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const overlayVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" as const }
    }
  };

  if (!isVisible && stage === 'complete') return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            background: type === 'page'
              ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'
              : 'rgba(0, 0, 0, 0.8)'
          }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#FE5C02] rounded-full opacity-40"
                style={{
                  left: `${(10 + (i * 7)).toFixed(2)}%`,
                  top: `${(20 + Math.sin(i) * 30).toFixed(2)}%`,
                }}
                variants={particleVariants}
                animate="animate"
                custom={i}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            {/* Logo Animation */}
            <motion.div
              className="mb-8"
              variants={logoVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <img
                src="/lovable-uploads/logo.png"
                alt="Aster Logo"
                className="h-16 w-auto mx-auto"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(254,92,2,0.6))",
                }}
              />
            </motion.div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-gray-800 rounded-full mx-auto mb-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FE5C02] to-[#FF8C42] rounded-full origin-left"
                variants={progressBarVariants}
                initial="initial"
                animate="animate"
                style={{
                  boxShadow: '0 0 10px rgba(254,92,2,0.5)'
                }}
              />
            </div>

            {/* Loading Text */}
            <motion.p
              className="text-white/80 text-sm font-medium tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {stage === 'loading' && type === 'page' && 'Initializing Experience...'}
              {stage === 'loading' && type === 'transition' && 'Loading...'}
              {stage === 'completing' && 'Almost Ready...'}
            </motion.p>

            {/* Progress Percentage */}
            <motion.div
              className="text-[#FE5C02] text-xs font-mono mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.round(progress)}%
            </motion.div>
          </div>

          {/* Radial glow effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, rgba(254,92,2,0.1) 0%, transparent 70%)`
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedLoader;