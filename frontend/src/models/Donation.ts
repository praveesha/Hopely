export interface Donation {
  _id?: string;
  
  // Order and Payment References
  order_id: string;
  payment_id?: string;
  shortage_id?: string;
  hospital_id?: string;
  
  // Donor Information
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  donor_address: string;
  donor_city: string;
  
  // Donation Details
  amount: number;
  currency: string;
  medicine_name?: string;
  hospital_name?: string;
  note?: string;
  
  // Payment Gateway Details
  merchant_id: string;
  payment_method?: string;
  payhere_amount?: number;
  payhere_currency?: string;
  
  // Status and Timestamps
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface CreateDonationRequest {
  // Order Reference
  order_id: string;
  shortage_id?: string;
  hospital_id?: string;
  
  // Donor Information
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  donor_address: string;
  donor_city: string;
  
  // Donation Details
  amount: number;
  medicine_name?: string;
  hospital_name?: string;
  note?: string;
  
  // Payment Gateway
  merchant_id: string;
}

export interface DonationStats {
  total_donations: number;
  total_amount: number;
  pending_count: number;
  completed_count: number;
  failed_count: number;
}

export interface DonationsByShortage {
  shortage_id: string;
  total_donated: number;
  donation_count: number;
  estimated_funding?: number; // For future progress calculation
  progress_percentage?: number; // For future progress calculation
  donations: Donation[];
}