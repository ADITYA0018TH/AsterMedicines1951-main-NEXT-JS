import { useEffect, useState } from "react";
import { Product } from "@/data/products";

const STORAGE_KEY = "recently_viewed_products";
const MAX_ITEMS = 5;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse recently viewed products:", error);
      }
    }
  }, []);

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p.id !== product.id);
      // Add to beginning
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { recentlyViewed, addToRecentlyViewed };
};
