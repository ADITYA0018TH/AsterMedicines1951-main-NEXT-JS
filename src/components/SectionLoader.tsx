import React from 'react';
import { motion } from 'framer-motion';

interface SectionLoaderProps {
  isVisible: boolean;
  title?: string;
  className?: string;
}

const SectionLoader: React.FC<SectionLoaderProps> = ({ 
  isVisible, 
  title = "Loading...",
  className = "" 
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col items-center justify-center py-16 ${className}`}
    >
      {/* DNA Helix Animation */}
      <div className="relative w-16 h-16 mb-4">
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full border-4 border-orange-200 border-t-orange-500 rounded-full" />
        </motion.div>
        <motion.div
          className="absolute inset-2"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full border-2 border-blue-200 border-t-blue-500 rounded-full" />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 font-medium"
      >
        {title}
      </motion.p>

      {/* Pulsing Dots */}
      <div className="flex space-x-1 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-orange-400 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SectionLoader;