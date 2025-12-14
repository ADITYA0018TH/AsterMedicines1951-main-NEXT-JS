"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import EnhancedLoader from './EnhancedLoader';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  isInitialLoad: boolean;
  isNavigating: boolean;
  setNavigating: (navigating: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] = useState(pathname);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsInitialLoad(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle navigation loading
  useEffect(() => {
    if (pathname !== previousPathname && !isInitialLoad) {
      setIsNavigating(true);

      const timer = setTimeout(() => {
        setIsNavigating(false);
        setPreviousPathname(pathname);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [pathname, previousPathname, isInitialLoad]);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const setNavigating = (navigating: boolean) => {
    setIsNavigating(navigating);
  };

  return (
    <LoadingContext.Provider value={{
      isLoading,
      setLoading,
      isInitialLoad,
      isNavigating,
      setNavigating
    }}>
      <EnhancedLoader
        isVisible={isLoading && isInitialLoad}
        type="page"
        onComplete={() => setIsLoading(false)}
      />
      <EnhancedLoader
        isVisible={isNavigating}
        type="transition"
        onComplete={() => setIsNavigating(false)}
      />
      {children}
    </LoadingContext.Provider>
  );
};