import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px] w-full">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full">
          <div className="w-full h-full border-4 border-transparent border-t-purple-500 rounded-full animate-spin">
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;