import React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductFiltersProps {
  selectedDosageTypes: string[];
  selectedPriceRanges: string[];
  selectedAvailability: string[];
  onDosageTypeChange: (type: string) => void;
  onPriceRangeChange: (range: string) => void;
  onAvailabilityChange: (status: string) => void;
  onClearAll: () => void;
}

const dosageTypes = ["Tablet", "Injection", "Syrup", "Capsule", "Oil", "Drops"];
const priceRanges = ["Under ₹100", "₹100-₹500", "₹500-₹1000", "Above ₹1000"];
const availabilityOptions = ["In Stock", "Limited Stock", "Out of Stock"];

const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedDosageTypes,
  selectedPriceRanges,
  selectedAvailability,
  onDosageTypeChange,
  onPriceRangeChange,
  onAvailabilityChange,
  onClearAll,
}) => {
  const hasActiveFilters =
    selectedDosageTypes.length > 0 ||
    selectedPriceRanges.length > 0 ||
    selectedAvailability.length > 0;

  return (
    <Card className="bg-background border-2">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl">Filters</CardTitle>
        </div>
        {hasActiveFilters && (
          <Button onClick={onClearAll} variant="ghost" size="sm" className="gap-2">
            <X className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dosage Type Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Dosage Type</h3>
          <div className="space-y-2">
            {dosageTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`dosage-${type}`}
                  checked={selectedDosageTypes.includes(type)}
                  onCheckedChange={() => onDosageTypeChange(type)}
                />
                <Label
                  htmlFor={`dosage-${type}`}
                  className="text-sm cursor-pointer text-foreground"
                >
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Price Range</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={range} className="flex items-center space-x-2">
                <Checkbox
                  id={`price-${range}`}
                  checked={selectedPriceRanges.includes(range)}
                  onCheckedChange={() => onPriceRangeChange(range)}
                />
                <Label
                  htmlFor={`price-${range}`}
                  className="text-sm cursor-pointer text-foreground"
                >
                  {range}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Availability</h3>
          <div className="space-y-2">
            {availabilityOptions.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`availability-${status}`}
                  checked={selectedAvailability.includes(status)}
                  onCheckedChange={() => onAvailabilityChange(status)}
                />
                <Label
                  htmlFor={`availability-${status}`}
                  className="text-sm cursor-pointer text-foreground"
                >
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
