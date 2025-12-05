import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Product } from "@/data/products";
import AnimatedList from "./AnimatedList";

interface ProductSearchProps {
  products: Product[];
  onSearchResults: (results: Product[]) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ products, onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      onSearchResults(products);
      setSuggestions([]);
      return;
    }

    const query = debouncedQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.features.some((feature) => feature.toLowerCase().includes(query))
    );

    setSuggestions(filtered);
    onSearchResults(filtered);
  }, [debouncedQuery, products, onSearchResults]);

  const handleClear = () => {
    setSearchQuery("");
    setShowSuggestions(false);
    onSearchResults(products);
  };

  const handleSuggestionClick = (product: Product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    onSearchResults([product]);
  };

  // Highlight matching text in suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-orange-200 text-orange-900 font-semibold rounded px-0.5">
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div ref={searchRef} className="relative z-[300] isolate w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search by product name, category, or description..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => searchQuery && setShowSuggestions(true)}
          className="pl-12 pr-20 py-6 text-lg bg-background rounded-3xl border-2 focus:border-primary shadow-lg"
        />
        {!searchQuery && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        )}
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border-2 border-border rounded-t-3xl rounded-b-3xl shadow-xl z-[400] overflow-hidden">
          <AnimatedList
            items={suggestions}
            onItemSelect={(product) => handleSuggestionClick(product)}
            enableArrowNavigation={true}
            showGradients={false}
            className="w-full"
            displayScrollbar={true}
            renderItem={(product, index, isSelected) => (
              <div className={`w-full px-4 py-3 text-left transition-colors flex items-start gap-3 border-b border-border/10 last:border-b-0 ${isSelected ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-contain rounded bg-white"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{highlightMatch(product.name, debouncedQuery)}</p>
                  <p className="text-sm text-muted-foreground">{highlightMatch(product.category, debouncedQuery)}</p>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {showSuggestions && searchQuery && suggestions.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border-2 border-border rounded-lg shadow-xl z-[400] p-4">
          <p className="text-muted-foreground text-center">No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
