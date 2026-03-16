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
}
