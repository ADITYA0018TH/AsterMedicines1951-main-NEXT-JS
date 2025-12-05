import React from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { Clock, Pill } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RecentlyViewedProps {
  products: Product[];
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ products }) => {
  if (products.length === 0) return null;

  return (
    <section className="pb-8 px-4">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Recently Viewed</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-background border cursor-pointer">
                <CardContent className="p-4">
                  {product.images?.[0] ? (
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-3">
                      <Pill className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <h3 className="font-semibold text-sm text-foreground line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
