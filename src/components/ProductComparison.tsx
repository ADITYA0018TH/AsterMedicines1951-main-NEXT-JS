import React from "react";
import Image from "next/image";
import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/data/products";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogClose,
  MorphingDialogContainer,
  useMorphingDialog
} from "@/components/ui/morphing-dialog";

interface ProductComparisonProps {
  products: Product[];
  onRemove: (productId: number) => void;
  trigger: React.ReactNode;
  triggerClassName?: string;
  triggerStyle?: React.CSSProperties;
  disabled?: boolean;
}

const ProductComparisonInner: React.FC<{ products: Product[]; onRemove: (id: number) => void }> = ({ products, onRemove }) => {
  // We can use setIsOpen via hook if needed, but here we just need to render content.
  // The Close button (MorphingDialogClose) handles closing.
  // Ideally we want to close if products become empty?
  const { setIsOpen } = useMorphingDialog();

  React.useEffect(() => {
    if (products.length === 0) {
      setIsOpen(false);
    }
  }, [products.length, setIsOpen]);

  return (
    <div className="relative h-full flex flex-col">
      <MorphingDialogClose className="z-50" />
      <div className="p-6 pb-2">
        <MorphingDialogTitle className="text-2xl font-bold">
          Product Comparison ({products.length}/3)
        </MorphingDialogTitle>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 overflow-y-auto">
        {products.map((product) => (
          <Card key={product.id} className="relative flex flex-col h-full">
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
                <div className="aspect-square bg-white flex items-center justify-center p-4 rounded-lg mb-4 relative">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <Badge className="w-fit mb-2">{product.category}</Badge>
              <CardTitle className="text-lg">{product.name}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 flex-grow">
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
    </div>
  );
}


const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  onRemove,
  trigger,
  triggerClassName,
  triggerStyle,
  disabled
}) => {
  // We still show the trigger even if products is empty?
  // In ProductsContent, the trigger is conditional or always there but disabled?
  // The trigger is always rendered in ProductsContent, but disabled if length < 2.

  return (
    <MorphingDialog transition={{ type: 'spring', bounce: 0.05, duration: 0.25 }}>
      <MorphingDialogTrigger className={triggerClassName} style={triggerStyle} disabled={disabled}>
        {trigger}
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="max-w-7xl w-[95vw] h-[90vh] overflow-hidden bg-background rounded-3xl shadow-2xl border border-border">
          <ProductComparisonInner products={products} onRemove={onRemove} />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
};

export default ProductComparison;
