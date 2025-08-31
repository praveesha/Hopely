import { Donation, CreateDonationRequest, DonationStats, DonationsByShortage } from '@/models/Donation'

const API_BASE_URL = '/api'

export class DonationAPI {
  /**
   * Create a new donation record
   */
  static async createDonation(donationData: CreateDonationRequest): Promise<{
    success: boolean;
    donation_id?: string;
    order_id?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error creating donation:', error)
      return { success: false, error: 'Failed to create donation' }
    }
  }

  /**
   * Get donations with optional filters
   */
  static async getDonations(params?: {
    status?: 'all' | 'pending' | 'completed' | 'failed' | 'cancelled';
    hospital_id?: string;
    shortage_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data?: Donation[];
    pagination?: any;
    error?: string;
  }> {
    try {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }
      
      const response = await fetch(`${API_BASE_URL}/donations?${searchParams}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching donations:', error)
      return { success: false, error: 'Failed to fetch donations' }
    }
  }

  /**
   * Get donations for a specific shortage
   */
  static async getDonationsByShortage(shortageId: string): Promise<{
    success: boolean;
    data?: DonationsByShortage;
    error?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/by-shortage/${shortageId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching donations by shortage:', error)
      return { success: false, error: 'Failed to fetch donations' }
    }
  }

  /**
   * Get donation statistics
   */
  static async getDonationTotals(params?: {
    hospital_id?: string;
    shortage_id?: string;
  }): Promise<{
    success: boolean;
    data?: DonationStats;
    error?: string;
  }> {
    try {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }
      
      const response = await fetch(`${API_BASE_URL}/donations/totals?${searchParams}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching donation totals:', error)
      return { success: false, error: 'Failed to fetch donation totals' }
    }
  }

  /**
   * Get donations for multiple shortages with progress calculation
   */
  static async getDonationsWithProgress(shortageIds: string[]): Promise<DonationsByShortage[]> {
    try {
      const promises = shortageIds.map(id => this.getDonationsByShortage(id))
      const results = await Promise.all(promises)
      
      return results
        .filter(result => result.success && result.data)
        .map(result => result.data!)
    } catch (error) {
      console.error('Error fetching donations with progress:', error)
      return []
    }
  }
}
