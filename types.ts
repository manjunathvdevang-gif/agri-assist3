
export type Language = 'en' | 'hi' | 'kn' | 'te' | 'ta' | 'mr' | 'ml' | 'gu' | 'bn' | 'pa' | 'or' | 'as' | 'ur';
export type UserRole = 'farmer' | 'consumer' | null;

export interface CropPrice {
  id: string;
  name: string;
  mandi: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change?: string;
  msp?: number;
  date: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: any[];
  isListingPrompt?: boolean;
  listingData?: any;
}

export interface UserListing {
  id: string;
  cropName: string;
  quantity: string;
  price: number;
  date: string;
}

export interface BuyerListing {
  id: string;
  buyerName: string;
  location: string;
  distance?: string;
  demandCrop: string;
  targetPrice: number;
  date?: string;
  contacted: boolean;
}

export interface CropDetail {
  name: string;
  growing: string;
  fertilizers: string;
  diseases: string;
  organic: string;
  image: string;
}