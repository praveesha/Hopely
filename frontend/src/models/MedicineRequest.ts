export enum UrgencyLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ShortageStatus {
  ACTIVE = 'ACTIVE',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export interface MedicineShortage {
  id: string;
  hospitalId: string;
  medicineName: string;
  genericName?: string;
  urgencyLevel: UrgencyLevel;
  quantityNeeded: number;
  unit: string;
  description?: string;
  datePosted: string;
  dateUpdated: string;
  expirationDate?: string;
  status: ShortageStatus;
  contactEmail: string;
  createdBy: string;
  updatedBy: string;
  
  // Funding Information
  estimatedFunding?: number; // Amount in LKR
  fundingCurrency?: string;  // Default: 'LKR'
  costPerUnit?: number;      // Cost per unit in LKR (optional breakdown)
  fundingNote?: string;      // Additional info about funding calculation
}

export interface CreateShortageRequest {
  medicineName: string;
  genericName?: string;
  urgencyLevel: UrgencyLevel;
  quantityNeeded: number;
  unit: string;
  description?: string;
  expirationDate?: string;
  
  // Funding Information
  estimatedFunding?: number; // Amount in LKR
  costPerUnit?: number;      // Cost per unit in LKR (optional)
  fundingNote?: string;      // Additional info about funding calculation
}

export interface UpdateShortageRequest {
  medicineName?: string;
  genericName?: string;
  urgencyLevel?: UrgencyLevel;
  quantityNeeded?: number;
  unit?: string;
  description?: string;
  expirationDate?: string;
  status?: ShortageStatus;
  
  // Funding Information
  estimatedFunding?: number; // Amount in LKR
  costPerUnit?: number;      // Cost per unit in LKR (optional)
  fundingNote?: string;      // Additional info about funding calculation
}