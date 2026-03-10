
export interface Address {
  street?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PackageDetails {
  weight: number;
  length: number;
  width: number;
  height: number;
  isInternational: boolean;
  from: Address;
  to: Address;
}

export interface CarrierQuote {
  carrier: 'FedEx' | 'UPS' | 'DHL' | 'USPS';
  serviceName: string;
  basePrice: number;
  estimatedDays: number;
  finalPrice?: number;
}

export interface SavedQuote {
  id: string;
  date: string;
  details: PackageDetails;
  quotes: CarrierQuote[];
  cheapestCarrier: string;
}

export interface Transaction {
  id: string;
  date: string;
  item: string;
  amount: number;
  status: 'Settled' | 'Pending' | 'Refunded';
  method: string;
  type: 'LICENSE' | 'LABEL' | 'PREMIUM';
  fulfillment?: 'DROP_OFF' | 'PICKUP';
  email?: string;
  pickupAddress?: string;
  trackingNumber?: string;
  carrier?: string;
  service?: string;
  packageDetails?: PackageDetails;
}

export type Language = 'en' | 'es';

export enum View {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  QUOTE_FORM = 'QUOTE_FORM',
  HISTORY = 'HISTORY',
  PREMIUM = 'PREMIUM',
  STORE = 'STORE',
  BILLING = 'BILLING',
  ADMIN = 'ADMIN'
}
