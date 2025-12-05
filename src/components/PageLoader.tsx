import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Heart, Shield, Microscope, Syringe } from 'lucide-react';

interface PageLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const PageLoader: React.FC<PageLoaderProps> = ({ isLoading, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentIcon, setCurrentIcon] = useState(0);

  const icons = [
    { Icon: Pill, color: 'text-orange-500', label: 'Medicines' },
    { Icon: Heart, color: 'text-red-500', label: 'Healthcare' },
    { Icon: Shield, color: 'text-green-500', label: 'Safety' },
    { Icon: Microscope, color: 'text-blue-500', label: 'Research' }
  ];

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => onComplete?.(), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      const iconInterval = setInterval(() => {
        setCurrentIcon(prev => (prev + 1) % icons.length);
      }, 800);

      return () => {
        clearInterval(interval);
        clearInterval(iconInterval);
      };
    }
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-orange-50 to-orange-100"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-300 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-300 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-green-300 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          <div className="text-center z-10">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="mb-8"
            >
              <img
                src="/lovable-uploads/logo.png"
                alt="Aster Medicines"
                className="h-16 w-auto mx-auto"
              />
            </motion.div>

            {/* Animated Icons */}
            <div className="mb-8 h-16 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {icons.map((item, index) => (
                  currentIcon === index && (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, y: 20, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      exit={{ scale: 0, y: -20, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center"
                    >
                      <item.Icon className={`w-12 h-12 ${item.color} mb-2`} />
                      <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="w-64 mx-auto mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Loading</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 text-lg font-medium"
            >
              Preparing your healthcare experience...
            </motion.p>

            {/* Floating Pills Animation */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight + 50,
                    rotate: 0,
                    opacity: 0.3
                  }}
                  animate={{
                    y: -50,
                    rotate: 360,
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "linear"
                  }}
                >
                  <Pill className="w-6 h-6 text-orange-700" />
                  <Syringe className="w-6 h-6 text-orange-700 " />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;