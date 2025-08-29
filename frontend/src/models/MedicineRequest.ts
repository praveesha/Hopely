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
}

export interface CreateShortageRequest {
  medicineName: string;
  genericName?: string;
  urgencyLevel: UrgencyLevel;
  quantityNeeded: number;
  unit: string;
  description?: string;
  expirationDate?: string;
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
}