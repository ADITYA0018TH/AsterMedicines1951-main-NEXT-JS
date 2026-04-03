"use client";

import { useEffect, useRef } from "react";

interface ProductViewData {
  productId: string;
  productSlug: string;
  productName: string;
  category: string;
}

export function useTrackProductView(product: ProductViewData | null) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!product || tracked.current) return;

    // Prevent duplicate tracking
    tracked.current = true;

    const trackView = async () => {
      try {
        await fetch("/api/analytics/product-views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.productId,
            productSlug: product.productSlug,
            productName: product.productName,
            category: product.category,
            referrer: typeof document !== "undefined" ? document.referrer : undefined,
          }),
        });
      } catch (error) {
        // Silently fail - analytics shouldn't break the page
        console.debug("Failed to track product view:", error);
      }
    };

    // Delay tracking slightly to ensure it's a real view
    const timer = setTimeout(trackView, 1000);

    return () => clearTimeout(timer);
  }, [product]);
}
