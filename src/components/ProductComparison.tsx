import React from "react";
import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/data/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductComparisonProps {
  products: Product[];
  onRemove: (productId: number) => void;
  onClose: () => void;
  open: boolean;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  onRemove,
  onClose,
  open,
}) => {
  if (products.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Product Comparison ({products.length}/3)
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {products.map((product) => (
            <Card key={product.id} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={() => onRemove(product.id)}
              >
                <X className="w-4 h-4" />
              </Button>

              <CardHeader>
                {product.images?.[0] && (
                  <div className="aspect-square bg-white flex items-center justify-center p-4 rounded-lg mb-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <Badge className="w-fit mb-2">{product.category}</Badge>
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Description
                  </h4>
                  <p className="text-sm">{product.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Dosage
                  </h4>
                  <p className="text-sm font-medium text-primary">{product.dosage}</p>
                </div>

                {product.composition && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                      Composition
                    </h4>
                    <p className="text-sm">{product.composition}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                    Features
                  </h4>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {product.indications && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                      Indications
                    </h4>
                    <p className="text-sm">{product.indications}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductComparison;
