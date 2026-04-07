export interface Product {
    id: string;
    slug?: string;
    name: string;
    description: string;
    category: string;
    dosage: string;
    features: string[];
    images: string[];
    price: number;
    availability: string;
    detailedDescription?: string;
    composition?: string;
    indications?: string;
    dosageInstructions?: string;
    sideEffects?: string;
    precautions?: string;
    isQualityAssured?: boolean;
    isGmpCertified?: boolean;
    isWhoApproved?: boolean;
    stock?: number;
    featured?: boolean;
    /** e.g. ["1g Vial", "500mg Vial"] */
    strengthVariants?: string[];
    /** e.g. ["10 vials/box", "1 vial/box"] */
    packagingOptions?: string[];
    /** e.g. "Store below 25°C, away from light" */
    storageConditions?: string;
    /** e.g. "24 months" */
    shelfLife?: string;
}
